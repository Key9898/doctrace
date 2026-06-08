/* eslint-disable no-undef */
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

const SAMPLES_DIR = "./samples";

if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

// Helper to write PDF to file
function savePDF(doc, filename) {
  const filePath = path.join(SAMPLES_DIR, filename);
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`Saved PDF: ${filePath}`);
}

// -------------------------------------------------------------
// 1. INVOICE 1: GlobeTech Solutions Ltd (denominations in MMK)
// -------------------------------------------------------------
function generateInvoice1() {
  const doc = new jsPDF({ format: "letter" });

  // Header / Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("GLOBETECH SOLUTIONS LTD", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("No. 124, Pyay Road, Kamayut Township, Yangon, Myanmar", 20, 31);
  doc.text("Email: billing@globetechsolutions.com | Tel: +95 1 504931", 20, 36);

  // Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(20, 42, 195, 42);

  // Invoice Details Table / Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("INVOICE", 20, 53);

  doc.setFontSize(10);
  doc.text("Bill To:", 20, 65);
  doc.setFont("helvetica", "normal");
  doc.text("TZ Assurance Clients Group", 20, 71);
  doc.text("Finance Department", 20, 76);
  doc.text("Yangon Office, Myanmar", 20, 81);

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Number:", 120, 65);
  doc.text("Invoice Date:", 120, 71);
  doc.text("Payment Term:", 120, 76);
  doc.text("Due Date:", 120, 81);

  doc.setFont("helvetica", "normal");
  doc.text("GT-2026-9418", 160, 65);
  doc.text("2026-05-12", 160, 71);
  doc.text("Net 30", 160, 76);
  doc.text("2026-06-11", 160, 81);

  // Items Table Header
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, 95, 175, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Description", 25, 100);
  doc.text("Qty", 120, 100);
  doc.text("Unit Price (MMK)", 135, 100);
  doc.text("Amount (MMK)", 195, 100, { align: "right" });

  // Items Rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);

  // Row 1
  doc.text("IT Consultancy Services - Cloud Security Setup", 25, 112);
  doc.text("1", 122, 112);
  doc.text("2,500,000", 152, 112, { align: "right" });
  doc.text("2,500,000", 195, 112, { align: "right" });
  doc.line(20, 116, 195, 116);

  // Row 2
  doc.text("Annual Software License Fee - Admin Console (30 Users)", 25, 124);
  doc.text("30", 122, 124);
  doc.text("50,000", 152, 124, { align: "right" });
  doc.text("1,500,000", 195, 124, { align: "right" });
  doc.line(20, 128, 195, 128);

  // Row 3
  doc.text("Premium SSL Certificate Installation & Support", 25, 136);
  doc.text("1", 122, 136);
  doc.text("250,000", 152, 136, { align: "right" });
  doc.text("250,000", 195, 136, { align: "right" });
  doc.line(20, 140, 195, 140);

  // Totals Section
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", 120, 153);
  doc.text("Tax (0%):", 120, 159);
  doc.setFontSize(11);
  doc.text("Total Amount Due:", 120, 167);

  doc.setFont("helvetica", "normal");
  doc.text("4,250,000 MMK", 195, 153, { align: "right" });
  doc.text("0 MMK", 195, 159, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("4,250,000 MMK", 195, 167, { align: "right" });

  // Footer Notes
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    "Thank you for your business! Payment should be wired directly to our CB Bank Account.",
    20,
    200,
  );
  doc.text("For query, contact billing@globetechsolutions.com", 20, 205);

  savePDF(doc, "invoice_1.pdf");
}

