import { LoadingOrError } from "components/LoadingOrError";
import { Home } from "pages/Home";
import { SmartStartMode } from "pages/SmartStartMode";
import NotFound from "components/NotFound";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { ROUTES } from "utils/routes";

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
            path={ROUTES.SMART_START_MODE.slice(1)}
          />
          <Route
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
                <p className="text-gray-600">
                  This feature is under development.
                </p>
              </div>
            }
            path={ROUTES.PRO_MODE.slice(1)}
          />
          <Route
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">About WireLess</h1>
                <p className="text-gray-600">
                  Your intelligent circuit prototyping system.
                </p>
              </div>
            }
            path={ROUTES.ABOUT.slice(1)}
          />
          <Route
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Guide</h1>
                <p className="text-gray-600">
                  Learn how to use WireLess effectively.
                </p>
              </div>
            }
            path={ROUTES.GUIDE.slice(1)}
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
