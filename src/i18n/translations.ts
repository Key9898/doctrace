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
  | "results.clearlyTrivial"
  | "results.belowPerformance"
  | "results.materialException"
  | "results.aboveOverall"
  | "results.discrepancyAmount"
  | "results.materialityAssessment"
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
  | "eng.delete"
  | "eng.eqReviewer"
  | "eng.overallMateriality"
  | "eng.performanceMateriality"
  | "eng.trivialThreshold"
  | "eng.lock"
  | "eng.unlock"
  | "eng.locked"
  | "eng.unlocked"
  | "eng.wizard.title"
  | "eng.wizard.step1"
  | "eng.wizard.step2"
  | "eng.wizard.step3"
  | "eng.wizard.step4"
  | "eng.wizard.next"
  | "eng.wizard.back"
  | "eng.wizard.finish"
  | "workflow.kicker"
  | "workflow.title"
  | "workflow.desc"
  | "workflow.badge"
  | "workflow.step1Title"
  | "workflow.step1Desc"
  | "workflow.step2Title"
  | "workflow.step2Desc"
  | "workflow.step3Title"
  | "workflow.step3Desc"
  | "workflow.step4Title"
  | "workflow.step4Desc"
  | "app.working"
  | "app.enabled"
  | "app.disabled"
  | "app.preview"
  | "app.remove"
  | "app.yes"
  | "app.no"
  | "app.notice"
  | "app.success"
  | "app.error"
  | "selection.step"
  | "selection.title"
  | "selection.headersTitle"
  | "selection.headersDesc"
  | "selection.address"
  | "selection.sheet"
  | "selection.rowsCount"
  | "selection.columnsCount"
  | "selection.col"
  | "selection.showingSubset"
  | "selection.emptyState"
  | "selection.captureBtn"
  | "import.step"
  | "import.title"
  | "import.desc"
  | "import.invoiceEvidence"
  | "import.invoiceDesc"
  | "import.browseInvoices"
  | "import.bankStatements"
  | "import.bankDesc"
  | "import.browseBank"
  | "import.jsonSupportTitle"
  | "import.jsonSupportDesc"
  | "import.invoiceLibrary"
  | "import.bankLibrary"
  | "import.pageImported"
  | "import.id"
  | "import.amount"
  | "import.date"
  | "import.jsonSource"
  | "import.emptyState"
  | "config.step"
  | "config.title"
  | "config.desc"
  | "config.suggested"
  | "config.sourceColumns"
  | "config.amountCol"
  | "config.dateCol"
  | "config.refCol"
  | "config.selectCol"
  | "config.matchingLogic"
  | "config.amountTol"
  | "config.dateTol"
  | "config.requireInvoice"
  | "config.allowFuzzy"
  | "config.outputFields"
  | "config.enabledCount"
  | "config.excelMapping"
  | "config.targets"
  | "config.writesInto"
  | "config.selectTarget"
  | "config.emptyState"
  | "config.readyMatch"
  | "config.loadedSummary"
  | "config.matchActive"
  | "config.matchAll"
  | "config.out.invoiceDocument"
  | "config.out.invoiceAmount"
  | "config.out.invoiceDate"
  | "config.out.invoiceNumber"
  | "config.out.bankDocument"
  | "config.out.bankAmount"
  | "config.out.bankDate"
  | "config.out.bankReference"
  | "config.out.status"
  | "config.out.confidence"
  | "results.clear"
  | "results.rematch"
  | "results.averageConfidence"
  | "results.discrepancyCount"
  | "activity.kicker"
  | "activity.title"
  | "activity.desc"
  | "activity.events"
  | "activity.emptyState"
  | "activity.justNow"
  | "viewer.kicker"
  | "viewer.title"
  | "viewer.desc"
  | "viewer.noPreview"
  | "viewer.emptyState"
  | "viewer.pdfFailed"
  | "viewer.fileNotFound"
  | "viewer.extractedSnippet"
  | "viewer.manualSnip"
  | "snips.kicker"
  | "snips.title"
  | "snips.desc"
  | "snips.statCaptured"
  | "snips.statLinked"
  | "snips.statOpen"
  | "snips.emptyState"
  | "snips.linked"
  | "snips.needsLink"
  | "snips.linkAnother"
  | "snips.linkCell"
  | "snips.unlinkCell"
  | "snips.linkTooltip"
  | "snips.removeTooltip"
  | "templates.kicker"
  | "templates.title"
  | "templates.desc"
  | "templates.setups"
  | "templates.nameLabel"
  | "templates.placeholder"
  | "templates.saving"
  | "templates.save"
  | "templates.export"
  | "templates.importLabel"
  | "templates.savedLibrary"
  | "templates.deleteTooltip"
  | "templates.tol"
  | "templates.window"
  | "templates.fields"
  | "templates.apply"
  | "templates.emptyTitle"
  | "templates.emptyDesc"
  | "eng.planningScope"
  | "eng.selectEngagementPrompt"
  | "eng.deleteTitle"
  | "eng.deleteDesc"
  | "eng.deleteBtn"
  | "eng.cancelBtn"
  | "eng.listTitle"
  | "eng.fw.isa"
  | "eng.fw.ias_ifrs"
  | "eng.fw.ifrs_smes"
  | "eng.status.notStarted"
  | "eng.status.inProgress"
  | "eng.status.pendingClient"
  | "eng.status.underReview"
  | "eng.status.clearedPartner"
  | "eng.status.completed"
  | "eng.status.archived"
  | "app.prev"
  | "app.next"
  | "viewer.liveInspection"
  | "viewer.renderingPdf"
  | "viewer.detectedMetadata"
  | "viewer.invoiceNum"
  | "viewer.amountVal"
  | "viewer.dateVal"
  | "viewer.statementEntries"
  | "viewer.relevantSnippets"
  | "viewer.captureSnippet"
  | "viewer.snipBtn"
  | "eng.clientRequired"
  | "eng.createdSuccess"
  | "eng.deletedSuccess"
  | "eng.responded"
  | "eng.closed"
  | "eng.pbc.uploaded"
  | "eng.pbc.approved";

