import type { AppLocale } from "./locales";

export type TranslationKey =
  | "app.skip"
  | "app.workspace"
  | "app.excelConnected"
  | "app.browserPreview"
  | "app.booting"
  | "app.description"
  | "app.selection"
  | "app.documents"
  | "app.results"
  | "app.status"
  | "app.none"
  | "app.ready"
  | "app.language"
  | "app.browserWarning"
  | "quick.kicker"
  | "quick.title"
  | "quick.description"
  | "quick.prepare"
  | "quick.capture"
  | "quick.loadInvoices"
  | "quick.loadBank"
  | "quick.mapping"
  | "project.kicker"
  | "project.title"
  | "project.description"
  | "project.invoiceTitle"
  | "project.invoiceBody"
  | "project.statementTitle"
  | "project.statementBody"
  | "results.kicker"
  | "results.title"
  | "results.description"
  | "results.exportCsv"
  | "results.rows"
  | "results.showingRows"
  | "results.loadMore"
  | "results.matched"
  | "results.partial"
  | "results.exception"
  | "results.confidence"
  | "results.discrepancy"
  | "results.row"
  | "results.score"
  | "results.invoiceEvidence"
  | "results.bankEvidence"
  | "results.noLinkedSource"
  | "results.inspectTrace"
  | "results.noResults"
  | "results.noResultsDescription"
  | "status.matched"
  | "status.partial"
  | "status.exception"
  | "nav.matching"
  | "nav.engagements"
  | "nav.trialBalance"
  | "nav.workpapers"
  | "nav.clientPortal"
  | "eng.title"
  | "eng.kicker"
  | "eng.new"
  | "eng.clientName"
  | "eng.financialYear"
  | "eng.framework"
  | "eng.status"
  | "eng.create"
  | "eng.cancel"
  | "eng.team"
  | "eng.partner"
  | "eng.manager"
  | "eng.senior"
  | "eng.associate"
  | "eng.progress"
  | "eng.workpapers"
  | "eng.reviewNotes"
  | "eng.pbcRequests"
  | "eng.delete";