// -------------------------------------------------------------
// 2. INVOICE 2: Vanguard Logistics Services (denominations in MMK)
// -------------------------------------------------------------
function generateInvoice2() {
  const doc = new jsPDF({ format: "letter" });

  // Header / Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text("VANGUARD LOGISTICS SERVICES", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Aung San Road, Industrial Zone 3, Hlaing Tharyar Township, Yangon",
    20,
    31,
  );
  doc.text(
    "Email: operations@vanguardlogistics.com.mm | Tel: +95 1 680224",
    20,
    36,
  );

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 42, 195, 42);

  // Invoice Details Table / Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("COMMERCIAL INVOICE", 20, 53);

  doc.setFontSize(10);
  doc.text("Consignee / Bill To:", 20, 65);
  doc.setFont("helvetica", "normal");
  doc.text("TZ Assurance Clients Group", 20, 71);
  doc.text("Logistics & Import Dept", 20, 76);
  doc.text("Yangon Office, Myanmar", 20, 81);

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Number:", 120, 65);
  doc.text("Invoice Date:", 120, 71);
  doc.text("PO Number:", 120, 76);
  doc.text("Payment Due:", 120, 81);

  doc.setFont("helvetica", "normal");
  doc.text("VL-847291", 160, 65);
  doc.text("2026-05-18", 160, 71);
  doc.text("PO-2026-00418", 160, 76);
  doc.text("On Receipt", 160, 81);

  // Items Table Header
  doc.setFillColor(248, 250, 252);
  doc.rect(20, 95, 175, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Freight Charge Details", 25, 100);
  doc.text("Service Code", 110, 100);
  doc.text("Tax Class", 140, 100);
  doc.text("Total Cost (MMK)", 195, 100, { align: "right" });

  // Items Rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);

  // Row 1
  doc.text("Ocean Freight Charges - 20ft Standard Container", 25, 112);
  doc.text("FR-0082", 110, 112);
  doc.text("Exempt", 140, 112);
  doc.text("1,200,000", 195, 112, { align: "right" });
  doc.line(20, 116, 195, 116);

  // Row 2
  doc.text("Customs Brokerage Fees & Import Declaration", 25, 124);
  doc.text("CS-9402", 110, 124);
  doc.text("General", 140, 124);
  doc.text("450,000", 195, 124, { align: "right" });
  doc.line(20, 128, 195, 128);

  // Row 3
  doc.text("Port Handling, Demurrage & Documentation Services", 25, 136);
  doc.text("PH-1082", 110, 136);
  doc.text("General", 140, 136);
  doc.text("240,500", 195, 136, { align: "right" });
  doc.line(20, 140, 195, 140);

  // Totals Section
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", 120, 153);
  doc.text("Tax Amount:", 120, 159);
  doc.setFontSize(11);
  doc.text("Net Invoice Total:", 120, 167);

  doc.setFont("helvetica", "normal");
  doc.text("1,890,500 MMK", 195, 153, { align: "right" });
  doc.text("0 MMK", 195, 159, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1,890,500 MMK", 195, 167, { align: "right" });

  // Footer Notes
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Please wire payment within 3 business days. Ref Invoice VL-847291 in wire transfer memo.",
    20,
    200,
  );

  savePDF(doc, "invoice_2.pdf");
}

