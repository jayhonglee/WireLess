import { LoadingOrError } from "components/LoadingOrError";
import { Home } from "pages/Home";
import { SmartStartMode } from "pages/SmartStartMode";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { NAVBAR_ENUM } from "constants.json";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingOrError />}>
        <Routes>
          <Route element={<Home />} index={true} />
          <Route
            element={<SmartStartMode />}
            path={NAVBAR_ENUM.SMART_START_MODE}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