const translations: Record<AppLocale, Record<TranslationKey, string>> = {
  "my-MM": {
    "app.skip": "အဓိကအကြောင်းအရာသို့ ကျော်သွားရန်",
    "app.workspace": "Excel စာရင်းစစ် Workspace",
    "app.excelConnected": "Excel ချိတ်ဆက်ပြီး",
    "app.browserPreview": "Browser Preview",
    "app.booting": "စတင်နေသည်",
    "app.description":
      "Excel ထဲမှာတိုက်ရိုက်သုံးနိုင်တဲ့ Test of Details အတွက် deterministic document matching workflow ဖြစ်ပါတယ်။",
    "app.selection": "ရွေးချယ်မှု",
    "app.documents": "စာရွက်စာတမ်း",
    "app.results": "ရလဒ်",
    "app.status": "အခြေအနေ",
    "app.none": "မရွေးရသေးပါ",
    "app.ready": "အသင့်ဖြစ်ပါပြီ",
    "app.language": "ဘာသာစကား",
    "app.browserWarning":
      "Browser preview mode ဖြစ်နေပါတယ်။ Worksheet selection capture, mapped output write-back, hidden audit log update တွေသုံးရန် Excel ထဲမှာ DocTrace ကိုဖွင့်ပါ။",
    "quick.kicker": "အမြန်စမ်းသပ်မှု",
    "quick.title": "Demo workflow ကိုအရင် Run ပါ",
    "quick.description":
      "ဒီ actions တွေက Excel/browser workflow ကိုတကယ်လုပ်ပြီး result တွေကို activity feed ထဲမှာပြပါမယ်။",
    "quick.prepare": "Demo workspace ပြင်ဆင်ပါ",
    "quick.capture": "လက်ရှိ selection ကိုဖမ်းယူပါ",
    "quick.loadInvoices": "Sample invoice JSON တင်ပါ",
    "quick.loadBank": "Sample bank JSON တင်ပါ",
    "quick.mapping": "Suggested mapping သုံးပါ",
    "project.kicker": "Project အခြေအနေ",
    "project.title": "ဒီ MVP က audit teams အတွက် ဘာကြောင့်အလုပ်ဖြစ်လဲ",
    "project.description":
      "Traceability မြင့်တဲ့ deterministic audit evidence matching workflow ဖြစ်ပါတယ်။",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDF, scanned image/OCR, JSON evidence bundle တွေထဲက invoice number, date, amount, reviewer snippets တွေကို extract လုပ်နိုင်ပါတယ်။",
    "project.statementTitle": "Statement-side traceability",
    "project.statementBody":
      "Bank statement lines တွေကို date, amount, reference candidates အဖြစ် parse လုပ်ပြီး mapped worksheet columns နဲ့ workbook audit log ထဲကိုရေးပေးပါတယ်။",
    "results.kicker": "Step 4",
    "results.title": "Matched outputs စစ်ဆေးပါ",
    "results.description":
      "Discrepancy တွေစစ်ဆေးပြီး evidence trace ကိုကြည့်နိုင်၊ audit trail ကို export လုပ်နိုင်ပါတယ်။",
    "results.exportCsv": "CSV Export",
    "results.rows": "row(s)",
    "results.showingRows": "ပြထားသည်",
    "results.loadMore": "နောက်ထပ် rows ပြပါ",
    "results.matched": "Matched",
    "results.partial": "Partial",
    "results.exception": "Exception",
    "results.confidence": "Confidence",
    "results.discrepancy": "Discrepancy Analysis",
    "results.row": "Row",
    "results.score": "Score",
    "results.invoiceEvidence": "Invoice Evidence",
    "results.bankEvidence": "Bank Evidence",
    "results.noLinkedSource": "Linked source မရှိသေးပါ",
    "results.inspectTrace": "Trace ကြည့်မည်",
    "results.noResults": "ရလဒ် မရှိသေးပါ",
    "results.noResultsDescription":
      "Step 3 မှာ document match run လုပ်ပြီး audit trail result ထုတ်ပါ။",
    "status.matched": "Matched",
    "status.partial": "Partial",
    "status.exception": "Exception",
    "nav.matching": "🛠️ စာရင်းတိုက်ဆိုင်စစ်ဆေးရေး",
    "nav.engagements": "📊 စာရင်းစစ်လုပ်ငန်း စီမံခန့်ခွဲမှု",
    "nav.trialBalance": "⚖️ Trial Balance စစ်ဆေးရေး",
    "nav.workpapers": "📁 Audit Workpapers",
    "nav.clientPortal": "🌐 Client PBC Portal",
    "eng.title": "လုပ်ငန်းပရောဂျက်များနှင့် Dashboard",
    "eng.kicker": "DocTrace Modules",
    "eng.new": "Engagement အသစ်ဖန်တီးရန်",
    "eng.clientName": "ကလိုင်းယင့်အမည်",
    "eng.financialYear": "စာရင်းကိုင်နှစ်",
    "eng.framework": "အသုံးပြုမည့် Standard",
    "eng.status": "အခြေအနေ",
    "eng.create": "ဖန်တီးမည်",
    "eng.cancel": "မလုပ်တော့ပါ",
    "eng.team": "Audit စစ်ဆေးရေးအဖွဲ့ ဖွဲ့စည်းပုံ",
    "eng.partner": "Audit Partner (မန်နေဂျင်းပါတနာ)",
    "eng.manager": "Audit Manager (မန်နေဂျာ)",
    "eng.senior": "Senior Auditor (အကြီးတန်းစာရင်းစစ်)",
    "eng.associate": "Associate (အငယ်တန်းစာရင်းစစ်)",
    "eng.progress": "Audit ပြီးစီးမှုနှုန်း",
    "eng.workpapers": "Workpapers ပြီးစီးမှု",
    "eng.reviewNotes": "ကျန်ရှိနေသော Review Notes",
    "eng.pbcRequests": "Client PBC တောင်းဆိုမှုများ",
    "eng.delete": "ဖျက်မည်",
  },
  "en-US": {
    "app.skip": "Skip to main content",
    "app.workspace": "Excel audit workspace",
    "app.excelConnected": "Excel connected",
    "app.browserPreview": "Browser preview",
    "app.booting": "Booting",
    "app.description":
      "Deterministic document matching for Test of Details workflows, built for audit teams working directly in Excel.",
    "app.selection": "Selection",
    "app.documents": "Documents",
    "app.results": "Results",
    "app.status": "Status",
    "app.none": "None",
    "app.ready": "Ready",
    "app.language": "Language",
    "app.browserWarning":
      "Browser preview mode is active. Open DocTrace inside Excel to capture worksheet selections, write mapped output columns, and update the hidden audit log.",
    "quick.kicker": "Quick Start",
    "quick.title": "Run a real demo first",
    "quick.description":
      "These actions now perform real work in Excel and report every result in the live activity feed below.",
    "quick.prepare": "Prepare demo workspace",
    "quick.capture": "Capture current selection",
    "quick.loadInvoices": "Load sample invoices JSON",
    "quick.loadBank": "Load sample bank JSON",
    "quick.mapping": "Apply suggested mapping",
    "project.kicker": "Project Status",
    "project.title": "Why this MVP works for audit teams",
    "project.description":
      "DataSnipper-style document matching built for deterministic audit evidence.",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDFs are parsed directly, scanned evidence falls back to OCR, and JSON evidence bundles are supported for structured imports.",
    "project.statementTitle": "Statement-side traceability",
    "project.statementBody":
      "Bank statement lines are parsed into date, amount, and reference candidates, then written into mapped worksheet columns with a workbook audit log.",
    "results.kicker": "Step 4",
    "results.title": "Review matched outputs",
    "results.description":
      "Analyze discrepancies, view evidence, and export audit trails.",
    "results.exportCsv": "Export CSV",
    "results.rows": "rows",
    "results.showingRows": "Showing",
    "results.loadMore": "Load more rows",
    "results.matched": "Matched",
    "results.partial": "Partial",
    "results.exception": "Exception",
    "results.confidence": "Confidence",
    "results.discrepancy": "Discrepancy Analysis",
    "results.row": "Row",
    "results.score": "Score",
    "results.invoiceEvidence": "Invoice Evidence",
    "results.bankEvidence": "Bank Evidence",
    "results.noLinkedSource": "No linked source",
    "results.inspectTrace": "Inspect Trace",
    "results.noResults": "No results yet",
    "results.noResultsDescription":
      "Run a document match in Step 3 to generate discrepancies and reviewable audit trails.",
    "status.matched": "Matched",
    "status.partial": "Partial",
    "status.exception": "Exception",
    "nav.matching": "🛠️ Matching Workspace",
    "nav.engagements": "📊 Project Dashboard",
    "nav.trialBalance": "⚖️ Trial Balance",
    "nav.workpapers": "📁 Workpapers",
    "nav.clientPortal": "🌐 Client Portal",
    "eng.title": "Audit Engagements & Dashboard",
    "eng.kicker": "DocTrace Modules",
    "eng.new": "Create New Engagement",
    "eng.clientName": "Client Name",
    "eng.financialYear": "Financial Year",
    "eng.framework": "Auditing Framework",
    "eng.status": "Status",
    "eng.create": "Create",
    "eng.cancel": "Cancel",
    "eng.team": "Audit Team Assignment",
    "eng.partner": "Engagement Partner",
    "eng.manager": "Audit Manager",
    "eng.senior": "Senior Auditor",
    "eng.associate": "Audit Associate",
    "eng.progress": "Audit Progress",
    "eng.workpapers": "Workpapers Done",
    "eng.reviewNotes": "Outstanding Review Notes",
    "eng.pbcRequests": "Client PBC Requests",
    "eng.delete": "Delete",
  },
};

export function translate(locale: AppLocale, key: TranslationKey) {
  return translations[locale][key] ?? translations["en-US"][key] ?? key;
}