// -------------------------------------------------------------
// 3. BANK STATEMENT 1: CB Bank (denominations in MMK)
// -------------------------------------------------------------
function generateBankStatement1() {
  const doc = new jsPDF({ format: "letter" });

  // Header / Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(2, 132, 199); // sky-600 (CB Bank style blue)
  doc.text("CB BANK (MYANMAR)", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Head Office: No. 46, Union Financial Center, Mahabandoola Road, Yangon",
    20,
    31,
  );

  // Divider
  doc.setDrawColor(2, 132, 199);
  doc.line(20, 38, 195, 38);

  // Statement Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("CORPORATE ACCOUNT STATEMENT", 20, 48);

  doc.setFontSize(9);
  doc.text("Account Name:", 20, 58);
  doc.text("Account Number:", 20, 64);
  doc.text("Statement Period:", 20, 70);
  doc.text("Currency:", 20, 76);

  doc.setFont("helvetica", "normal");
  doc.text("TZ Assurance Clients Group", 55, 58);
  doc.text("0010-6001-2098-4721", 55, 64);
  doc.text("2026-05-01 to 2026-05-31", 55, 70);
  doc.text("MMK (Kyat)", 55, 76);

  // Balance Summary
  doc.setFont("helvetica", "bold");
  doc.text("Opening Balance:", 120, 58);
  doc.text("Total Debits:", 120, 64);
  doc.text("Total Credits:", 120, 70);
  doc.text("Closing Balance:", 120, 76);

  doc.setFont("helvetica", "normal");
  doc.text("148,500,000 MMK", 155, 58);
  doc.text("21,800,500 MMK", 155, 64);
  doc.text("35,420,000 MMK", 155, 70);
  doc.setFont("helvetica", "bold");
  doc.text("162,119,500 MMK", 155, 76);

  // Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(20, 88, 175, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text("Value Date", 23, 93);
  doc.text("Transaction Details / References", 50, 93);
  doc.text("Withdrawals (Debit)", 125, 93);
  doc.text("Deposits (Credit)", 160, 93);

  // Table Rows (Realistic Audit Ledger Transactions in MMK)
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);

  const transactions = [
    {
      date: "2026-05-02",
      desc: "Service Charges - Monthly Account Maintenance",
      dr: "25,000",
      cr: "",
    },
    {
      date: "2026-05-04",
      desc: "ACH Credit Receipt - Invoice PMT Client Zenith",
      dr: "",
      cr: "12,450,000",
    },
    {
      date: "2026-05-06",
      desc: "Utility Bill - Yangon Electricity Supply Corporation (YESC)",
      dr: "480,000",
      cr: "",
    },
    {
      date: "2026-05-09",
      desc: "Office Supplies - Golden Land Bookstore",
      dr: "125,000",
      cr: "",
    },
    {
      date: "2026-05-11",
      desc: "Outward Wire Transfer - FT-901842 Tax Payment",
      dr: "2,500,000",
      cr: "",
    },
    {
      date: "2026-05-12",
      desc: "Incoming TT Ref: GOL-0248 Sales Deposit",
      dr: "",
      cr: "8,920,000",
    },
    // MATCH 1: GlobeTech Solutions Invoice GT-2026-9418 (4,250,000 MMK) paid on May 15
    {
      date: "2026-05-15",
      desc: "FT GT-2026-9418 GlobeTech Solutions Cloud Setup",
      dr: "4,250,000",
      cr: "",
    },
    {
      date: "2026-05-16",
      desc: "Local Cash Deposit - Branch 3 Teller 4",
      dr: "",
      cr: "5,000,000",
    },
    {
      date: "2026-05-17",
      desc: "Online Wire Transfer Fees - Outward",
      dr: "15,000",
      cr: "",
    },
    // MATCH 2: Vanguard Logistics Invoice VL-847291 (1,890,500 MMK) paid on May 20
    {
      date: "2026-05-20",
      desc: "Payment VL-847291 Vanguard Logistics Ocean Freight",
      dr: "1,890,500",
      cr: "",
    },
    {
      date: "2026-05-22",
      desc: "Outward Wire Transfer - Office Rent KBZ Transfer",
      dr: "3,500,000",
      cr: "",
    },
    {
      date: "2026-05-24",
      desc: "Credit Interest Payment Received",
      dr: "",
      cr: "50,000",
    },
    {
      date: "2026-05-25",
      desc: "ACH Receipt - Client Apex Holdings Settlement",
      dr: "",
      cr: "9,000,000",
    },
    {
      date: "2026-05-27",
      desc: "Software License Renewal - Microsoft Office 365",
      dr: "9,000,000",
      cr: "",
    },
    {
      date: "2026-05-28",
      desc: "Outward Telegram Transfer Commission Charges",
      dr: "15,000",
      cr: "",
    },
    {
      date: "2026-05-30",
      desc: "Corporate Fuel Expense - KBZ Visa Debit Card",
      dr: "1,000,000",
      cr: "",
    },
  ];

  let y = 102;
  transactions.forEach((tx) => {
    doc.text(tx.date, 23, y);
    doc.text(tx.desc, 50, y);

    if (tx.dr) {
      doc.text(tx.dr, 145, y, { align: "right" });
    } else {
      doc.text("-", 140, y);
    }

    if (tx.cr) {
      doc.text(tx.cr, 180, y, { align: "right" });
    } else {
      doc.text("-", 175, y);
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(20, y + 2, 195, y + 2);
    y += 7;
  });

  savePDF(doc, "bank_statement_1.pdf");
}

