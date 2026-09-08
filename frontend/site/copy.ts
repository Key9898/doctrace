export type SiteLocale = "my" | "en";

export const SITE_LANG_KEY = "doctrace-site-lang";

export const copy = {
  my: {
    langSwitch: "EN",
    langSwitchAria: "Switch to English",
    navProduct: "DocTrace",
    navGuide: "လမ်းညွှန်",
    navSupport: "အကူအညီ",
    navFaq: "အမေးအဖြေ",
    navContact: "ဆက်သွယ်ရန်",
    navPrivacy: "ကိုယ်ရေးမူဝါဒ",
    navTerms: "အသုံးပြုမှု စည်းကမ်း",
    navSignIn: "ဝင်မည်",
    navSignUp: "အကောင့်ဖွင့်မည်",
    navProfile: "ပရိုဖိုင်",
    navSignOut: "ထွက်မည်",
    navMenu: "မီနူး",
    skipToContent: "အဓိကအကြောင်းအရာသို့ ကျော်ရန်",
    dockMail: "အီးမေးလ်",
    dockFacebook: "Facebook",
    dockYouTube: "YouTube",
    dockViber: "Viber",
    landingTitle: "DocTrace — Excel ထဲက Test of Details",
    kicker: "Excel task pane · Test of Details",
    heroLead:
      "Excel ထဲမှာ နမူနာအတန်းများကို ပြေစာနှင့် ဘဏ်အထောက်အထားနှင့် ချိတ်ပါ။",
    heroBody:
      "Tests of details လုပ်သော စာရင်းစစ်နှင့် associate များအတွက် Excel add-in။ အများအားဖြင့် expense နှင့် accounts payable။ နမူနာယူ၊ အထောက်အထားထည့်၊ Match၊ စာမျက်နှာကို snip၊ workbook ထဲ ပြန်ရေး။ အကောင့်မရှိလည်း Matching သုံးနိုင်သည်။ Optional cloud မချိတ်ရင် ဖိုင်က ဤကွန်ပျူတာ သို့မဟုတ် browser ထဲမှာပဲ။",
    colA: "A",
    colB: "B",
    colC: "C",
    colSample: "နမူနာအတန်း",
    colEvidence: "အထောက်အထား",
    colTrace: "အထောက်အထား မှတ်တမ်း",
    doesTitle: "ဘာလုပ်သလဲ",
    does1Title: "နမူနာနှင့် အထောက်အထား",
    does1Body:
      "Excel က နမူနာအတန်းယူပါ။ ပြေစာနှင့် ဘဏ်အထောက်အထားကို PDF၊ ပုံ၊ သို့မဟုတ် JSON အဖြစ် တင်သွင်းပါ။ PDF မှာ ရွေးလို့ရသော စာမရှိရင် add-in က ဤစက်ထဲမှာ စာမျက်နှာကို ဖတ်နိုင်သည်။",
    does2Title: "Match နှင့် snip",
    does2Body:
      "အတန်းများကို အထောက်အထားနှင့် Match လုပ်ပါ။ စာမျက်နှာကို snip ၍ reviewer က ချိတ်ကို မြင်အောင် ထားပါ။",
    does3Title: "Workbook ထဲ ပြန်ရေးရန်",
    does3Body:
      "Mapped column နှင့် hidden log sheet က workbook ထဲမှာပဲ ရှိသည်။ Windows၊ Mac၊ Excel on the web (Office က ခွင့်ပြုသလောက်)။",
    notTitle: "ဘာမဟုတ်လဲ",
    not1: "DataSnipper-identical မဟုတ်ပါ။",
    not2: "ISA-certified မဟုတ်ပါ။ IAASB က ဆော့ဖ်ဝဲကို certify မလုပ်ပါ။",
    not3: "LLM extractor မဟုတ်ပါ။",
    not4: "Login wall မရှိ။ အကောင့်မရှိလည်း Matching သုံးလို့ရသည်။",
    not5: "Matching နှင့် log သည် tests of details (ISA 330) ကို ကူညီသည်။ စာရင်းစစ်အမြင် မဟုတ်။ Sufficient appropriate evidence (ISA 500) နှင့် documentation (ISA 230) က auditor တာဝန်။",
    dataTitle: "ဖိုင်တွေ ဘယ်မှာလဲ",
    dataBody:
      "Optional cloud မချိတ်ရင် workbook နှင့် အထောက်အထားသည် ဤကွန်ပျူတာ သို့မဟုတ် browser ထဲမှာပဲ ရှိသည်။ Matching က အကောင့်မလိုပါ။",
    platformsTitle: "ဘယ်မှာ သုံးမလဲ",
    platformsBody:
      "Excel က တကယ့်ထုတ်ကုန်။ Excel မဖွင့်ထားရင် Add-in preview က browser မှာ ဖွင့်သည်။ ဖွင့်ပုံကို လမ်းညွှန်စာမျက်နှာမှာ ကြည့်ပါ။",
    ctaSupport: "Excel မှာ ဖွင့်ပုံ",
    ctaPane: "Add-in preview",
    footerNote: "DocTrace · Excel-native Test of Details",
    footerPowered: "Powered By Studio Next Steps. All rights reserved.",
    supportTitle: "DocTrace အကူအညီ",
    supportKicker: "အကူအညီ",
    supportLead:
      "Excel မှာ DocTrace ဖွင့်ပုံ၊ workbook နှင့် evidence ဘယ်မှာ၊ ဘယ်သူ့ကို ဆက်သွယ်ရမလဲ။ Matching က အကောင့်မလိုပါ။",
    supportHubGuideBody:
      "Excel မှာ ဖွင့်ပုံ၊ matching အဆင့်များ၊ pane screenshot။",
    supportHubFaqBody: "အကောင့်၊ ဖိုင်၊ Excel နှင့် add-in အကြောင်း အဖြေတို။",
    supportHubContactBody: "Mailbox နှင့် form။ ထိုလိပ်စာများ live မဟုတ်သေးပါ။",
    supportContactTitle: "ဆက်သွယ်ရန်",
    supportContactBody: "Customer က လိပ်စာပေးသည်အထိ ဤလိပ်စာများ live မဟုတ်ပါ။",
    supportFaqTitle: "အမေးအဖြေ",
    supportSeeFaq: "အမေးအဖြေ အပြည့်",
    privacyEmailLabel: "Privacy",
    privacyTitle: "ကိုယ်ရေးမူဝါဒ",
    privacyKicker: "Privacy",
    privacyLead:
      "ဤအသိပေးချက်သည် DocTrace Excel add-in နှင့် ဤ public စာမျက်နှာများအတွက် ဖြစ်သည်။ Terms နှင့် မရောပါ။ Data-flow အသိပေးချက်။ Lawyer ပြန်ကြည့်ပြီးသော မူဝါဒ မဟုတ်။",
    privacyPublisherTitle: "ဘယ်သူထုတ်သလဲ",
    privacyPublisherBody:
      "Studio Next Steps က ဤ site နှင့် DocTrace add-in ကို ထုတ်သည်။ Customer ၏ တရားဝင်အမည် ရလာမှ ဤနေရာတွင် ထည့်မည်။",
    privacyCollectTitle: "ဤ site ဘာမှတ်သလဲ",
    privacyCollectBody:
      "ဤ site က ဘာသာစကားကို ဤ browser မှာ မှတ်သည်။ ဤစာမျက်နှာများပေါ် workbook မတင်ပါ။",
    privacyUseTitle: "Excel add-in ဘာသိမ်းသလဲ",
    privacyUseBody:
      "Optional cloud မချိတ်ရင် workbook နှင့် evidence က ဤကွန်ပျူတာ သို့မဟုတ် browser ထဲမှာပဲ။ Add-in က ထိုဖိုင်များကို DocTrace server သို့ default မပို့ပါ။",
    privacyCloudTitle: "Optional cloud",
    privacyCloudBody:
      "ဖွင့်မှ အကောင့်အီးမေးလ်၊ fail-closed backup နှင့် mail။ OTP မေးလ် မလှုပ်သေးပါ။",
    privacyHostTitle: "Hosting",
    privacyHostBody:
      "Public host က IP ကဲ့သို့ request log ကို ကိုင်နိုင်သည်။ ဖိုင် ဘယ်မှ မထွက်ဟု အပြည့် မပြောပါ။",
    privacyNotTitle: "ဘာမလုပ်သလဲ",
    privacyNotBody:
      "LLM product မဟုတ်။ ဖိုင်များကို training data အဖြစ် မသုံးပါ။",
    privacyCookiesTitle: "Cookies နှင့် ဤ browser",
    privacyCookiesBody:
      "ဤ site က ဘာသာစကားရွေးချယ်မှုကို ဤ browser ၏ cookies သို့မဟုတ် localStorage မှာ မှတ်သည်။ Optional cloud ဖွင့်မှ session token ကို ဤ browser မှာ မှတ်နိုင်သည်။ Tracking cookie ခင်းကျင်း မထားပါ။ Cookie သီးခြားစာမျက်နှာ မရှိ။",
    privacyProcessorsTitle: "ဘယ်သူက ကိုင်သလဲ",
    privacyProcessorsBody:
      "Public site က Vercel မှာ တင်သည်။ Optional cloud ဖွင့်မှ backup က R2၊ mail က Brevo ကို သုံးနိုင်သည်။ အဲဒီလမ်းကြောင်းများကို သင်ကိုယ်တိုင် ဖွင့်မှ ရှိသည်။",
    privacyExcelHostTitle: "Microsoft နှင့် Excel",
    privacyExcelHostBody:
      "Excel host (Windows၊ Mac၊ Excel on the web) က Office ပိုင်သည်။ Personality menu နှင့် host log ကို DocTrace က ပိတ် သို့မဟုတ် ပြင်၍ မရပါ။",
    privacyRetentionTitle: "ဘယ်လောက်ကြာ သိမ်းသလဲ",
    privacyRetentionBody:
      "Local workbook နှင့် evidence က သင့်စက်ထဲမှာ သင်ဖျက်သည်အထိ။ Optional cloud backup က သင်ဖျက် သို့မဟုတ် စာချုပ်ကုန်သည်အထိ။ Public host request log က host မူဝါဒအတိုင်း။",
    privacyChildrenTitle: "ကလေး",
    privacyChildrenBody:
      "DocTrace က စာရင်းစစ်အဖွဲ့အတွက် ဖြစ်သည်။ ကလေးများအတွက် ရည်ရွယ် မထားပါ။",
    privacyRightsTitle: "အခွင့်အရေး",
    privacyRightsBody:
      "ကြည့်ရန်၊ ပြင်ရန်၊ ဖျက်ရန် တောင်းခံနိုင်သည်။ Live mailbox ရှိမှ ကိုင်တွယ်မည်။",
    privacyContactTitle: "ဆက်သွယ်ရန်",
    privacyContactBody: "ကိုယ်ရေးမေးခွန်း။ ဤ mailbox က live မဟုတ်:",
    termsTitle: "အသုံးပြုမှု စည်းကမ်း",
    termsKicker: "Terms",
    termsLead:
      "DocTrace သည် Excel Test of Details add-in။ ဥပဒေရေးရာ အကြံ မဟုတ်။ စာရင်းစစ်အမြင် မဟုတ်။",
    terms1Title: "ကိရိယာ၊ အမြင် မဟုတ်",
    terms1Body:
      "Matching နှင့် log သည် ကူညီရန် ဖြစ်သည်။ စာရင်းစစ်အမြင်၊ ISA ထောက်ခံချက်၊ DataSnipper အစားထိုးဟု မယူဆပါ။",
    termsLicenseTitle: "သုံးခွင့်",
    termsLicenseBody:
      "စာရင်းစစ်အလုပ်အတွက် DocTrace Excel add-in ကို သုံးနိုင်သည်။ အခြား vendor ထုတ်ကုန် သို့မဟုတ် IAASB certification အဖြစ် မတင်ပြရ။",
    terms2Title: "Local-first",
    terms2Body:
      "သင့် workbook နဲ့ ဖိုင်က သင့်ပတ်ဝန်းကျင်။ Optional API ကို သင်ကိုယ်တိုင် ဖွင့်မှ cloud လမ်းကြောင်းရှိသည်။",
    termsWarrantyTitle: "အာမခံ မရှိ",
    termsWarrantyBody: "အာမခံ မပေး။ Workbook backup က သုံးသူတာဝန်။",
    termsUseTitle: "သုံးပုံ",
    termsUseBody:
      "စာရင်းစစ်အလုပ်အတွက် သုံးပါ။ Add-in ကို ပြောင်း၊ ပြန်ထုပ်၊ အခြားသူ၏အကောင့်ကို ခွင့်မရှိဘဲ မသုံးရ။ Matching ရလဒ်ကို audit opinion အဖြစ် မတင်ပြရ။",
    termsLiabilityTitle: "တာဝန်ကန့်သတ်ချက်",
    termsLiabilityBody:
      "ဥပဒေက ခွင့်ပြုသလောက် DocTrace ကို အာမခံမဲ့ ပေးသည်။ Workbook ဆုံးရှုံးမှု၊ မှားယွင်းသော match၊ သို့မဟုတ် host ပြတ်တောက်မှုအတွက် တာဝန်မယူပါ။ Auditor က evidence နှင့် documentation တာဝန်ရှိသည်။",
    termsChangesTitle: "ဤစည်းကမ်း ပြောင်းခြင်း",
    termsChangesBody:
      "ဤစာမျက်နှာကို ပြင်နိုင်သည်။ အုပ်ချုပ်တဲ့ ဥပဒေ သို့မဟုတ် စာချုပ် စာသားကို customer သဘောတူမှ အစားထိုးမည်။",
    termsPublisherTitle: "ထုတ်သူ",
    termsPublisherBody:
      "Studio Next Steps က ဤ site နှင့် add-in ကို ထုတ်သည်။ အုပ်ချုပ်တဲ့ ဥပဒေကို customer သဘောတူမှ သတ်မှတ်မည်။ ဤနေရာတွင် မဖော်ပြသေး။",
    terms3Title: "ဆက်သွယ်ရန်",
    terms3Body: "အထွေထွေမေးခွန်း။ ဤ mailbox က live မဟုတ်:",
    guideTitle: "စတင်အသုံးပြုရန်",
    guideKicker: "Guide",
    guideLead:
      "DocTrace Excel add-in ကို ဖွင့်ပုံနှင့် သုံးပုံ။ Engagements, Matching, Trial Balance, Workpapers, Client Portal။ Engagement ဖန်တီး၊ sample ယူ၊ evidence တင်၊ Match၊ snip၊ mapped column ကို workbook ထဲ ပြန်ရေး၊ listing sample ပို့၊ ToD ကို Workpapers ထဲ snapshot၊ PBC ဖိုင် လမ်းကြောင်းခွဲ။ Pane chrome နှင့် optional cloud လည်း ပါသည်။ Add-in သည် .exe မဟုတ်။ DataSnipper-identical မဟုတ်။ ISA-certified မဟုတ်။",
    guideTocLabel: "ဤလမ်းညွှန်တွင်",
    guideTocExcel: "Excel ထဲ ဖွင့်ရန်",
    guideTocEngagements: "Engagements",
    guideTocMatching: "Matching",
    guideTocTb: "Trial Balance",
    guideTocWorkpapers: "Workpapers",
    guideTocPortal: "Client Portal",
    guideTocChrome: "Pane chrome",
    guideTocCloud: "Optional cloud",
    guideTocAssist: "AI assist",
    guideTocLocal: "Local sideload",
    guideExcelTitle: "Excel ထဲ ရောက်ရန်",
    guideExcel1:
      "Excel Desktop ၏ Data tab က DocTrace ကို ဖွင့်ပါ။ Windows၊ Mac၊ Excel on the web (Office က ခွင့်ပြုသလောက်)။",
    guideExcel2: "Excel မဖွင့်ရင် Add-in preview:",
    guideExcel3:
      "ဤ add-in သည် Office.js manifest နှင့် hosted task pane ဖြစ်သည်။ Setup.exe မပေးပါ။ AppSource listing မရှိသေးပါ။",
    guideExcelNote:
      "Add-in preview မှာ Browser Preview တံဆိပ်နှင့် Website လင့် ပေါ်သည်။ Excel က တကယ့်ထုတ်ကုန်။",
    guideEngagementsTitle: "Engagements",
    guideEngagementsBody:
      "Matching မလုပ်ခင် Engagement Dashboard မှာ engagement ဖန်တီး သို့မဟုတ် ရွေးပါ။",
    guideEngagements1: "Pane ထဲ Engagements တက်ဘ်ကို ဖွင့်ပါ။",
    guideEngagements2:
      "Engagement ဖန်တီးပါ: client အမည်၊ နှစ်၊ framework၊ materiality။",
    guideEngagements3: "ထို engagement ကို ရွေးပြီး active ထားပါ။",
    guideEngagements4:
      "Matching သို့ ပြောင်းပါ။ Matching က ရွေးထားသော engagement နှင့် ချိတ်သည်။",
    guideShellAlt:
      "Engagements, Matching, Trial Balance, Workpapers, Client Portal တက်ဘ်ပါသော DocTrace pane",
    guideEngagementsAlt: "Engagement Dashboard",
    guideLocalTitle: "Local sideload",
    guideLocalBody:
      "ဤစက်မှာသာ: manifest.xml ကို Excel Desktop မှာ တင်ပါ။ Local SupportUrl အတွက် npm run dev ဖွင့်ထားရမည်:",
    guideMatchTitle: "Matching",
    guideMatchLead:
      "Select၊ Import၊ Match၊ Review။ Snip ပြီး mapped column ကို workbook ထဲ ပြန်ရေးသည်။ ပုံများက Add-in preview မှ ဖြစ်သည်။",
    guideStep1Title: "Select",
    guideStep1Body:
      "Excel က နမူနာအတန်းကို ရွေးပြီး ဤ pane မှာ Capture နှိပ်ပါ။ Capture ပြီးမှ Import နှင့် Match ကို ဆက်လုပ်နိုင်သည်။",
    guideStep1Alt: "Matching step 1 Select",
    guideStep2Title: "Import",
    guideStep2Body:
      "ပြေစာနှင့် ဘဏ်အထောက်အထားကို PDF၊ ပုံ၊ သို့မဟုတ် JSON အဖြစ် တင်ပါ။ Library ထဲမှာ ဖိုင်များကို ကြည့်ပါ။",
    guideStep2Alt: "Matching step 2 Import",
    guideStep3Title: "Match",
    guideStep3Body:
      "Preparer နှင့် reviewer ထည့်ပါ။ Suggested mapping နှိပ်ပြီး အတန်းများကို အထောက်အထားနှင့် Match လုပ်ပါ။",
    guideStep3Alt: "Matching step 3 Match",
    guideStep4Title: "Review",
    guideStep4Body:
      "ရလဒ်ကို စစ်ပါ။ Mapped column နှင့် hidden log sheet က workbook ထဲ ပြန်ရေးသည်။ Send to Workpapers က Test of Details ကို Workpapers တက်ဘ်ပေါ် snapshot လုပ်သည်။",
    guideStep4Alt: "Matching step 4 Review",
    guideSnipTitle: "Snip နှင့် viewer",
    guideSnipBody:
      "စာမျက်နှာပေါ်က စာ သို့မဟုတ် ဇယားကို snip ပါ။ Viewer မှာ စာမျက်နှာကို ကြည့်ပြီး reviewer က ချိတ်ကို မြင်အောင် ထားပါ။ Matching အဆင့် 1-4 မဟုတ်။",
    guideSnipAlt: "Evidence viewer နှင့် snip",
    guideTbTitle: "Trial Balance",
    guideTbBody:
      "Trial balance နှင့် listing တင်၊ F/S lead ချိတ်၊ tick လုပ်ထားသော အတန်းကို Matching Select ထဲ ပို့ပါ။ Tie-out က မြင်ရုံသာ။ Send ကို မပိတ်ပါ။",
    guideTb1: "Trial Balance တက်ဘ်ကို ဖွင့်ပါ။",
    guideTb2: "Trial balance workbook တင်ပြီး listing .xlsx ထပ်တင်ပါ။",
    guideTb3: "Ledger account များကို F/S lead နှင့် ချိတ်ပါ။",
    guideTb4:
      "Listing အတန်းကို tick ပြီး Send to Matching နှိပ်ပါ။ Debit-equals-credit နှင့် tie-out က Send ကို မပိတ်ပါ။",
    guideTbAlt: "Mapped account ပါသော Trial Balance တက်ဘ်",
    guideWpTitle: "Workpapers",
    guideWpBody:
      "Matching Review မှ Send to Workpapers က Test of Details ကို engagement ပေါ် snapshot လုပ်သည်။ File Sign က open exception နှင့် partial အတန်း စောင့်သည်။ CaseWare workpaper OS မဟုတ်။",
    guideWp1: "Workpapers တက်ဘ်ကို ဖွင့်ပါ။",
    guideWp2:
      "Matching Review မှာ Send to Workpapers နှိပ်ပါ။ ToD ရလဒ်ကို ဤ engagement ပေါ် snapshot လုပ်သည်။",
    guideWp3:
      "Exception နှင့် partial အတန်းကို လက်မှတ်ထိုးပြီး Sign workpaper နှိပ်ပါ။",
    guideWp4:
      "ထို open အတန်း မလက်မှတ်ထိုးသေးရင် File Sign ပိတ်ထားသည်။ ပထမ Send မတိုင်ခင် demo workpaper အတန်း ပေါ်နိုင်သည်။",
    guideWpAlt: "Demo pack စာရင်းပါသော Workpapers တက်ဘ်",
    guidePortalTitle: "Client Portal",
    guidePortalBody:
      "PBC request စာရင်းက ဤ pane ထဲမှာ။ Client login wall မဟုတ်။",
    guidePortal1: "Client Portal တက်ဘ်ကို ဖွင့်ပါ။",
    guidePortal2:
      "Client ပေးသင့်သော ဖိုင်များအတွက် PBC request စာရင်းကို သုံးပါ။",
    guidePortal3:
      "Invoice နှင့် bank PDF၊ ပုံ၊ JSON ကို Matching Import သို့ ပို့နိုင်သည်။",
    guidePortal4:
      "Ledger၊ confirmation၊ minutes၊ trial balance၊ .xlsx က စာရင်းပေါ်မှာပဲ နေသည်။",
    guidePortalAlt: "Client Portal PBC request စာရင်း",
    guideChromeTitle: "Pane chrome",
    guideChromeBody:
      "ဘာသာစကား၊ theme၊ activity feed၊ first-run cue က DocTrace pane ပိုင်သည်။ ညာဘက် Personality menu (Get Support, Reload, Attach Debugger, Security Info) က Excel ပိုင်သည်။ DocTrace က ပိတ်၊ ပြင်၊ ခလုတ်ထပ် မထည့်နိုင်ပါ။",
    guideCloudTitle: "Optional cloud နှင့် Account",
    guideCloudBody:
      "Matching က login wall မဟုတ်။ အကောင့်မရှိလည်း သုံးနိုင်သည်။ Firm က optional API ဖွင့်မှ Account မီနူး ပေါ်သည်။ OTP မေးလ် မလှုပ်သေးပါ။ Cloud မချိတ်ရင် ဖိုင်က ဤကွန်ပျူတာ သို့မဟုတ် browser ထဲမှာပဲ။",
    guideAssistTitle: "AI assist",
    guideAssistBody:
      "AI assist မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။ LLM extractor မဟုတ်။",
    guideAccountAlt: "Account မီနူး။ OTP မလှုပ်သေး။ AI assist မလှုပ်သေး။",
    guideAfterHome: "ပင်မ",
    faqTitle: "အမေးအဖြေ",
    faqKicker: "FAQ",
    faqLead: "DocTrace Excel add-in အကြောင်း မေးလေ့ရှိသော မေးခွန်း။",
    faqSeeGuide: "လမ်းညွှန်",
    faqSeeSupport: "အကူအညီ",
    faqSeePrivacy: "ကိုယ်ရေးမူဝါဒ",
    faqSeeContact: "ဆက်သွယ်ရန်",
    faq1Q: "အကောင့်လိုသလား။",
    faq1A:
      "Matching က login wall မဟုတ်။ အကောင့်မရှိလည်း သုံးနိုင်သည်။ Optional cloud က အကောင့်၊ backup၊ mail အတွက်သာ။",
    faq2Q: "ဖိုင်တွေ ဘယ်မှာလဲ။",
    faq2A:
      "Optional cloud မချိတ်ရင် workbook နှင့် အထောက်အထားသည် ဤကွန်ပျူတာ သို့မဟုတ် browser ထဲမှာပဲ။ Add-in က ထိုဖိုင်များကို DocTrace server သို့ default မပို့ပါ။",
    faq3Q: "Excel နှင့် Add-in preview ကွာခြားချက်က ဘာလဲ။",
    faq3A:
      "Excel က တကယ့်ထုတ်ကုန်။ Excel မဖွင့်ထားရင် Add-in preview က browser မှာ pane ကို ပြသည်။",
    faq4Q: "Get Support က pane ထဲ ဘာလို့ မပွင့်လဲ။",
    faq4A:
      "Excel Personality menu က Get Support သည် OS default browser မှာ ဖွင့်သည်။ Pane ထဲ မဖွင့်ပါ။",
    faq5Q: "DataSnipper လား။ ISA-certified လား။",
    faq5A:
      "DataSnipper-identical မဟုတ်။ ISA-certified မဟုတ်။ IAASB က ဆော့ဖ်ဝဲကို certify မလုပ်ပါ။",
    faq6Q: "ဘယ် host မှာ သုံးမလဲ။",
    faq6A: "Windows၊ Mac၊ Excel on the web (Office က ခွင့်ပြုသလောက်)။",
    faq7Q: "ဘာ evidence ဖိုင် လက်ခံသလဲ။",
    faq7A:
      "PDF၊ ပုံ၊ JSON။ PDF မှာ ရွေးလို့ရသော စာမရှိရင် add-in က ဤစက်ထဲမှာ စာမျက်နှာကို ဖတ်နိုင်သည်။",
    faq8Q: "Sign-in ကုဒ် မရရင်။",
    faq8A: "OTP မေးလ် မလှုပ်သေးပါ။ Matching ကို အကောင့်မလိုဘဲ ဆက်သုံးနိုင်သည်။",
    faq9Q: "Download .exe ရှိသလား။",
    faq9A:
      "မရှိ။ DocTrace သည် Office add-in ဖြစ်သည်။ manifest နှင့် hosted task pane။",
    faq10Q: "Microsoft AppSource မှာ ရှာလို့ရသလား။",
    faq10A:
      "AppSource listing မရှိသေးပါ။ Excel ထဲ ဖွင့်ပုံကို လမ်းညွှန်မှာ ကြည့်ပါ။",
    faq11Q: "ဘာသာစကား။",
    faq11A:
      "English နှင့် မြန်မာ။ ဝေါဟာရ (Matching, Test of Details) က English။",
    faq12Q: "ညာဘက် Personality menu ကို ပြင်လို့ရသလား။",
    faq12A:
      "မရပါ။ Get Support, Reload, Attach Debugger, Security Info က Excel ပိုင်သည်။ DocTrace က ပိတ်၊ ပြင်၊ ခလုတ်ထပ် မထည့်နိုင်ပါ။",
    contactTitle: "ဆက်သွယ်ရန်",
    contactKicker: "ဆက်သွယ်ရန်",
    contactLead:
      "ဖောင်ပို့လို့ live inbox မရောက်သေးပါ။ ဤလိပ်စာများသည် placeholder။",
    contactNotLive:
      "ဤ mailbox က live မဟုတ်။ Customer က လိပ်စာပေးသည်အထိ ဖောင်က ပို့မည် မဟုတ်။",
    contactEmailLabel: "Email",
    contactPhoneLabel: "Phone",
    contactAddressLabel: "Address",
    contactPhoneValue: "+95 00 000 0000",
    contactAddressValue:
      "Studio Next Steps · Yangon · street address to be provided",
    contactNameLabel: "အမည်",
    contactEmailFieldLabel: "အီးမေးလ်",
    contactPhoneFieldLabel: "ဖုန်း (optional)",
    contactFirmLabel: "Firm (optional)",
    contactMessageLabel: "စာ",
    contactSubmit: "ပို့မည်",
    error404Kicker: "404",
    error404Title: "စာမျက်နှာ မတွေ့ပါ",
    error404Lead: "ဤ URL သည် DocTrace စာမျက်နှာ မဟုတ်ပါ။",
    error404Home: "ပင်မ",
    error500Kicker: "500",
    error500Title: "တစ်ခုခု ပျက်သွားသည်",
    error500Lead:
      "ဤတောင်းဆိုမှုသည် host မှာ မအောင်မြင်ပါ။ ထပ်ကြိုးစားပါ။ Excel Matching က ဤစာမျက်နှာ မလိုပါ။",
    error500Home: "ပင်မ",
    authSignInKicker: "Sign in",
    authSignInTitle: "အကောင့်ဝင်ရန်",
    authSignInLead:
      "အီးမေးလ်ထည့်ပြီး ကုဒ်ရယူပါ။ Matching ကို login မလိုဘဲ သုံးနိုင်သည်။ Excel Desktop သည် Chrome login ကို အလိုအလျောက် မယူပါ။",
    authSignUpKicker: "Sign up",
    authSignUpTitle: "အကောင့်ဖွင့်ရန်",
    authSignUpLead:
      "အီးမေးလ်ထည့်ပြီး ကုဒ်ရယူပါ။ စကားဝှက် မလိုပါ။ Matching က login wall မဟုတ်။",
    authCodeKicker: "Code",
    authCodeTitle: "ကုဒ်ထည့်ရန်",
    authCodeLead: "အီးမေးလ်ထဲက ဂဏန်း ၆ လုံး ကုဒ်ကို ထည့်ပါ။",
    authEmail: "အီးမေးလ်",
    authCode: "ကုဒ်",
    authSendCode: "ကုဒ်ပို့မည်",
    authVerify: "ကုဒ်အတည်ပြုမည်",
    authCloudOff:
      "Cloud API မဖွင့်ရသေးပါ။ ဤစာမျက်နှာက login အတု မပေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    authNeedAccount: "အကောင့်မရှိသေးလျှင် ဖွင့်ရန်",
    authHaveAccount: "အကောင့်ရှိပြီးသားဆိုရင် ဝင်ရန်",
    authBackToEmail: "အီးမေးလ်သို့ ပြန်ရန်",
    authOtpHint: "OTP မေးလ် မလှုပ်သေးပါက 123456 ကို သုံးပါ။",
    authFailed: "ဆက်သွယ်၍ မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    authUserNotFound: "ဤအီးမေးလ်ဖြင့် အကောင့် မရှိသေးပါ။",
    authEmailTaken: "ဤအီးမေးလ်ဖြင့် အကောင့် ရှိပြီးသား။",
    authCooldown: "ခဏစောင့်ပြီး ထပ်ပို့ပါ။",
    authInvalidEmail: "အီးမေးလ် ထည့်ပါ။",
    authInvalidCode: "ဂဏန်း ၆ လုံး ကုဒ် ထည့်ပါ။",
    authNotLive: "OTP မေးလ် မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
  },
  en: {
    langSwitch: "မြန်မာ",
    langSwitchAria: "Switch to Myanmar",
    navProduct: "DocTrace",
    navGuide: "Guide",
    navSupport: "Support",
    navFaq: "FAQ",
    navContact: "Get in touch",
    navPrivacy: "Privacy Policy",
    navTerms: "Terms of use",
    navSignIn: "Sign in",
    navSignUp: "Sign up",
    navProfile: "Profile",
    navSignOut: "Sign out",
    navMenu: "Menu",
    skipToContent: "Skip to content",
    dockMail: "Email",
    dockFacebook: "Facebook",
    dockYouTube: "YouTube",
    dockViber: "Viber",
    landingTitle: "DocTrace — Test of Details in Excel",
    kicker: "Excel task pane · Test of Details",
    heroLead: "Match sample rows to invoices and bank support in Excel.",
    heroBody:
      "An Excel add-in for auditors and associates doing tests of details — commonly expense and accounts payable. Capture the sample, import evidence, match, snip the source page, and write the trail back to the workbook. Matching works with no account. Files stay on this computer or browser unless you connect optional cloud.",
    colA: "A",
    colB: "B",
    colC: "C",
    colSample: "Sample rows",
    colEvidence: "Evidence",
    colTrace: "Evidence trail",
    doesTitle: "What it does",
    does1Title: "Sample and evidence",
    does1Body:
      "Take a sample range from Excel. Import invoices and bank support as PDF, image, or JSON. If a PDF has no selectable text, the add-in can read the page on this device.",
    does2Title: "Match and snip",
    does2Body:
      "Match rows to evidence and snip the source page so a reviewer can see the link.",
    does3Title: "Write to the workbook",
    does3Body:
      "Mapped columns and a hidden log sheet stay in the workbook. Windows, Mac, and Excel on the web where Office allows.",
    notTitle: "What it is not",
    not1: "Not DataSnipper-identical.",
    not2: "Not ISA-certified. The IAASB does not certify software.",
    not3: "Not an LLM extractor.",
    not4: "No login wall. Matching works without an account.",
    not5: "Matching and logs assist tests of details (ISA 330). They are not an audit opinion. The auditor remains responsible for sufficient appropriate evidence (ISA 500) and documentation (ISA 230).",
    dataTitle: "Where your files stay",
    dataBody:
      "Workbook and evidence stay on this computer or browser unless you connect optional cloud. Matching does not require an account.",
    platformsTitle: "Where to run it",
    platformsBody:
      "Excel is the real product. When Excel is not open, Add-in preview runs in the browser. How to open it is on Getting started.",
    ctaSupport: "How to open in Excel",
    ctaPane: "Add-in preview",
    footerNote: "DocTrace · Excel-native Test of Details",
    footerPowered: "Powered By Studio Next Steps. All rights reserved.",
    supportTitle: "DocTrace support",
    supportKicker: "Get Support",
    supportLead:
      "How to open DocTrace in Excel, where workbook and evidence stay, and how to reach us. Matching works without an account.",
    supportHubGuideBody: "Open in Excel, matching steps, and pane screenshots.",
    supportHubFaqBody:
      "Short answers about accounts, files, Excel, and the add-in.",
    supportHubContactBody:
      "Mailbox and form. Those addresses are not live yet.",
    supportContactTitle: "Contact",
    supportContactBody:
      "These addresses are not live until the customer provides them.",
    supportFaqTitle: "FAQ",
    supportSeeFaq: "All questions",
    privacyEmailLabel: "Privacy",
    privacyTitle: "Privacy policy",
    privacyKicker: "Privacy",
    privacyLead:
      "This notice covers the DocTrace Excel add-in and these public pages. It is separate from the terms of use. It is a data-flow notice, not a counsel-reviewed policy.",
    privacyPublisherTitle: "Who publishes it",
    privacyPublisherBody:
      "Studio Next Steps publishes this site and the DocTrace add-in. The customer firm's legal name will appear here when provided.",
    privacyCollectTitle: "What the public site stores",
    privacyCollectBody:
      "This site remembers your language in this browser. These pages do not upload workbooks.",
    privacyUseTitle: "What the Excel add-in stores",
    privacyUseBody:
      "Workbook and evidence stay on this computer or browser unless you connect optional cloud. The add-in does not send those files to a DocTrace server by default.",
    privacyCloudTitle: "Optional cloud",
    privacyCloudBody:
      "If you enable it, this is account email plus fail-closed backup and mail. OTP mail is not live.",
    privacyHostTitle: "Hosting",
    privacyHostBody:
      "The public host may process request logs such as IP addresses. This page does not claim that nothing ever leaves the device.",
    privacyNotTitle: "What we do not do",
    privacyNotBody:
      "DocTrace is not an LLM product. Files are not used as training data.",
    privacyCookiesTitle: "Cookies and this browser",
    privacyCookiesBody:
      "This site remembers your language choice in this browser (cookies or localStorage). If optional cloud is on, a session token may also be stored here. There is no advertising cookie stack. There is no separate cookie page.",
    privacyProcessorsTitle: "Who processes data",
    privacyProcessorsBody:
      "The public site is hosted on Vercel. If you enable optional cloud, backup may use R2 and mail may use Brevo. Those paths exist only when you turn them on.",
    privacyExcelHostTitle: "Microsoft and Excel",
    privacyExcelHostBody:
      "The Excel host (Windows, Mac, Excel on the web) belongs to Office. DocTrace cannot hide or restyle the personality menu or host logs.",
    privacyRetentionTitle: "How long we keep it",
    privacyRetentionBody:
      "Local workbook and evidence stay on your device until you delete them. Optional cloud backup stays until you delete it or the agreement ends. Public host request logs follow the host's policy.",
    privacyChildrenTitle: "Children",
    privacyChildrenBody:
      "DocTrace is for audit teams. It is not directed at children.",
    privacyRightsTitle: "Your rights",
    privacyRightsBody:
      "You may ask to access, correct, or delete personal data we hold. Requests will be handled when a live mailbox exists.",
    privacyContactTitle: "Contact",
    privacyContactBody: "Privacy questions. This mailbox is not live:",
    termsTitle: "Terms of use",
    termsKicker: "Terms",
    termsLead:
      "DocTrace is an Excel Test of Details add-in. It is not legal advice. It is not an audit opinion.",
    terms1Title: "A tool, not an opinion",
    terms1Body:
      "Matching and logs assist work. They are not an audit opinion, ISA certification, or a DataSnipper substitute.",
    termsLicenseTitle: "License",
    termsLicenseBody:
      "You may use the DocTrace Excel add-in for your audit work. You may not present it as another vendor's product or as IAASB certification.",
    terms2Title: "Local-first",
    terms2Body:
      "Your workbook and files stay in your environment. Cloud paths exist only if you enable the optional API.",
    termsWarrantyTitle: "No warranty",
    termsWarrantyBody:
      "The add-in is provided without warranty. You keep workbook backups.",
    termsUseTitle: "Acceptable use",
    termsUseBody:
      "Use it for your audit work. Do not reverse-engineer the add-in or use another person's account without permission. Do not present Matching output as an audit opinion.",
    termsLiabilityTitle: "Limitation of liability",
    termsLiabilityBody:
      "To the extent the law allows, DocTrace is provided as-is. We are not liable for lost workbooks, a wrong match, or host downtime. The auditor remains responsible for evidence and documentation.",
    termsChangesTitle: "Changes to these terms",
    termsChangesBody:
      "This page may be updated. Governing law or a signed contract will replace this text when the customer agrees it.",
    termsPublisherTitle: "Publisher",
    termsPublisherBody:
      "Studio Next Steps publishes this site and add-in. Governing law is not stated until the customer agrees it.",
    terms3Title: "Contact",
    terms3Body: "General questions. This mailbox is not live:",
    guideTitle: "Getting started",
    guideKicker: "Guide",
    guideLead:
      "How to open the DocTrace Excel add-in and use Engagements, Matching, Trial Balance, Workpapers, and Client Portal: create an engagement, capture a sample, import evidence, match, snip, write mapped columns back, send a listing sample, snapshot ToD into workpapers, and route PBC files. Pane chrome and optional cloud are covered too. This add-in is not an .exe. Not DataSnipper-identical. Not ISA-certified.",
    guideTocLabel: "In this guide",
    guideTocExcel: "Open in Excel",
    guideTocEngagements: "Engagements",
    guideTocMatching: "Matching",
    guideTocTb: "Trial Balance",
    guideTocWorkpapers: "Workpapers",
    guideTocPortal: "Client Portal",
    guideTocChrome: "Pane chrome",
    guideTocCloud: "Optional cloud",
    guideTocAssist: "AI assist",
    guideTocLocal: "Local sideload",
    guideExcelTitle: "Get it into Excel",
    guideExcel1:
      "Open DocTrace from the Data tab in Excel Desktop. Windows, Mac, and Excel on the web where Office allows.",
    guideExcel2: "If Excel is not open, use Add-in preview:",
    guideExcel3:
      "This add-in is an Office.js manifest plus a hosted task pane. There is no Setup.exe. There is no AppSource listing yet.",
    guideExcelNote:
      "Add-in preview shows a Browser Preview badge and a Website link. Excel is the real product.",
    guideEngagementsTitle: "Engagements",
    guideEngagementsBody:
      "Create or select an engagement on the Engagement Dashboard before Matching.",
    guideEngagements1: "Open the Engagements tab in the pane.",
    guideEngagements2:
      "Create an engagement: client name, financial year, framework, and materiality.",
    guideEngagements3: "Select that engagement so it is active.",
    guideEngagements4:
      "Switch to Matching. Matching follows the engagement you selected.",
    guideShellAlt:
      "DocTrace pane with Engagements, Matching, Trial Balance, Workpapers, and Client Portal tabs",
    guideEngagementsAlt: "Engagement Dashboard",
    guideLocalTitle: "Local sideload",
    guideLocalBody:
      "On this machine only: load manifest.xml in Excel Desktop. Local SupportUrl needs npm run dev running:",
    guideMatchTitle: "Matching",
    guideMatchLead:
      "Select, Import, Match, Review. Snip the page, then write mapped columns back to the workbook. Screenshots are from Add-in preview.",
    guideStep1Title: "Select",
    guideStep1Body:
      "Select a sample range in Excel, then capture it in this pane. Capture unlocks Import and Match.",
    guideStep1Alt: "Matching step 1 Select",
    guideStep2Title: "Import",
    guideStep2Body:
      "Import invoices and bank support as PDF, image, or JSON. Review files in the library.",
    guideStep2Alt: "Matching step 2 Import",
    guideStep3Title: "Match",
    guideStep3Body:
      "Enter preparer and reviewer. Click Suggested mapping, then Match rows to evidence.",
    guideStep3Alt: "Matching step 3 Match",
    guideStep4Title: "Review",
    guideStep4Body:
      "Check results. Mapped columns and a hidden log sheet write back to the workbook. Send to Workpapers snapshots the Test of Details onto the Workpapers tab.",
    guideStep4Alt: "Matching step 4 Review",
    guideSnipTitle: "Snip and viewer",
    guideSnipBody:
      "Snip text or a table on the page. Use the viewer so a reviewer can see the link. Not a numbered Matching step.",
    guideSnipAlt: "Evidence viewer and snip",
    guideTbTitle: "Trial Balance",
    guideTbBody:
      "Import a trial balance and a listing, map F/S leads, then send ticked rows into Matching Select. Tie-out is visible only.",
    guideTb1: "Open the Trial Balance tab.",
    guideTb2: "Import a trial balance workbook, then a listing .xlsx.",
    guideTb3: "Map ledger accounts to F/S leads.",
    guideTb4:
      "Tick listing rows and click Send to Matching. Debit-equals-credit and tie-out do not block Send.",
    guideTbAlt: "Trial Balance tab with mapped accounts",
    guideWpTitle: "Workpapers",
    guideWpBody:
      "Matching Review Send to Workpapers snapshots Test of Details onto the engagement. File Sign waits on open exception and partial rows. This is not a CaseWare workpaper OS.",
    guideWp1: "Open the Workpapers tab.",
    guideWp2:
      "On Matching Review, click Send to Workpapers. That snapshots ToD results onto this engagement.",
    guideWp3: "Sign exception and partial rows, then Sign workpaper.",
    guideWp4:
      "File Sign stays blocked while those open rows are unsigned. Demo workpaper rows may show until the first Send.",
    guideWpAlt: "Workpapers tab with the demo pack list",
    guidePortalTitle: "Client Portal",
    guidePortalBody:
      "The PBC request list is in this pane. It is not a client login wall.",
    guidePortal1: "Open the Client Portal tab.",
    guidePortal2:
      "Use the PBC request list for files the client should provide.",
    guidePortal3:
      "Invoice and bank PDF, image, or JSON can go to Matching Import.",
    guidePortal4:
      "Ledgers, confirmations, minutes, trial balance, and .xlsx stay on the list.",
    guidePortalAlt: "Client Portal PBC request list",
    guideChromeTitle: "Pane chrome",
    guideChromeBody:
      "Language, theme, the activity feed, and the first-run cue belong to the DocTrace pane. The thin personality menu on the right (Get Support, Reload, Attach Debugger, Security Info) belongs to Excel. DocTrace cannot hide, restyle, or add items there.",
    guideCloudTitle: "Optional cloud and Account",
    guideCloudBody:
      "Matching has no login wall. You can use it without an account. The Account menu appears only if the firm enables the optional API. OTP mail is not live. Files stay on this computer or browser unless you connect optional backup.",
    guideAssistTitle: "AI assist",
    guideAssistBody:
      "AI assist is not live. Matching still works. DocTrace is not an LLM extractor.",
    guideAccountAlt:
      "Account menu. OTP mail is not live. AI assist is not live.",
    guideAfterHome: "Home",
    faqTitle: "FAQ",
    faqKicker: "FAQ",
    faqLead: "Short answers about the DocTrace Excel add-in.",
    faqSeeGuide: "Getting started",
    faqSeeSupport: "Support",
    faqSeePrivacy: "Privacy",
    faqSeeContact: "Get in touch",
    faq1Q: "Do I need an account?",
    faq1A:
      "Matching has no login wall. You can use it without an account. Optional cloud is only for account, backup, and mail.",
    faq2Q: "Where do my files stay?",
    faq2A:
      "Workbook and evidence stay on this computer or browser unless you connect optional cloud. The add-in does not send those files to a DocTrace server by default.",
    faq3Q: "What is the difference between Excel and Add-in preview?",
    faq3A:
      "Excel is the real product. When Excel is not open, Add-in preview shows the pane in the browser.",
    faq4Q: "Why does Get Support open in a browser?",
    faq4A:
      "Excel Get Support in the personality menu opens this site in the OS default browser, not inside the task pane.",
    faq5Q: "Is this DataSnipper? Is it ISA-certified?",
    faq5A:
      "Not DataSnipper-identical. Not ISA-certified. The IAASB does not certify software.",
    faq6Q: "Where can I run it?",
    faq6A: "Windows, Mac, and Excel on the web where Office allows.",
    faq7Q: "What evidence files can I import?",
    faq7A:
      "PDF, image, or JSON. If a PDF has no selectable text, the add-in can read the page on this device.",
    faq8Q: "I did not get a sign-in code.",
    faq8A: "OTP mail is not live. Matching still works without an account.",
    faq9Q: "Is there an .exe download?",
    faq9A:
      "No. DocTrace is an Office add-in: a manifest plus a hosted task pane.",
    faq10Q: "Can I find it on Microsoft AppSource?",
    faq10A:
      "There is no AppSource listing yet. How to open it in Excel is on Getting started.",
    faq11Q: "What languages are supported?",
    faq11A:
      "English and Myanmar. Product terms such as Matching and Test of Details stay in English.",
    faq12Q: "Can you change the personality menu on the right?",
    faq12A:
      "No. Get Support, Reload, Attach Debugger, and Security Info belong to Excel. DocTrace cannot hide, restyle, or add items.",
    contactTitle: "Get in touch",
    contactKicker: "Get in touch",
    contactLead:
      "This form does not reach a live inbox yet. The details below are placeholders.",
    contactNotLive:
      "This mailbox is not live. The form will not send until the customer provides an address.",
    contactEmailLabel: "Email",
    contactPhoneLabel: "Phone",
    contactAddressLabel: "Address",
    contactPhoneValue: "+95 00 000 0000",
    contactAddressValue:
      "Studio Next Steps · Yangon · street address to be provided",
    contactNameLabel: "Name",
    contactEmailFieldLabel: "Email",
    contactPhoneFieldLabel: "Phone (optional)",
    contactFirmLabel: "Firm (optional)",
    contactMessageLabel: "Message",
    contactSubmit: "Submit",
    error404Kicker: "404",
    error404Title: "Page not found",
    error404Lead: "This URL is not a DocTrace page.",
    error404Home: "Home",
    error500Kicker: "500",
    error500Title: "Something went wrong",
    error500Lead:
      "This request failed on the host. Try again. Excel Matching does not need this page.",
    error500Home: "Home",
    authSignInKicker: "Sign in",
    authSignInTitle: "Sign in",
    authSignInLead:
      "Enter your email to get a one-time code. Matching has no login wall. Excel Desktop does not inherit a Chrome login.",
    authSignUpKicker: "Sign up",
    authSignUpTitle: "Create an account",
    authSignUpLead:
      "Enter your email to get a one-time code. No password. Matching still works without an account.",
    authCodeKicker: "Code",
    authCodeTitle: "Enter the code",
    authCodeLead: "Type the 6-digit code sent for this email.",
    authEmail: "Email",
    authCode: "Code",
    authSendCode: "Send code",
    authVerify: "Verify code",
    authCloudOff:
      "The cloud API is off. This page does not fake a live login. Matching still works.",
    authNeedAccount: "Need an account? Sign up",
    authHaveAccount: "Already have an account? Sign in",
    authBackToEmail: "Back to email",
    authOtpHint: "Until mail is live, use 123456.",
    authFailed: "Sign-in failed. Matching still works.",
    authUserNotFound: "No account exists for this email.",
    authEmailTaken: "An account already exists for this email.",
    authCooldown: "Wait a moment, then send again.",
    authInvalidEmail: "Enter an email address.",
    authInvalidCode: "Enter the 6-digit code.",
    authNotLive: "OTP mail is not live. Matching still works.",
  },
} as const;

export type CopyKey = keyof typeof copy.my;
