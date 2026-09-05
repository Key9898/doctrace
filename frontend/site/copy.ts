export type SiteLocale = "my" | "en";

export const SITE_LANG_KEY = "doctrace-site-lang";

export const copy = {
  my: {
    langMy: "မြန်မာ",
    langEn: "EN",
    navProduct: "DocTrace",
    navSupport: "အကူအညီ",
    navPrivacy: "ကိုယ်ရေး",
    navTerms: "စည်းကမ်း",
    skipToContent: "အကြောင်းအရာသို့ ကျော်ရန်",
    placeholderBanner:
      "ဆက်သွယ်ရန်အီးမေးလ်များသည် ယာယီ placeholder ဖြစ်သည်။ client က အစစ်မပေးမီ support@example.com ကို မစောင့်ပါနှင့်။",
    landingTitle: "DocTrace — Excel ထဲက Test of Details",
    kicker: "Excel task pane · Test of Details",
    heroLead: "အထောက်အထားကို workbook အတန်းနဲ့ ချိတ်။ ကြည့်လို့ရအောင် ထား။",
    heroBody:
      "DocTrace က စာရင်းစစ် Test of Details အတွက် Excel add-in ဖြစ်သည်။ နမူနာအတန်း ယူ၊ ပြေစာ/ဘဏ်စာရွက် ထည့်၊ စည်းကမ်းအတိုင်း တွဲ၊ စာမျက်နှာကို snip၊ workbook ထဲ ပြန်ရေးသည်။ Cloud login မလိုအောင် စက်ထဲမှာပဲ စလုပ်နိုင်သည်။",
    colA: "A",
    colB: "B",
    colC: "C",
    colSample: "နမူနာအတန်း",
    colEvidence: "အထောက်အထား",
    colTrace: "Trace log",
    doesTitle: "ဘာလုပ်သလဲ",
    does1Title: "ရွေး၊ ထည့်၊ တွဲ",
    does1Body:
      "Excel ကနမူနာ၊ PDF/ပုံ/JSON အထောက်အထား၊ deterministic matching၊ ISA 230 ဦးတည်ချက် audit log (certified မဟုတ်)။",
    does2Title: "Snip နဲ့ workbook output",
    does2Body:
      "စာမျက်နှာပေါ်က စာသား/ဇယားကို ချိတ်၊ mapped column ပြန်ရေး၊ hidden log sheet။ Windows၊ Mac၊ Excel on the web (Office က ခွင့်ပြုသလောက်)။",
    does3Title: "Local-first",
    does3Body:
      "Default မှာ workbook နဲ့ ဖိုင်က စက်/browser ထဲ။ Optional API ကို မသတ်မှတ်ရင် cloud မပို့။",
    notTitle: "ဘာမဟုတ်လဲ",
    not1: "DataSnipper နဲ့ တူညီတယ်လို့ မပြောပါ။",
    not2: "ISA-certified မဟုတ်ပါ။ ISA 230 oriented log သာ။",
    not3: "Full audit OS၊ Trial Balance suite၊ LLM extraction မဟုတ်ပါ။",
    not4: "Login wall မရှိ။ အကောင့်မရှိလည်း matching သုံးလို့ရသည်။",
    dataTitle: "ဒေတာ ဘယ်မှာလဲ",
    dataBody:
      "Phase 1 client drop က local-first။ IndexedDB နဲ့ workbook က အရင်းအမြစ်။ Optional backend ရှိမှသာ session/backup/mail လမ်းကြောင်း ပွင့်သည်။ အလွတ် VITE_API_URL = မပို့။",
    platformsTitle: "ဘယ်မှာ သုံးမလဲ",
    platformsBody:
      "Excel task pane က အရည်အသွေးစံ။ Browser Preview က showcase။ Sideload လမ်းညွှန်ကို အကူအညီစာမျက်နှာမှာ ကြည့်ပါ။",
    ctaSupport: "အကူအညီ ဖွင့်ရန်",
    ctaPane: "Add-in preview",
    footerNote: "DocTrace · Excel-native Test of Details",
    supportTitle: "DocTrace အကူအညီ",
    supportKicker: "Get Support",
    supportLead:
      "Excel Personality menu က Get Support သည် ဤစာမျက်နှာကို OS browser မှာ ဖွင့်သည်။ Pane ထဲ မဖွင့်ပါ။",
    supportWhatTitle: "Product",
    supportWhatBody:
      "DocTrace သည် Excel ထဲက Test of Details matching add-in။ Local-first။ DataSnipper-identical မဟုတ်။ ISA-certified မဟုတ်။",
    supportHowTitle: "ဘယ်လို ကြည့်မလဲ",
    supportHow1:
      "Sideload: manifest.xml ကို Excel Desktop မှာ တင်၊ Data tab က DocTrace။ Local SupportUrl က https://127.0.0.1:3000/support.html မို့ npm run dev ဖွင့်ထားရမည်။",
    supportHow2:
      "Browser Preview (Excel မရှိရင်): https://127.0.0.1:3000/taskpane.html — အရင် / မဟုတ်တော့ပါ။",
    supportHow3:
      "Production Get Support: https://doctrace-one.vercel.app/support.html (deploy ပြီး၊ npm မလို)။",
    supportDataTitle: "ဒေတာ",
    supportDataBody:
      "Workbook နဲ့ evidence ဖိုင်က စက်ထဲ။ Optional API ဖွင့်မှသာ /auth၊ backup၊ mail။ Matching က API မရရင်လည်း အလုပ်လုပ်သည်။",
    supportHostTitle: "Excel host chrome",
    supportHostBody:
      "ညာဘက်အစွန်းက ပါးလွှာတဲ့ Personality menu (Get Support, Reload, Attach Debugger, Security Info) က Excel ပိုင်သည်။ DocTrace က ပိတ်၊ ပြင်၊ ခလုတ်ထပ် မထည့်နိုင်ပါ။",
    supportContactTitle: "ဆက်သွယ်ရန်",
    supportContactBody: "ယာယီ placeholder (client အစစ်မရမီ):",
    supportEmailLabel: "Support",
    privacyEmailLabel: "Privacy",
    privacyTitle: "ကိုယ်ရေးမူဝါဒ",
    privacyKicker: "Privacy",
    privacyLead:
      "ဤမူဝါဒသည် DocTrace Excel add-in နှင့် ဤ public စာမျက်နှာများအတွက် ဖြစ်သည်။ Terms နှင့် မရောပါ။",
    privacyCollectTitle: "ဘာစုသလဲ",
    privacyCollectBody:
      "Public site က ဘာသာစကားရွေးချယ်မှုကို ဤဘရောက်ဇာ localStorage (doctrace-site-lang) မှာ သိမ်းသည်။ Add-in က workbook/evidence ကို default အနေဖြင့် DocTrace server မပို့ပါ။ Optional API ဖွင့်မှသာ အကောင့်အီးမေးလ်နှင့် session token လမ်းကြောင်းရှိသည်။",
    privacyUseTitle: "ဘာအတွက်သုံးသလဲ",
    privacyUseBody:
      "Site ဘာသာစကား မှတ်ရန်။ Optional cloud က အကောင့်၊ fail-closed backup/mail သာ။ Evidence ကို training data အဖြစ် မသုံးကြောင်း ဤစာမျက်နှာက LLM product မဟုတ်။",
    privacyContactTitle: "ဆက်သွယ်ရန်",
    privacyContactBody: "ကိုယ်ရေးမေးခွန်း (placeholder):",
    termsTitle: "အသုံးပြုမှု စည်းကမ်း",
    termsKicker: "Terms",
    termsLead:
      "DocTrace ကို Excel Test of Details ကိရိယာအဖြစ် ပေးသည်။ ဥပဒေရေးရာ အကြံ မဟုတ်။",
    terms1Title: "ကိရိယာ၊ အာမခံ မဟုတ်",
    terms1Body:
      "Matching နှင့် log သည် ကူညီရန် ဖြစ်သည်။ စာရင်းစစ်အမြင်၊ ISA ထောက်ခံချက်၊ DataSnipper အစားထိုးဟု မယူဆပါ။",
    terms2Title: "Local-first",
    terms2Body:
      "သင့် workbook နဲ့ ဖိုင်က သင့်ပတ်ဝန်းကျင်။ Optional API ကို သင်ကိုယ်တိုင် ဖွင့်မှ cloud လမ်းကြောင်းရှိသည်။",
    terms3Title: "ဆက်သွယ်ရန်",
    terms3Body: "အထွေထွေမေးခွန်း (placeholder):",
  },
  en: {
    langMy: "မြန်မာ",
    langEn: "EN",
    navProduct: "DocTrace",
    navSupport: "Support",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    skipToContent: "Skip to content",
    placeholderBanner:
      "Contact addresses are placeholders. Do not expect mail at support@example.com until the client provides live inboxes.",
    landingTitle: "DocTrace — Test of Details in Excel",
    kicker: "Excel task pane · Test of Details",
    heroLead: "Tie evidence to workbook rows. Leave a trail you can explain.",
    heroBody:
      "DocTrace is an Excel add-in for audit Test of Details. Capture a sample, import invoices and bank support, run deterministic matching, snip source pages, and write workbook-safe outputs. You can start locally with no login wall.",
    colA: "A",
    colB: "B",
    colC: "C",
    colSample: "Sample rows",
    colEvidence: "Evidence",
    colTrace: "Trace log",
    doesTitle: "What it does",
    does1Title: "Select, import, match",
    does1Body:
      "Excel samples, PDF/image/JSON evidence, deterministic matching, an ISA 230-oriented audit log (not ISA-certified).",
    does2Title: "Snips and workbook output",
    does2Body:
      "Page snips, mapped columns, a hidden log sheet. Windows, Mac, and Excel on the web where Office allows.",
    does3Title: "Local-first",
    does3Body:
      "By default, the workbook and files stay on the machine or browser. An optional API is off until configured.",
    notTitle: "What it is not",
    not1: "Not DataSnipper-identical.",
    not2: "Not ISA-certified. The log is ISA 230-oriented only.",
    not3: "Not a full audit OS, Trial Balance suite, or LLM extractor.",
    not4: "No login wall. Matching works without an account.",
    dataTitle: "Where data lives",
    dataBody:
      "The Phase 1 client drop is local-first. IndexedDB and the workbook are the source of truth. Optional auth, backup, and mail exist only when that API is set. Empty VITE_API_URL means nothing is sent.",
    platformsTitle: "Where to run it",
    platformsBody:
      "The Excel task pane is the quality bar. Browser Preview is the showcase. Sideload steps are on the support page.",
    ctaSupport: "Open support",
    ctaPane: "Add-in preview",
    footerNote: "DocTrace · Excel-native Test of Details",
    supportTitle: "DocTrace support",
    supportKicker: "Get Support",
    supportLead:
      "Excel Get Support in the personality menu opens this page in the OS default browser, not inside the task pane.",
    supportWhatTitle: "Product",
    supportWhatBody:
      "DocTrace is an Excel Test of Details matching add-in. Local-first. Not DataSnipper-identical. Not ISA-certified.",
    supportHowTitle: "How to open it",
    supportHow1:
      "Sideload: load manifest.xml in Excel Desktop, then DocTrace on the Data tab. Local SupportUrl is https://127.0.0.1:3000/support.html, so npm run dev must be running.",
    supportHow2:
      "Browser Preview (no Excel): https://127.0.0.1:3000/taskpane.html — no longer the site root /.",
    supportHow3:
      "Production Get Support: https://doctrace-one.vercel.app/support.html after deploy. No local npm.",
    supportDataTitle: "Data",
    supportDataBody:
      "Workbook and evidence files stay on the device. Optional API unlocks /auth, backup, and mail. Matching still works if that API is down.",
    supportHostTitle: "Excel host chrome",
    supportHostBody:
      "The thin personality menu (Get Support, Reload, Attach Debugger, Security Info) belongs to Excel. DocTrace cannot hide, restyle, or add items.",
    supportContactTitle: "Contact",
    supportContactBody: "Placeholder until the client provides live addresses:",
    supportEmailLabel: "Support",
    privacyEmailLabel: "Privacy",
    privacyTitle: "Privacy policy",
    privacyKicker: "Privacy",
    privacyLead:
      "This policy covers the DocTrace Excel add-in and these public pages. It is separate from the terms of use.",
    privacyCollectTitle: "What we collect",
    privacyCollectBody:
      "The public site stores language choice in this browser localStorage key doctrace-site-lang. The add-in does not send workbook or evidence files to a DocTrace server by default. Optional API, when configured, may carry account email and a session token.",
    privacyUseTitle: "How it is used",
    privacyUseBody:
      "Site language only on this origin. Optional cloud is account, fail-closed backup, and mail. This product is not an LLM that trains on your files.",
    privacyContactTitle: "Contact",
    privacyContactBody: "Privacy questions (placeholder):",
    termsTitle: "Terms of use",
    termsKicker: "Terms",
    termsLead:
      "DocTrace is provided as an Excel Test of Details tool. It is not legal advice.",
    terms1Title: "A tool, not an opinion",
    terms1Body:
      "Matching and logs assist work. They are not an audit opinion, ISA certification, or a DataSnipper substitute.",
    terms2Title: "Local-first",
    terms2Body:
      "Your workbook and files stay in your environment. Cloud paths exist only if you enable the optional API.",
    terms3Title: "Contact",
    terms3Body: "General questions (placeholder):",
  },
} as const;

export type CopyKey = keyof typeof copy.my;