// -------------------------------------------------------------
// 4. BANK STATEMENT 2: KBZ Bank (denominations in MMK)
// -------------------------------------------------------------
function generateBankStatement2() {
  const doc = new jsPDF({ format: "letter" });

  // Header / Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // emerald-500 (KBZ style green/brand color representation)
  doc.text("KANBAWZA BANK (KBZ BANK)", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Head Office: Strand Road, Yangon, Myanmar", 20, 31);

  // Divider
  doc.setDrawColor(16, 185, 129);
  doc.line(20, 38, 195, 38);

  // Statement Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("SAVINGS ACCOUNT STATEMENT", 20, 48);

  doc.setFontSize(9);
  doc.text("Account Name:", 20, 58);
  doc.text("Account Number:", 20, 64);
  doc.text("Statement Period:", 20, 70);
  doc.text("Currency:", 20, 76);

  doc.setFont("helvetica", "normal");
  doc.text("TZ Assurance Clients Group", 55, 58);
  doc.text("058-201-058-0091823", 55, 64);
  doc.text("2026-05-01 to 2026-05-31", 55, 70);
  doc.text("MMK (Kyat)", 55, 76);

  // Balance Summary
  doc.setFont("helvetica", "bold");
  doc.text("Opening Balance:", 120, 58);
  doc.text("Total Debits:", 120, 64);
  doc.text("Total Credits:", 120, 70);
  doc.text("Closing Balance:", 120, 76);

  doc.setFont("helvetica", "normal");
  doc.text("75,000,000 MMK", 155, 58);
  doc.text("15,200,000 MMK", 155, 64);
  doc.text("22,050,000 MMK", 155, 70);
  doc.setFont("helvetica", "bold");
  doc.text("81,850,000 MMK", 155, 76);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 88, 175, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Value Date", 23, 93);
  doc.text("Transaction Details / References", 50, 93);
  doc.text("Withdrawals (Debit)", 125, 93);
  doc.text("Deposits (Credit)", 160, 93);

  // Table Rows (Realistic Audit Ledger Transactions in MMK)
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);

  const transactions = [
    {
      date: "2026-05-01",
      desc: "Opening Balance Carried Forward",
      dr: "",
      cr: "",
    },
    {
      date: "2026-05-03",
      desc: "Monthly Service Charges",
      dr: "10,000",
      cr: "",
    },
    {
      date: "2026-05-05",
      desc: "Interest Pay-out Savings Account",
      dr: "",
      cr: "50,000",
    },
    {
      date: "2026-05-08",
      desc: "Cash Withdrawal - ATM Union Square Branch",
      dr: "500,000",
      cr: "",
    },
    {
      date: "2026-05-10",
      desc: "Inward Clearing Cheque Ref #10084729",
      dr: "",
      cr: "15,000,000",
    },
    {
      date: "2026-05-14",
      desc: "Online Fund Transfer - KBZ to CB Card Settlement",
      dr: "1,200,000",
      cr: "",
    },
    {
      date: "2026-05-18",
      desc: "Monthly Salary Disbursement to Employee payroll",
      dr: "12,480,000",
      cr: "",
    },
    {
      date: "2026-05-22",
      desc: "Inward Transfer - Rent from tenant Building B",
      dr: "",
      cr: "3,500,000",
    },
    {
      date: "2026-05-24",
      desc: "Office Internet Payment - Fiber Link Yangon",
      dr: "80,000",
      cr: "",
    },
    {
      date: "2026-05-25",
      desc: "Corporate Dining Expense - KBZ Card Ref #419",
      dr: "120,000",
      cr: "",
    },
    {
      date: "2026-05-27",
      desc: "Fulfillment Receipt - Apex Credit Card Payment",
      dr: "",
      cr: "3,500,000",
    },
    {
      date: "2026-05-28",
      desc: "VAT Tax Payment Output wire",
      dr: "810,000",
      cr: "",
    },
  ];

  let y = 102;
  transactions.forEach((tx) => {
    doc.text(tx.date, 23, y);
    doc.text(tx.desc, 50, y);

    if (tx.dr) {
      doc.text(tx.dr, 145, y, { align: "right" });
    } else {
      doc.text("-", 140, y);
    }

    if (tx.cr) {
      doc.text(tx.cr, 180, y, { align: "right" });
    } else {
      doc.text("-", 175, y);
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(20, y + 2, 195, y + 2);
    y += 7;
  });

  savePDF(doc, "bank_statement_2.pdf");
}

// Execute all
console.log("Generating sample MMK audit PDF documents...");
generateInvoice1();
generateInvoice2();
generateBankStatement1();
generateBankStatement2();
console.log("All sample PDFs successfully generated in ./samples folder.");
