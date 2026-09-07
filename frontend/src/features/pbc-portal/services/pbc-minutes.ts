import { PBC_INTAKE_CASES } from "@/features/pbc-portal/services/pbc-intake";
import type { PbcMinutesLink } from "@/types/domain";

const MINUTES_PATTERN = /\bminutes\b/i;

const PBC_MINUTES_DEMO_EXTRAS: Pick<PbcMinutesLink, "fileName" | "status"> = {
  fileName: "board_minutes_combined.pdf",
  status: "Approved",
};

export interface PbcMinutesRequestInput {
  id: string;
  item: string;
  category: string;
  status: PbcMinutesLink["status"];
  fileName?: string;
}

export function isPbcMinutesRequest(input: {
  item: string;
  category: string;
}): boolean {
  return MINUTES_PATTERN.test(`${input.item} ${input.category}`);
}

export function minutesLinksFromRequests(
  requests: readonly PbcMinutesRequestInput[],
): PbcMinutesLink[] {
  return requests.flatMap((request) => {
    const fileName = request.fileName?.trim();

    if (!fileName || !isPbcMinutesRequest(request)) {
      return [];
    }

    return [
      {
        requestId: request.id,
        item: request.item,
        fileName,
        status: request.status,
      },
    ];
  });
}

export function pbcMinutesDemoLinks(): PbcMinutesLink[] {
  return minutesLinksFromRequests(
    PBC_INTAKE_CASES.map((row) =>
      isPbcMinutesRequest(row)
        ? { ...row, ...PBC_MINUTES_DEMO_EXTRAS }
        : { ...row, status: "Pending" },
    ),
  );
}
