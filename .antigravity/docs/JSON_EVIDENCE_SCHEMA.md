# JSON Evidence Schema

DocTrace accepts `.json` files as structured evidence imports. A single JSON file can contain either one document object or a `documents` array.

## Single document example

```json
{
  "kind": "invoice",
  "fileName": "invoice-47209847.json",
  "invoiceNumber": "47209847",
  "amount": 4270.5,
  "date": "2020-04-01",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Invoice 47209847 dated 2020-04-01 total 4270.50",
      "snippets": ["Invoice 47209847", "Total amount 4270.50"]
    }
  ]
}
```

## Multi-document bundle example

```json
{
  "documents": [
    {
      "kind": "invoice",
      "fileName": "invoice-20020098475.json",
      "invoiceNumber": "20020098475",
      "amount": 1512.4,
      "date": "2020-07-11"
    },
    {
      "kind": "bank-statement",
      "fileName": "bank-september.json",
      "statementEntries": [
        {
          "date": "2020-07-11",
          "amount": 1512.4,
          "reference": "20020098475",
          "rawLine": "2020-07-11 payment 20020098475 amount 1512.40"
        }
      ]
    }
  ]
}
```

## Supported fields

- `kind` or `type`: `invoice` or `bank-statement`
- `fileName` or `name`
- `invoiceNumber`
- `amount`
- `date`
- `pages[]`
- `statementEntries[]`
- `extractedText`
- `text`
- `importedAt`
- `mimeType`

## Parser behavior

- If `pages` are missing, DocTrace creates a single synthetic page from `text`, `extractedText`, or the raw JSON body.
- If `statementEntries` are missing for a bank statement, DocTrace falls back to text-line extraction.
- If a JSON file contains multiple documents, each document is imported separately.
