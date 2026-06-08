import fs from "fs";

function collectRegexMatches(text, pattern, groupIndex = 0) {
  const matches = [];
  const flags = pattern.global ? pattern.flags : `${pattern.flags}g`;
  const safePattern = new RegExp(pattern.source, flags);
  let match;

  while ((match = safePattern.exec(text)) !== null) {
    const value = match[groupIndex];
    if (value) {
      matches.push(value);
    }
    if (safePattern.lastIndex === match.index) {
      safePattern.lastIndex += 1;
    }
  }
  return matches;
}

function extractInvoiceIdentifiers(text) {
  const exactMatches = collectRegexMatches(
    text,
    /\b(?:invoice|inv|reference|ref|voucher|receipt)\s*(?:no|number|#|nr)?[:\s-]*([a-z0-9-]{4,})\b/gi,
    1,
  );
  const fallbackTokens = collectRegexMatches(text, /\b[A-Z0-9-]{6,}\b/g);

  const candidates = [...new Set([...exactMatches, ...fallbackTokens])];

  const EXCLUDED_WORDS = new Set([
    "bill",
    "to",
    "from",
    "date",
    "due",
    "invoice",
    "receipt",
    "reference",
    "statement",
    "payment",
    "amount",
    "total",
    "tax",
    "vat",
    "consignee",
    "client",
    "vendor",
    "customer",
    "terms",
    "description",
    "qty",
    "quantity",
    "price",
    "subtotal",
    "phone",
    "email",
    "address",
    "page",
    "code",
    "bank",
    "account",
    "number",
    "value",
    "name",
    "charges",
    "service",
    "office",
  ]);

  return candidates.filter((token) => {
    const norm = token.toLowerCase();

    // Exclude dates (e.g. 2026-05-02, 2026/05/02)
    if (/^\d{4}[/.-]\d{2}[/.-]\d{2}$/.test(token)) return false;

    // Exclude pure numbers of 4 digits or less (e.g. years like 2026)
    if (/^\d{1,4}$/.test(token)) return false;

    // Exclude if it's in the excluded words set
    if (EXCLUDED_WORDS.has(norm)) return false;

    return true;
  });
}

const data = JSON.parse(
  fs.readFileSync("./samples/sample-invoices.json", "utf8"),
);

data.documents.forEach((doc) => {
  const text = doc.pages[0].text;
  console.log(`Document: ${doc.fileName}`);
  const ids = extractInvoiceIdentifiers(text);
  console.log(`  Extracted Invoice IDs:`, ids);
  console.log(`  First Selected ID:`, ids[0] || "None");
});
