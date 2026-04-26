export const sampleInvoicesPayload = {
  documents: [
    {
      kind: "invoice",
      fileName: "invoice-20020098475.json",
      invoiceNumber: "20020098475",
      amount: 1512.4,
      date: "2020-07-11",
      pages: [
        {
          pageNumber: 1,
          text: "Invoice 20020098475 dated 2020-07-11 total 1512.40 from LinkedIn Ireland Limited",
          snippets: ["Invoice 20020098475", "Date 2020-07-11", "Total 1512.40"],
        },
      ],
    },
    {
      kind: "invoice",
      fileName: "invoice-47209847.json",
      invoiceNumber: "47209847",
      amount: 4270.5,
      date: "2020-04-01",
      pages: [
        {
          pageNumber: 1,
          text: "Invoice 47209847 dated 2020-04-01 total 4270.50",
          snippets: ["Invoice 47209847", "Total amount 4270.50"],
        },
      ],
    },
    {
      kind: "invoice",
      fileName: "invoice-INV21436.json",
      invoiceNumber: "INV21436",
      amount: 213.36,
      date: "2020-09-14",
      pages: [
        {
          pageNumber: 1,
          text: "Invoice INV21436 dated 2020-09-14 total 213.36 for audit sample testing",
          snippets: ["Invoice INV21436", "Date 2020-09-14", "Total 213.36"],
        },
      ],
    },
  ],
} as const;

export const sampleBankStatementsPayload = {
  documents: [
    {
      kind: "bank-statement",
      fileName: "bank-statement-july.json",
      statementEntries: [
        {
          date: "2020-07-11",
          amount: 1512.4,
          reference: "20020098475",
          rawLine: "2020-07-11 payment reference 20020098475 amount 1512.40",
        },
        {
          date: "2020-04-01",
          amount: 4270.5,
          reference: "47209847",
          rawLine: "2020-04-01 transfer reference 47209847 amount 4270.50",
        },
        {
          date: "2020-09-14",
          amount: 213.36,
          reference: "INV21436",
          rawLine: "2020-09-14 payment reference INV21436 amount 213.36",
        },
      ],
    },
  ],
} as const;
