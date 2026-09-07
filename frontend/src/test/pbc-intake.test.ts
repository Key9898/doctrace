import { describe, expect, it } from "vitest";

import {
  PBC_INTAKE_CASES,
  pbcDocumentKind,
  pbcIntakeKind,
} from "@/features/pbc-portal/services/pbc-intake";

describe("pbc intake classifier", () => {
  it("routes the five demo rows fail-closed", () => {
    const byId = Object.fromEntries(
      PBC_INTAKE_CASES.map((row) => [row.id, pbcIntakeKind(row)]),
    );

    expect(byId.pbc_1).toBe("list-only");
    expect(byId.pbc_2).toBe("list-only");
    expect(byId.pbc_3).toBe("tod-invoice");
    expect(byId.pbc_4).toBe("tod-invoice");
    expect(byId.pbc_5).toBe("list-only");
    expect(pbcDocumentKind(byId.pbc_3)).toBe("invoice");
    expect(pbcDocumentKind(byId.pbc_4)).toBe("invoice");
    expect(pbcDocumentKind(byId.pbc_1)).toBeNull();
    expect(pbcDocumentKind(byId.pbc_2)).toBeNull();
  });

  it("treats a Cash and Bank statement as tod-bank, not a confirmation", () => {
    expect(
      pbcIntakeKind({
        item: "June operating bank statement",
        category: "Cash & Bank",
      }),
    ).toBe("tod-bank");
    expect(
      pbcDocumentKind(
        pbcIntakeKind({
          item: "June operating bank statement",
          category: "Cash & Bank",
        }),
      ),
    ).toBe("bank-statement");
  });

  it("defaults unknown requests to list-only", () => {
    expect(
      pbcIntakeKind({ item: "Unspecified schedule", category: "Other" }),
    ).toBe("list-only");
    expect(
      pbcDocumentKind(
        pbcIntakeKind({ item: "Unspecified schedule", category: "Other" }),
      ),
    ).toBeNull();
  });
});
