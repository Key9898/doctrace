param (
    [string]$FilePath
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$tempDir = Join-Path $env:TEMP ([Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    [System.IO.Compression.ZipFile]::ExtractToDirectory($FilePath, $tempDir)
    $xmlPath = Join-Path $tempDir "word/document.xml"
    if (Test-Path $xmlPath) {
        [xml]$xml = Get-Content -Path $xmlPath -Encoding UTF8
        # Extract text elements
        $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
        $textNodes = $xml.SelectNodes("//w:t", $ns)
        $text = ""
        foreach ($node in $textNodes) {
            $text += $node.InnerText + " "
        }
        Write-Output $text
    } else {
        Write-Error "word/document.xml not found in the docx archive."
    }
} finally {
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir
    }
}