const translations: Record<AppLocale, Record<TranslationKey, string>> = {
  "my-MM": {
    "app.skip": "အဓိကအကြောင်းအရာသို့ ကျော်သွားရန်",
    "app.workspace": "Excel စာရင်းစစ်လုပ်ငန်းခွင်",
    "app.excelConnected": "Excel ချိတ်ဆက်ပြီး",
    "app.browserPreview": "Browser စမ်းသပ်ပြသမှုစနစ်",
    "app.booting": "စတင်နေသည်",
    "app.description":
      "Excel အတွင်း Substantive Test of Details စစ်ဆေးမှုများအတွက် အချက်အလက် တိုက်ဆိုင်စစ်ဆေးပေးသည့် စနစ် ဖြစ်သည်။",
    "app.selection": "စာရင်းရွေးချယ်မှု",
    "app.documents": "သက်သေခံ စာရွက်စာတမ်းများ",
    "app.results": "တိုက်ဆိုင်စစ်ဆေးမှု ရလဒ်များ",
    "app.status": "လုပ်ငန်း အခြေအနေ",
    "app.none": "မရွေးရသေးပါ",
    "app.ready": "အသင့်ဖြစ်ပါပြီ",
    "app.language": "ဘာသာစကား",
    "app.browserWarning":
      "စမ်းသပ်ပြသမှုစနစ် (Browser preview mode) ဖြစ်နေပါသည်။ စာရင်းဇယားရွေးချယ်ခြင်း၊ ရလဒ်များကို Excel ထဲသို့ ပြန်လည်ရေးသားခြင်းနှင့် Hidden audit log များ သိမ်းဆည်းရန်အတွက် Excel အတွင်း DocTrace ကို ဖွင့်လှစ်အသုံးပြုပေးပါ။",
    "quick.kicker": "အမြန်စမ်းသပ်မှု",
    "quick.title": "Demo workflow ကိုအရင် Run ပါ",
    "quick.description":
      "ဒီ actions တွေက Excel/browser workflow ကိုတကယ်လုပ်ပြီး result တွေကို activity feed ထဲမှာပြပါမယ်။",
    "quick.prepare": "Demo workspace ပြင်ဆင်ပါ",
    "quick.capture": "လက်ရှိ selection ကိုဖမ်းယူပါ",
    "quick.loadInvoices": "Sample invoice JSON တင်ပါ",
    "quick.loadBank": "Sample bank JSON တင်ပါ",
    "quick.mapping": "Suggested mapping သုံးပါ",
    "project.kicker": "DOCTRACE အကြောင်း",
    "project.title":
      "အလိုအလျောက် သက်သေခံစာရွက်စာတမ်း တိုက်ဆိုင်စစ်ဆေးရေးအင်ဂျင်",
    "project.description":
      "စာရင်းဇယားပါ အချက်အလက်များကို Invoice နှင့် Bank Statement သက်သေခံစာရွက်စာတမ်းများနှင့် တိကျသေချာစွာ တိုက်ဆိုင်စစ်ဆေးပေးသည်။",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDF များမှ စာသားကို တိုက်ရိုက်ဖတ်ခြင်း၊ Scanned image (ပုံရိပ်ဖတ်စနစ်) များကို OCR ဖြင့် ဖတ်ခြင်းနှင့် စနစ်တကျ ပြင်ဆင်ထားသော JSON ဖိုင်များမှ ပြေစာနံပါတ်၊ ရက်စွဲ၊ ပမာဏနှင့် သက်သေခံချက်များကို အလိုအလျောက် ထုတ်ယူနိုင်ပါသည်။",
    "project.statementTitle": "Statement-side traceability",
    "project.statementBody":
      "ဘဏ်ရှင်းတမ်းလိုင်းများ (Bank statement lines) ကို ရက်စွဲ၊ ပမာဏနှင့် ကိုးကားချက် ဆန်ခါတင်များအဖြစ် ခွဲခြမ်းဆန်းစစ်ပြီး (parse) ချိတ်ဆက်ထားသော worksheet ကော်လံများနှင့် workbook ၏ စာရင်းစစ်မှတ်တမ်း (workbook audit log) ထဲသို့ ရေးသားပေးပါသည်။",
    "results.kicker": "Step 4",
    "results.title": "တိုက်ဆိုင်စစ်ဆေးပြီး ရလဒ်များအား စစ်ဆေးပါ",
    "results.description":
      "ကွာဟချက်များကို ဆန်းစစ်ပြီး သက်သေခံအချက်အလက်များနှင့် စာရင်းစစ်ဆေးမှုမှတ်တမ်း (Audit Trail) ကို တင်ပို့နိုင်ပါသည်။",
    "results.exportCsv": "CSV Export",
    "results.rows": "Rows",
    "results.showingRows": "ပြသထားသည်",
    "results.loadMore": "နောက်ထပ် Rows များ ဖော်ပြပါ",
    "results.matched": "တိုက်ဆိုင်မှုရှိသည် (Matched)",
    "results.partial": "တစ်စိတ်တစ်ပိုင်း ကိုက်ညီသည် (Partial)",
    "results.exception": "လွဲမှားမှုရှိသည် (Exception)",
    "results.confidence": "ယုံကြည်စိတ်ချရမှုနှုန်း (Confidence)",
    "results.discrepancy": "ကွာဟချက်များ ဆန်းစစ်ချက်",
    "results.row": "Row",
    "results.score": "ရမှတ် (Score)",
    "results.invoiceEvidence": "Invoice သက်သေခံချက်",
    "results.bankEvidence": "ဘဏ်သက်သေခံချက်",
    "results.noLinkedSource": "ချိတ်ဆက်ထားသည့် သက်သေခံစာရွက်စာတမ်း မရှိပါ",
    "results.inspectTrace": "ချိတ်ဆက်မှု ဆန်းစစ်ရန်",
    "results.noResults": "ရလဒ် မရှိသေးပါ",
    "results.noResultsDescription":
      "စာရင်းဇယား တိုက်ဆိုင်စစ်ဆေးမှုကို Step 3 တွင် လုပ်ဆောင်ပြီး စာရင်းစစ်ဆေးမှုမှတ်တမ်းများ ထုတ်ယူပါ။",
    "results.clearlyTrivial": "ဂရုမပြုလောက်သော လွဲမှားမှု (Clearly Trivial)",
    "results.belowPerformance":
      "လုပ်ငန်းဆောင်ရွက်မှု အရေးကြီးမှုအဆင့်အောက် လွဲမှားမှု (Below Performance)",
    "results.materialException": "အရေးကြီးသော လွဲမှားမှု (Material Exception)",
    "results.aboveOverall":
      "အလုံးစုံ အရေးကြီးမှုအဆင့်အထက် လွဲမှားမှု (Above Overall)",
    "results.discrepancyAmount": "ကွာဟချက်ပမာဏ",
    "results.materialityAssessment": "အရေးကြီးမှု ဆန်းစစ်ချက်",
    "status.matched": "တိုက်ဆိုင်မှုရှိသည်",
    "status.partial": "တစ်စိတ်တစ်ပိုင်းကိုက်ညီ",
    "status.exception": "လွဲမှားမှုရှိသည်",
    "nav.matching": "🛠️ စာရင်းတိုက်ဆိုင်စစ်ဆေးရေး",
    "nav.engagements": "📊 Engagement Dashboard",
    "nav.trialBalance": "⚖️ Trial Balance",
    "nav.workpapers": "📁 Audit Workpapers",
    "nav.clientPortal": "🌐 Client PBC Portal",
    "eng.title": "စာရင်းစစ်လုပ်ငန်းများနှင့် Dashboard",
    "eng.kicker": "DocTrace Modules",
    "eng.new": "စာရင်းစစ်လုပ်ငန်း အသစ်ဖန်တီးရန်",
    "eng.clientName": "ကလိုင်းယင့်အမည်",
    "eng.financialYear": "ဘဏ္ဍာရေးနှစ် (FY)",
    "eng.framework": "စာရင်းစစ် စံနှုန်းသတ်မှတ်ချက် (Framework)",
    "eng.status": "အခြေအနေ",
    "eng.create": "ဖန်တီးမည်",
    "eng.cancel": "ပယ်ဖျက်မည်",
    "eng.team": "Audit စစ်ဆေးရေးအဖွဲ့ ဖွဲ့စည်းပုံ",
    "eng.partner": "Engagement Partner (စာရင်းစစ်ပါတနာ)",
    "eng.manager": "Audit Manager (မန်နေဂျာ)",
    "eng.senior": "Senior Auditor (အကြီးတန်းစာရင်းစစ်)",
    "eng.associate": "Associate (အငယ်တန်းစာရင်းစစ်)",
    "eng.progress": "စာရင်းစစ်ဆေးမှု တိုးတက်မှုအခြေအနေ",
    "eng.workpapers": "ပြီးစီးခဲ့သော စာရင်းစစ်မှတ်တမ်းတွဲများ (Workpapers)",
    "eng.reviewNotes": "ကျန်ရှိနေသေးသော စစ်ဆေးချက်မှတ်စုများ (Review Notes)",
    "eng.pbcRequests": "PBC စာရွက်စာတမ်း တောင်းဆိုမှုများ",
    "eng.delete": "ဖျက်သိမ်းမည်",
    "eng.eqReviewer": "EQ Reviewer (အရည်အသွေး ဆန်းစစ်သူ)",
    "eng.overallMateriality": "Overall Materiality (အလုံးစုံ အရေးကြီးမှုအဆင့်)",
    "eng.performanceMateriality":
      "Performance Materiality (လုပ်ငန်းဆောင်ရွက်မှု အရေးကြီးမှုအဆင့်)",
    "eng.trivialThreshold": "Trivial Threshold (ဂရုမပြုလောက်သည့် အဆင့်)",
    "eng.lock": "စာရင်းစစ်ဆေးမှု လော့ခ်ချရန် (Lock)",
    "eng.unlock": "စာရင်းစစ်ဆေးမှု လော့ခ်ပြန်ဖွင့်ရန် (Unlock)",
    "eng.locked": "လော့ခ်ချပြီး",
    "eng.unlocked": "လော့ခ်မချရသေး",
    "eng.wizard.title": "Engagement Setup Wizard",
    "eng.wizard.step1": "လုပ်ငန်းအခြေခံအချက်အလက်များ",
    "eng.wizard.step2": "အရေးကြီးမှုအဆင့်သတ်မှတ်ချက် (Materiality)",
    "eng.wizard.step3": "စာရင်းစစ်အဖွဲ့ဝင်များသတ်မှတ်ခြင်း",
    "eng.wizard.step4": "အကျဉ်းချုပ်နှင့် အတည်ပြုခြင်း",
    "eng.wizard.next": "ရှေ့သို့",
    "eng.wizard.back": "နောက်သို့",
    "eng.wizard.finish": "စတင်မည်",
    "workflow.kicker": "လုပ်ငန်းစဉ်",
    "workflow.title": "စာရွက်စာတမ်း တိုက်ဆိုင်စစ်ဆေးမှု အဆင့်ဆင့်",
    "workflow.desc":
      "လုပ်ငန်းစဉ် ခြုံငုံသုံးသပ်ချက်သာ ဖြစ်သည်။ တစ်ဆင့်ချင်းစီ လုပ်ဆောင်ရန် အထက်ပါ အပြန်အလှန်အကျိုးပြုစနစ်များကို အသုံးပြုပါ။",
    "workflow.badge": "Phase 1 (v1.0.0)",
    "workflow.step1Title": "နမူနာစာရင်း ရွေးချယ်ဖမ်းယူခြင်း",
    "workflow.step1Desc": "Excel မှ နမူနာစာရင်းလိုင်းများကို ရွေးချယ်ပါ",
    "workflow.step2Title": "သက်သေခံစာရွက်စာတမ်း တင်သွင်းခြင်း",
    "workflow.step2Desc": "ရောင်းပြေစာများနှင့် ဘဏ်ရှင်းတမ်းများကို တင်ပါ",
    "workflow.step3Title": "ကိုက်ညီမှုစံနှုန်း သတ်မှတ်ခြင်း",
    "workflow.step3Desc": "ကော်လံများ ချိတ်ဆက်ခြင်းနှင့် ကွာဟချက်သတ်မှတ်ခြင်း",
    "workflow.step4Title": "ရလဒ်များကို စစ်ဆေးခြင်း",
    "workflow.step4Desc": "ရလဒ်များ ရေးသားပြီး သက်သေခံချက်များကို စစ်ဆေးပါ",
    "app.working": "ဆောင်ရွက်နေသည်...",
    "app.enabled": "ဖွင့်ထားသည်",
    "app.disabled": "ပိတ်ထားသည်",
    "app.preview": "စမ်းသပ်ကြည့်ရှုမည်",
    "app.remove": "ဖယ်ထုတ်မည်",
    "app.yes": "ဟုတ်ကဲ့",
    "app.no": "မရှိပါ/မဟုတ်ပါ",
    "app.notice": "အသိပေးချက်",
    "app.success": "အောင်မြင်သည်",
    "app.error": "မှားယွင်းမှု",
    "selection.step": "အဆင့် ၁",
    "selection.title": "နမူနာစာရင်း ရွေးချယ်ဖမ်းယူခြင်း",
    "selection.headersTitle": "ပထမဆုံးလိုင်းသည် ကော်လံခေါင်းစဉ်များ ဖြစ်သည်",
    "selection.headersDesc":
      "တိကျသေချာသော ကော်လံချိတ်ဆက်မှုအတွက် ဖွင့်ထားရန် အကြံပြုအပ်ပါသည်။",
    "selection.address": "လိပ်စာ (Address)",
    "selection.sheet": "စာမျက်နှာ (Sheet)",
    "selection.rowsCount": "လိုင်းအရေအတွက်",
    "selection.columnsCount": "ကော်လံအရေအတွက်",
    "selection.col": "ကော်လံ",
    "selection.showingSubset":
      "စုစုပေါင်း လိုင်းပေါင်း {rowCount} အနက် ပထမဆုံး ၅ လိုင်းကို ပြသထားသည်",
    "selection.emptyState":
      "နမူနာစာရင်း တိုက်ဆိုင်စစ်ဆေးမှုကို စတင်ရန် Excel တွင် sample range ကို ရွေးချယ်ပြီး ဖမ်းယူပေးပါ။",
    "selection.captureBtn": "Selection ဖမ်းယူမည်",
    "import.step": "အဆင့် ၂",
    "import.title": "သက်သေခံစာရွက်စာတမ်း တင်သွင်းခြင်း",
    "import.desc":
      "PDF၊ ပုံရိပ်များ (images) နှင့် စနစ်တကျ ပြင်ဆင်ထားသော JSON bundles များကို တင်သွင်းနိုင်ပါသည်။",
    "import.invoiceEvidence": "ပြေစာ (Invoice) သက်သေခံချက်များ",
    "import.invoiceDesc": "PDF၊ Scan ပုံများ သို့မဟုတ် JSON ဖိုင်တွဲများ",
    "import.browseInvoices": "Invoices ရှာဖွေတင်သွင်းမည်",
    "import.bankStatements": "ဘဏ်ရှင်းတမ်းများ (Bank Statements)",
    "import.bankDesc":
      "ငွေစာရင်းလွှဲပြောင်းမှုမှတ်တမ်း သို့မဟုတ် စာရင်းတိုက်ဆိုင်မှုဖိုင်များ",
    "import.browseBank": "ဘဏ်ဖိုင်များ ရှာဖွေတင်သွင်းမည်",
    "import.jsonSupportTitle": "JSON သက်သေခံချက် ပံ့ပိုးမှုစနစ်",
    "import.jsonSupportDesc":
      "DocTrace သည် သက်သေခံစာရွက်စာတမ်းမျိုးစုံ ပါဝင်သော JSON ဖိုင်များကို အလိုအလျောက် တင်သွင်းပေးနိုင်သည်။ စတင်ရန် Browse မှတဆင့် ရွေးချယ်ပါ။",
    "import.invoiceLibrary": "ပြေစာ (Invoice) စာကြည့်တိုက်",
    "import.bankLibrary": "ဘဏ်ရှင်းတမ်း (Bank Statement) စာကြည့်တိုက်",
    "import.pageImported": "စာမျက်နှာ - တင်သွင်းပြီးရက်စွဲ",
    "import.id": "ID (နံပါတ်)",
    "import.amount": "ပမာဏ",
    "import.date": "ရက်စွဲ",
    "import.jsonSource": "JSON သက်သေခံချက်",
    "import.emptyState":
      "ဤဖိုဒါအတွင်း ဖိုင်မရှိသေးပါ။ စတင်ရန် သက်သေခံစာရွက်စာတမ်းအချို့ တင်သွင်းပေးပါ။",
    "config.step": "အဆင့် ၃",
    "config.title": "ကိုက်ညီမှုစံနှုန်း သတ်မှတ်ခြင်း",
    "config.desc":
      "DocTrace ၏ စာရင်းတိုက်ဆိုင်စစ်ဆေးမှုပုံစံနှင့် Excel workbook သို့ ပြန်လည်ရေးသားမည့် နည်းလမ်းကို သတ်မှတ်ပါ။",
    "config.suggested": "အကြံပြုထားသည့် ချိတ်ဆက်မှုစနစ်",
    "config.sourceColumns": "မူရင်း စာရင်းဇယား ကော်လံများ",
    "config.amountCol": "ပမာဏကော်လံ (Amount column)",
    "config.dateCol": "ရက်စွဲကော်လံ (Date column)",
    "config.refCol": "ပြေစာ/ကိုးကားချက်ကော်လံ (Invoice/reference column)",
    "config.selectCol": "ကော်လံတစ်ခု ရွေးချယ်ပါ",
    "config.matchingLogic": "တိုက်ဆိုင်စစ်ဆေးမှု ယုတ္တိဗေဒ (Matching Logic)",
    "config.amountTol": "ခွင့်ပြုနိုင်သော ကွာဟချက်ပမာဏ (Amount tolerance)",
    "config.dateTol": "ခွင့်ပြုနိုင်သော ရက်စွဲကွာဟချက် (ရက်စွဲ ဝင်းဒိုး)",
    "config.requireInvoice": "ပြေစာနံပါတ် တိကျစွာ ကိုက်ညီရန် လိုအပ်သည်",
    "config.allowFuzzy": "စာသား အနီးစပ်ဆုံး တိုက်ဆိုင်စစ်ဆေးမှုကို ခွင့်ပြုသည်",
    "config.outputFields": "ရလဒ်အဖြစ် ရေးသားမည့် ကော်လံများ (Output Fields)",
    "config.enabledCount": "ခု ဖွင့်ထားသည်",
    "config.excelMapping":
      "Excel ရလဒ် ကော်လံများ ချိတ်ဆက်ခြင်း (Excel Output Mapping)",
    "config.targets": "ခု ချိတ်ဆက်ထားသည်",
    "config.writesInto": "ဤကော်လံသို့ ရေးသားမည် -",
    "config.selectTarget": "ရလဒ်ရေးသားမည့် ကော်လံကို ရွေးချယ်ပါ",
    "config.emptyState":
      "Excel output mapping စံနှုန်းများကို သတ်မှတ်ရန် Excel နမူနာဇယားကို အရင်ဆုံး ဖမ်းယူပေးပါ။",
    "config.readyMatch": "တိုက်ဆိုင်စစ်ဆေးရန် အသင့်ဖြစ်ပါပြီ",
    "config.loadedSummary":
      "ပြေစာ {invoiceCount} စောင်နှင့် ဘဏ်ရှင်းတမ်း {bankCount} ခု တင်သွင်းပြီးပါပြီ။",
    "config.matchActive": "ရွေးထားသောလိုင်းကိုသာ တိုက်စစ်မည်",
    "config.matchAll": "လိုင်းအားလုံးကို တိုက်ဆိုင်စစ်ဆေးမည်",
    "config.out.invoiceDocument": "ပြေစာဖိုင်အမည် (Invoice document)",
    "config.out.invoiceAmount": "ပြေစာပါ ပမာဏ (Invoice amount)",
    "config.out.invoiceDate": "ပြေစာပါ ရက်စွဲ (Invoice date)",
    "config.out.invoiceNumber": "ပြေစာနံပါတ် (Invoice number)",
    "config.out.bankDocument": "ဘဏ်ရှင်းတမ်းဖိုင်အမည် (Bank document)",
    "config.out.bankAmount": "ဘဏ်ရှင်းတမ်းပါ ပမာဏ (Bank amount)",
    "config.out.bankDate": "ဘဏ်ရှင်းတမ်းပါ ရက်စွဲ (Bank date)",
    "config.out.bankReference": "ဘဏ်ရှင်းတမ်းပါ ကိုးကားချက် (Bank reference)",
    "config.out.status": "တိုက်ဆိုင်စစ်ဆေးမှု အခြေအနေ (Status)",
    "config.out.confidence": "ယုံကြည်စိတ်ချရမှုနှုန်း (Confidence)",
    "results.clear": "တိုက်ဆိုင်မှု ဖျက်သိမ်းမည်",
    "results.rematch": "ထပ်မံ တိုက်ဆိုင်စစ်ဆေးမည်",
    "results.averageConfidence": "ပျမ်းမျှ ယုံကြည်စိတ်ချရမှုနှုန်း",
    "results.discrepancyCount": "ကွာဟချက် စုစုပေါင်း",
    "activity.kicker": "တိုက်ရိုက်လှုပ်ရှားမှုမှတ်တမ်း",
    "activity.title": "DocTrace ၏ လက်ရှိလုပ်ဆောင်ချက်များ",
    "activity.desc":
      "ကလစ်နှိပ်မှုတိုင်းကို ဤနေရာတွင် ဖော်ပြပေးမည်ဖြစ်ရာ Excel ဘက်မှ အမှားအယွင်းများကို DevTools ဖွင့်စရာမလိုဘဲ တွေ့မြင်နိုင်ပါသည်။",
    "activity.events": "ခု တွေ့ရှိရသည်",
    "activity.emptyState":
      "နမူနာလုပ်ငန်းခွင် ပြင်ဆင်ခြင်း ကဲ့သို့သော လုပ်ဆောင်ချက်များကို ကလစ်နှိပ်ပါက ရလဒ်များ ဤနေရာတွင် ပေါ်လာပါမည်။",
    "activity.justNow": "ခုတင်တင်",
    "viewer.kicker": "ကြည့်ရှုစနစ်",
    "viewer.title": "သက်သေခံချက်အား စမ်းသပ်ကြည့်ရှုခြင်း",
    "viewer.desc":
      "ထုတ်ယူထားသော စာရင်းစစ် သက်သေခံချက်များကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုဆန်းစစ်ရန်။",
    "viewer.noPreview": "ကြည့်ရှုရန် မရှိသေးပါ",
    "viewer.emptyState":
      "ကြည့်ရှုစနစ်ကို အသုံးပြုရန် သက်သေခံဖိုင်များ တင်သွင်းပါ သို့မဟုတ် ကိုက်ညီသော စာရင်းလိုင်းတစ်ခုကို ရွေးချယ်ပါ။",
    "viewer.pdfFailed": "PDF စမ်းသပ်ကြည့်ရှုမှု မအောင်မြင်ပါ။",
    "viewer.fileNotFound":
      "ဒေသတွင်းသိုလှောင်မှုတွင် ဖိုင်ကို ရှာမတွေ့ပါ။ ကျေးဇူးပြု၍ ဖိုင်ကို ပြန်လည်တင်ပေးပါ။",
    "viewer.extractedSnippet": "ထုတ်ယူထားသော အကျဉ်းချုပ်",
    "viewer.manualSnip": "ကိုယ်တိုင် ဖြတ်ညုံချက်",
    "snips.kicker": "အမြင်အာရုံ ဖြတ်ညှပ်စနစ် (Visual Snipping)",
    "snips.title": "ဖြတ်ညှပ်ထားသော သက်သေခံချက်များ",
    "snips.desc":
      "သက်သေခံချက် အချက်အလက်များစွာကို ဖမ်းယူပြီး အရင်းအမြစ်တစ်ခုချင်းစီကို ဆန်းစစ်ကာ Excel သို့ ပြန်လည်ချိတ်ဆက်ပါ။",
    "snips.statCaptured": "ဖမ်းယူပြီး",
    "snips.statLinked": "ချိတ်ဆက်ပြီး",
    "snips.statOpen": "ကျန်ရှိ",
    "snips.emptyState":
      "ကြည့်ရှုစနစ်တွင် Snip mode ကို ဖွင့်ပြီး သက်သေခံချက်များ စုဆောင်းရန် PDF စာသား သို့မဟုတ် ပုံရိပ်အပိုင်းအခြားများကို ကလစ်နှိပ်ပါ။",
    "snips.linked": "ချိတ်ဆက်ပြီး",
    "snips.needsLink": "ချိတ်ဆက်ရန် လိုအပ်သည်",
    "snips.linkAnother": "အခြားတစ်ခု ချိတ်ဆက်မည်",
    "snips.linkCell": "Cell သို့ ချိတ်ဆက်မည်",
    "snips.unlinkCell": "Excel Cell ချိတ်ဆက်မှု ဖြုတ်မည်",
    "snips.linkTooltip": "ရွေးချယ်ထားသော Excel Cell သို့ ချိတ်ဆက်ရန်",
    "snips.removeTooltip": "ဤ Snip ကို ဖယ်ရှားရန်",
    "templates.kicker": "ပုံစံခွက်များ (Templates)",
    "templates.title": "လုပ်ငန်းခွင်နှင့် အဖွဲ့လိုက် မျှဝေအသုံးပြုမှုများ",
    "templates.desc":
      "တူညီသော တိုက်ဆိုင်စစ်ဆေးမှုပုံစံများကို အခြား စာရင်းဇယားများနှင့် စာရင်းစစ် ပရောဂျက်များတွင် ပြန်လည်အသုံးပြုပါ။",
    "templates.setups": "ခု သိမ်းဆည်းထားသည်",
    "templates.nameLabel": "ပုံစံခွက်အမည် (Template Name)",
    "templates.placeholder": "ဥပမာ - အထွေထွေအသုံးစရိတ် စစ်ဆေးမှု စံနှုန်း",
    "templates.saving": "သိမ်းဆည်းနေသည်...",
    "templates.save": "Template သိမ်းဆည်းမည်",
    "templates.export": "JSON ထုတ်ယူမည်",
    "templates.importLabel": "သတ်မှတ်ချက်များ တင်သွင်းမည်",
    "templates.savedLibrary": "သိမ်းဆည်းထားသော ပုံစံခွက်များ",
    "templates.deleteTooltip": "Template ဖျက်သိမ်းမည်",
    "templates.tol": "ကွာဟချက် ±",
    "templates.window": "ရက်စွဲဝင်းဒိုး",
    "templates.fields": "ကော်လံများ",
    "templates.apply": "သတ်မှတ်ချက်ကို အသုံးချမည်",
    "templates.emptyTitle": "ပုံစံခွက်များ မရှိသေးပါ",
    "templates.emptyDesc":
      "လက်ရှိ ကော်လံချိတ်ဆက်မှုများနှင့် ကွာဟချက်စံနှုန်းများကို အခြားလုပ်ငန်းခွင်များတွင် ပြန်လည်အသုံးပြုရန် ပုံစံခွက်အဖြစ် သိမ်းဆည်းပါ။",
    "eng.planningScope": "စာရင်းစစ် အစီအစဉ်နှင့် အတိုင်းအတာ (Planning & Scope)",
    "eng.selectEngagementPrompt":
      "အသေးစိတ်အချက်အလက်များနှင့် Dashboard ကိုကြည့်ရှုရန် ဘယ်ဘက်မှ Engagement တစ်ခု ရွေးချယ်ပါ သို့မဟုတ် အသစ်ဖန်တီးပါ။",
    "eng.deleteTitle": "Engagement လုပ်ငန်းကို ဖျက်သိမ်းမလား။",
    "eng.deleteDesc":
      '"{name}" စာရင်းစစ်လုပ်ငန်းကို ဖျက်ရန် သေချာပါသလား။ ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။',
    "eng.deleteBtn": "ဖျက်သိမ်းမည်",
    "eng.cancelBtn": "မလုပ်တော့ပါ",
    "eng.listTitle": "လုပ်ငန်းများ",
    "eng.fw.isa": "ISA (နိုင်ငံတကာစာရင်းစစ်စံနှုန်းများ)",
    "eng.fw.ias_ifrs":
      "IAS / IFRS (နိုင်ငံတကာဘဏ္ဍာရေးအစီရင်ခံတင်ပြမှုစံနှုန်းများ)",
    "eng.fw.ifrs_smes":
      "IFRS for SMEs (အသေးစားနှင့်အလတ်စားလုပ်ငန်းများစံနှုန်း)",
    "eng.status.notStarted": "မစတင်ရသေးပါ",
    "eng.status.inProgress": "လုပ်ဆောင်နေဆဲ",
    "eng.status.pendingClient": "ကလိုင်းယင့်ထံမှ စောင့်ဆိုင်းဆဲ",
    "eng.status.underReview": "စိစစ်နေဆဲ (Under Review)",
    "eng.status.clearedPartner":
      "ပါတနာ စစ်ဆေးရန် အသင့်ဖြစ် (Cleared for Partner)",
    "eng.status.archived": "မော်ကွန်းထိန်းသိမ်းပြီး",
    "eng.status.completed": "ပြီးစီးပါပြီ",
    "app.prev": "နောက်သို့",
    "app.next": "ရှေ့သို့",
    "viewer.liveInspection": "တိုက်ရိုက်စစ်ဆေးဆဲ",
    "viewer.renderingPdf": "PDF ဖိုင်ကို ပြသရန် ပြင်ဆင်နေသည်...",
    "viewer.detectedMetadata": "အလိုအလျောက်ဖတ်ရှိထားသော Metadata",
    "viewer.invoiceNum": "ပြေစာနံပါတ်",
    "viewer.amountVal": "ပမာဏ",
    "viewer.dateVal": "ရက်စွဲ",
    "viewer.statementEntries": "ဘဏ်ရှင်းတမ်း စာရင်းလိုင်းများ",
    "viewer.relevantSnippets": "ကိုက်ညီသော ဖြတ်ညှပ်ချက်များ",
    "viewer.captureSnippet": "ဤ ဖြတ်ညှပ်ချက်အား ဖမ်းယူရန်",
    "viewer.snipBtn": "ဖြတ်ညှပ်မည်",
    "eng.clientRequired": "ကလိုင်းယင့်အမည် ထည့်သွင်းပေးရန် လိုအပ်သည်",
    "eng.createdSuccess": "Engagement အသစ်ကို အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ",
    "eng.deletedSuccess": "Engagement ကို ဖျက်ပြီးပါပြီ",
    "eng.responded": "အကြောင်းပြန်ပြီး",
    "eng.closed": "ပိတ်သိမ်းပြီး",
    "eng.pbc.uploaded": "တင်သွင်းပြီး (စစ်ဆေးရန်လိုအပ်)",
    "eng.pbc.approved": "အတည်ပြုပြီး သက်သေခံချက်",
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
    "project.kicker": "ABOUT DOCTRACE",
    "project.title": "Automated Document Matching Engine",
    "project.description":
      "Deterministic verification of ledger rows against supporting invoices and bank statements.",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDFs are parsed directly, scanned evidence falls back to local OCR, and structured data imports are supported for automated verification.",
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
    "results.clearlyTrivial": "Clearly Trivial Discrepancy",
    "results.belowPerformance": "Below Performance Materiality",
    "results.materialException": "Material Exception",
    "results.aboveOverall": "Above Overall Materiality",
    "results.discrepancyAmount": "Discrepancy Amount",
    "results.materialityAssessment": "Materiality Assessment",
    "status.matched": "Matched",
    "status.partial": "Partial",
    "status.exception": "Exception",
    "nav.matching": "🛠️ Matching Workspace",
    "nav.engagements": "📊 Engagement Dashboard",
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
    "eng.eqReviewer": "EQ Reviewer (Quality Reviewer)",
    "eng.overallMateriality": "Overall Materiality",
    "eng.performanceMateriality": "Performance Materiality",
    "eng.trivialThreshold": "Trivial Threshold",
    "eng.lock": "Lock Engagement",
    "eng.unlock": "Unlock Engagement",
    "eng.locked": "Locked",
    "eng.unlocked": "Unlocked",
    "eng.wizard.title": "Engagement Setup Wizard",
    "eng.wizard.step1": "Basic Info",
    "eng.wizard.step2": "Materiality & Scope",
    "eng.wizard.step3": "Team Assignment",
    "eng.wizard.step4": "Summary & Confirm",
    "eng.wizard.next": "Next",
    "eng.wizard.back": "Back",
    "eng.wizard.finish": "Finish",
    "workflow.kicker": "Workflow",
    "workflow.title": "Document Matching Workflow",
    "workflow.desc":
      "Progress overview only. Use the interactive controls above to run each step.",
    "workflow.badge": "Phase 1 (v1.0.0)",
    "workflow.step1Title": "Capture sample",
    "workflow.step1Desc": "Select sample rows from Excel",
    "workflow.step2Title": "Import evidence",
    "workflow.step2Desc": "Load invoices and bank statements",
    "workflow.step3Title": "Configure match",
    "workflow.step3Desc": "Map columns and set thresholds",
    "workflow.step4Title": "Review output",
    "workflow.step4Desc": "Write results and inspect evidence",
    "app.working": "Working...",
    "app.enabled": "Enabled",
    "app.disabled": "Disabled",
    "app.preview": "Preview",
    "app.remove": "Remove",
    "app.yes": "Yes",
    "app.no": "No",
    "app.notice": "Notice",
    "app.success": "Success",
    "app.error": "Error",
    "selection.step": "Step 1",
    "selection.title": "Select your sample data",
    "selection.headersTitle": "First row includes headers",
    "selection.headersDesc": "Recommended for deterministic field mapping.",
    "selection.address": "Address",
    "selection.sheet": "Sheet",
    "selection.rowsCount": "Rows",
    "selection.columnsCount": "Columns",
    "selection.col": "Col",
    "selection.showingSubset": "Showing first 5 of {rowCount} rows",
    "selection.emptyState":
      "Select a sample range in Excel, then capture it here to unlock matching.",
    "selection.captureBtn": "Capture selection",
    "import.step": "Step 2",
    "import.title": "Import your evidence",
    "import.desc":
      "Support for PDF, image, and structured JSON evidence bundles.",
    "import.invoiceEvidence": "Invoice Evidence",
    "import.invoiceDesc": "PDFs, scans, or JSON bundles",
    "import.browseInvoices": "Browse invoices",
    "import.bankStatements": "Bank Statements",
    "import.bankDesc": "Transaction scans or exports",
    "import.browseBank": "Browse bank files",
    "import.jsonSupportTitle": "JSON Evidence Support",
    "import.jsonSupportDesc":
      "DocTrace automatically imports multi-document JSON payloads into the matching workflow. Choose your JSON file via Browse to import.",
    "import.invoiceLibrary": "Invoices Library",
    "import.bankLibrary": "Bank statements Library",
    "import.pageImported": "page(s) - Imported",
    "import.id": "ID",
    "import.amount": "Amount",
    "import.date": "Date",
    "import.jsonSource": "JSON Source",
    "import.emptyState":
      "No files in this folder. Import some evidence to get started.",
    "config.step": "Step 3",
    "config.title": "Finalize your document match",
    "config.desc":
      "Configure how DocTrace should match and write back to your workbook.",
    "config.suggested": "Suggested mapping",
    "config.sourceColumns": "Source Columns",
    "config.amountCol": "Amount column",
    "config.dateCol": "Date column",
    "config.refCol": "Invoice/reference column",
    "config.selectCol": "Select a column",
    "config.matchingLogic": "Matching Logic",
    "config.amountTol": "Amount tolerance",
    "config.dateTol": "Date tolerance (days)",
    "config.requireInvoice": "Require invoice alignment",
    "config.allowFuzzy": "Allow fuzzy text matching",
    "config.outputFields": "Output Fields",
    "config.enabledCount": "enabled",
    "config.excelMapping": "Excel Output Mapping",
    "config.targets": "targets",
    "config.writesInto": "Writes into",
    "config.selectTarget": "Select target column",
    "config.emptyState":
      "Capture the Excel sample first to unlock editor-side output mapping.",
    "config.readyMatch": "Ready to match",
    "config.loadedSummary":
      "{invoiceCount} invoice(s) and {bankCount} bank statement(s) loaded.",
    "config.matchActive": "Match active row",
    "config.matchAll": "Match all rows",
    "config.out.invoiceDocument": "Invoice document",
    "config.out.invoiceAmount": "Invoice amount",
    "config.out.invoiceDate": "Invoice date",
    "config.out.invoiceNumber": "Invoice number",
    "config.out.bankDocument": "Bank document",
    "config.out.bankAmount": "Bank amount",
    "config.out.bankDate": "Bank date",
    "config.out.bankReference": "Bank reference",
    "config.out.status": "Status",
    "config.out.confidence": "Confidence",
    "results.clear": "Clear match",
    "results.rematch": "Re-match",
    "results.averageConfidence": "Average Confidence",
    "results.discrepancyCount": "Total Discrepancies",
    "activity.kicker": "Live activity",
    "activity.title": "What DocTrace is doing now",
    "activity.desc":
      "Every click reports here so Excel-side failures are visible without opening DevTools.",
    "activity.events": "event(s)",
    "activity.emptyState":
      "Click an action like Prepare demo workspace and the results will appear here.",
    "activity.justNow": "just now",
    "viewer.kicker": "Viewer",
    "viewer.title": "Evidence preview",
    "viewer.desc": "Real-time visual inspection of extracted audit evidence.",
    "viewer.noPreview": "No active preview",
    "viewer.emptyState":
      "Import evidence files or select a matched row to unlock the task pane viewer.",
    "viewer.pdfFailed": "PDF preview failed.",
    "viewer.fileNotFound":
      "Document file not found in local storage. Please re-upload the document.",
    "viewer.extractedSnippet": "extracted-snippet",
    "viewer.manualSnip": "manual-snip",
    "snips.kicker": "Visual Snipping",
    "snips.title": "Snip review queue",
    "snips.desc":
      "Capture multiple evidence points, review each source, then link the right values back to Excel.",
    "snips.statCaptured": "Captured",
    "snips.statLinked": "Linked",
    "snips.statOpen": "Open",
    "snips.emptyState":
      "Turn on Snip mode in the viewer, then click PDF text, image regions, or extracted snippets to build your evidence queue.",
    "snips.linked": "Linked",
    "snips.needsLink": "Needs link",
    "snips.linkAnother": "Link another",
    "snips.linkCell": "Link cell",
    "snips.unlinkCell": "Unlink this Excel cell",
    "snips.linkTooltip": "Link to the selected Excel cell",
    "snips.removeTooltip": "Remove this snip",
    "templates.kicker": "Templates",
    "templates.title": "Workbook and team-shared setups",
    "templates.desc":
      "Replicate matching logic across workbooks and team audit projects.",
    "templates.setups": "setups",
    "templates.nameLabel": "Template Name",
    "templates.placeholder": "e.g. Expense testing baseline",
    "templates.saving": "Saving...",
    "templates.save": "Save Template",
    "templates.export": "Export JSON",
    "templates.importLabel": "Import Configuration",
    "templates.savedLibrary": "Saved Library",
    "templates.deleteTooltip": "Delete template",
    "templates.tol": "Tol. ±",
    "templates.window": "d Window",
    "templates.fields": "Fields",
    "templates.apply": "Apply Setup",
    "templates.emptyTitle": "No templates yet",
    "templates.emptyDesc":
      "Save your current column mapping and thresholds to reuse them across different workbooks.",
    "eng.planningScope": "Planning & Scope",
    "eng.selectEngagementPrompt":
      "Please select or create an engagement from the left panel to view the dashboard.",
    "eng.deleteTitle": "Delete Engagement?",
    "eng.deleteDesc":
      'Are you sure you want to delete "{name}"? This action cannot be undone.',
    "eng.deleteBtn": "Delete",
    "eng.cancelBtn": "Cancel",
    "eng.listTitle": "Engagements",
    "eng.fw.isa": "ISA",
    "eng.fw.ias_ifrs": "IAS / IFRS",
    "eng.fw.ifrs_smes": "IFRS for SMEs",
    "eng.status.notStarted": "Not Started",
    "eng.status.inProgress": "In Progress",
    "eng.status.pendingClient": "Pending Client",
    "eng.status.underReview": "Under Review",
    "eng.status.clearedPartner": "Cleared for Partner Review",
    "eng.status.archived": "Archived",
    "eng.status.completed": "Completed",
    "app.prev": "Prev",
    "app.next": "Next",
    "viewer.liveInspection": "Live Inspection",
    "viewer.renderingPdf": "Rendering PDF...",
    "viewer.detectedMetadata": "Detected Metadata",
    "viewer.invoiceNum": "Invoice",
    "viewer.amountVal": "Amount",
    "viewer.dateVal": "Date",
    "viewer.statementEntries": "statement entries",
    "viewer.relevantSnippets": "Relevant Snippets",
    "viewer.captureSnippet": "Capture this extracted snippet",
    "viewer.snipBtn": "Snip",
    "eng.clientRequired": "Client name is required",
    "eng.createdSuccess": "New engagement created successfully",
    "eng.deletedSuccess": "Engagement deleted successfully",
    "eng.responded": "Responded",
    "eng.closed": "Closed",
    "eng.pbc.uploaded": "Uploaded (Needs Review)",
    "eng.pbc.approved": "Approved evidence",
  },
};

export function translate(locale: AppLocale, key: TranslationKey) {
  return translations[locale][key] ?? translations["en-US"][key] ?? key;
}
