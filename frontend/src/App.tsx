import { PaneErrorBoundary } from "@/features/shell/components/PaneErrorBoundary/PaneErrorBoundary";
import { AppLayout } from "@/layouts/AppLayout";

export function App() {
  return (
    <PaneErrorBoundary>
      <AppLayout />
    </PaneErrorBoundary>
  );
}
