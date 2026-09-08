export type PaneSkeletonKind = "boot" | "rows" | "cards" | "viewer";

interface PaneSkeletonProps {
  kind: PaneSkeletonKind;
  label: string;
}

export function PaneSkeleton({ kind, label }: PaneSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className="flex w-full min-w-0 flex-col gap-3"
      role="status"
    >
      {kind === "boot" ? <BootBars /> : null}
      {kind === "rows" ? <RowBars /> : null}
      {kind === "cards" ? <CardBars /> : null}
      {kind === "viewer" ? <ViewerFrame /> : null}
    </div>
  );
}

function BootBars() {
  return (
    <>
      <div className="dt-skeleton h-5 w-2/3" />
      <div className="dt-skeleton h-3 w-1/2" />
      <div className="dt-skeleton h-24 w-full" />
      <div className="dt-skeleton h-12 w-full" />
      <div className="dt-skeleton h-12 w-5/6" />
      <div className="dt-skeleton h-12 w-full" />
      <div className="dt-skeleton h-12 w-4/5" />
    </>
  );
}

function RowBars() {
  return (
    <>
      <div className="dt-skeleton h-10 w-full" />
      <div className="dt-skeleton h-10 w-full" />
      <div className="dt-skeleton h-10 w-5/6" />
      <div className="dt-skeleton h-10 w-full" />
    </>
  );
}

function CardBars() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 p-4 dark:border-white/10">
      <div className="dt-skeleton h-4 w-1/3" />
      <div className="dt-skeleton h-16 w-full" />
      <div className="dt-skeleton h-3 w-2/3" />
    </div>
  );
}

function ViewerFrame() {
  return (
    <div className="flex min-h-[300px] flex-col gap-3 rounded-[2.5rem] border border-slate-200/70 p-4 dark:border-white/10">
      <div className="dt-skeleton h-4 w-1/3" />
      <div className="dt-skeleton min-h-[240px] w-full flex-1" />
    </div>
  );
}
