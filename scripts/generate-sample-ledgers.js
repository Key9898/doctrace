/* eslint-disable no-undef */
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const SAMPLES_DIR = "./samples";

if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

function generateLedger1() {
  const data = [
    {
      "Row ID": 1,
      "Transaction Date": "2026-05-02",
      Description: "Service Charges - Monthly Account Maintenance",
      "Ref / Invoice No": "BANK-FEE-05",
      "Amount (MMK)": 25000,
      "Account Code": "50120",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 2,
      "Transaction Date": "2026-05-04",
      Description: "ACH Credit Receipt - Invoice PMT Client Zenith",
      "Ref / Invoice No": "REC-ZN-4091",
      "Amount (MMK)": 12450000,
      "Account Code": "11100",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 3,
      "Transaction Date": "2026-05-06",
      Description:
        "Utility Bill - Yangon Electricity Supply Corporation (YESC)",
      "Ref / Invoice No": "YESC-84918",
      "Amount (MMK)": 480000,
      "Account Code": "50210",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 4,
      "Transaction Date": "2026-05-09",
      Description: "Office Supplies - Golden Land Bookstore",
      "Ref / Invoice No": "SUP-GL-0918",
      "Amount (MMK)": 125000,
      "Account Code": "50300",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 5,
      "Transaction Date": "2026-05-11",
      Description: "Outward Wire Transfer - FT-901842 Tax Payment",
      "Ref / Invoice No": "TAX-2026-05",
      "Amount (MMK)": 2500000,
      "Account Code": "20300",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 6,
      "Transaction Date": "2026-05-12",
      Description: "Incoming TT Ref: GOL-0248 Sales Deposit",
      "Ref / Invoice No": "REC-GOL-02",
      "Amount (MMK)": 8920000,
      "Account Code": "11100",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    // MATCH 1: GlobeTech Solutions Invoice GT-2026-9418 (4,250,000 MMK)
    {
      "Row ID": 7,
      "Transaction Date": "2026-05-15",
      Description: "FT GT-2026-9418 GlobeTech Solutions Cloud Setup",
      "Ref / Invoice No": "GT-2026-9418",
      "Amount (MMK)": 4250000,
      "Account Code": "50400",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 8,
      "Transaction Date": "2026-05-16",
      Description: "Local Cash Deposit - Branch 3 Teller 4",
      "Ref / Invoice No": "DEP-CSH-16",
      "Amount (MMK)": 5000000,
      "Account Code": "10100",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 9,
      "Transaction Date": "2026-05-17",
      Description: "Online Wire Transfer Fees - Outward",
      "Ref / Invoice No": "BANK-FEE-06",
      "Amount (MMK)": 15000,
      "Account Code": "50120",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    // MATCH 2: Vanguard Logistics Invoice VL-847291 (1,890,500 MMK)
    {
      "Row ID": 10,
      "Transaction Date": "2026-05-20",
      Description: "Payment VL-847291 Vanguard Logistics Ocean Freight",
      "Ref / Invoice No": "VL-847291",
      "Amount (MMK)": 1890500,
      "Account Code": "50500",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 11,
      "Transaction Date": "2026-05-22",
      Description: "Outward Wire Transfer - Office Rent KBZ Transfer",
      "Ref / Invoice No": "RENT-2026-05",
      "Amount (MMK)": 3500000,
      "Account Code": "50100",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 12,
      "Transaction Date": "2026-05-24",
      Description: "Credit Interest Payment Received",
      "Ref / Invoice No": "INT-REC-05",
      "Amount (MMK)": 50000,
      "Account Code": "40200",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 13,
      "Transaction Date": "2026-05-25",
      Description: "ACH Receipt - Client Apex Holdings Settlement",
      "Ref / Invoice No": "REC-APX-84",
      "Amount (MMK)": 9000000,
      "Account Code": "11100",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 14,
      "Transaction Date": "2026-05-27",
      Description: "Software License Renewal - Microsoft Office 365",
      "Ref / Invoice No": "LIC-MS-365",
      "Amount (MMK)": 9000000,
      "Account Code": "50400",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 15,
      "Transaction Date": "2026-05-28",
      Description: "Outward Telegram Transfer Commission Charges",
      "Ref / Invoice No": "BANK-FEE-07",
      "Amount (MMK)": 15000,
      "Account Code": "50120",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
    {
      "Row ID": 16,
      "Transaction Date": "2026-05-30",
      Description: "Corporate Fuel Expense - KBZ Visa Debit Card",
      "Ref / Invoice No": "FUEL-KBZ-30",
      "Amount (MMK)": 1000000,
      "Account Code": "50600",
      Status: "",
      "Evidence File": "",
      Confidence: "",
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Cash Book - CB Bank");

  const filePath = path.join(SAMPLES_DIR, "client_ledger_1.xlsx");
  XLSX.writeFile(wb, filePath);
  console.log(`Saved Excel Ledger: ${filePath}`);
}

function generateLedger2() {
  const data = [
    {
      "Row ID": 1,
      "Transaction Date": "2026-05-03",
      Description: "Monthly Savings Account Service Charges",
      "Reference / Doc": "KBZ-FEE-05",
      "Amount (MMK)": 10000,
    },
    {
      "Row ID": 2,
      "Transaction Date": "2026-05-05",
      Description: "Interest Pay-out Savings Account",
      "Reference / Doc": "KBZ-INT-05",
      "Amount (MMK)": 50000,
    },
    {
      "Row ID": 3,
      "Transaction Date": "2026-05-08",
      Description: "Cash Withdrawal - ATM Union Square Branch",
      "Reference / Doc": "ATM-WTH-08",
      "Amount (MMK)": 500000,
    },
    {
      "Row ID": 4,
      "Transaction Date": "2026-05-10",
      Description: "Inward Clearing Cheque Ref #10084729",
      "Reference / Doc": "CHQ-DEP-10",
      "Amount (MMK)": 15000000,
    },
    {
      "Row ID": 5,
      "Transaction Date": "2026-05-14",
      Description: "Online Fund Transfer - KBZ to CB Card Settlement",
      "Reference / Doc": "TRF-CB-CARD",
      "Amount (MMK)": 1200000,
    },
    {
      "Row ID": 6,
      "Transaction Date": "2026-05-18",
      Description: "Monthly Salary Disbursement to Employee payroll",
      "Reference / Doc": "PAYROLL-05",
      "Amount (MMK)": 12480000,
    },
    {
      "Row ID": 7,
      "Transaction Date": "2026-05-22",
      Description: "Inward Transfer - Rent from tenant Building B",
      "Reference / Doc": "RENT-IN-22",
      "Amount (MMK)": 3500000,
    },
    {
      "Row ID": 8,
      "Transaction Date": "2026-05-24",
      Description: "Office Internet Payment - Fiber Link Yangon",
      "Reference / Doc": "NET-FIBER-24",
      "Amount (MMK)": 80000,
    },
    {
      "Row ID": 9,
      "Transaction Date": "2026-05-25",
      Description: "Corporate Dining Expense - KBZ Card Ref #419",
      "Reference / Doc": "DIN-CARD-25",
      "Amount (MMK)": 120000,
    },
    {
      "Row ID": 10,
      "Transaction Date": "2026-05-27",
      Description: "Fulfillment Receipt - Apex Credit Card Payment",
      "Reference / Doc": "PMT-APX-CRD",
      "Amount (MMK)": 3500000,
    },
    {
      "Row ID": 11,
      "Transaction Date": "2026-05-28",
      Description: "VAT Tax Payment Output wire",
      "Reference / Doc": "TAX-VAT-28",
      "Amount (MMK)": 81000,
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Savings Ledger - KBZ");

  const filePath = path.join(SAMPLES_DIR, "client_ledger_2.xlsx");
  XLSX.writeFile(wb, filePath);
  console.log(`Saved Excel Ledger: ${filePath}`);
}

console.log("Generating sample audit client ledger Excel sheets...");
generateLedger1();
generateLedger2();
console.log(
  "All sample Excel sheets successfully generated in ./samples folder.",
);
