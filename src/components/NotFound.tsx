import { Head } from "./Head";
import { ROUTE_NAMES, ROUTES } from "../utils/routes";
import Navbar from "./Navbar";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head title="Page Not Found - WireLess" />

      <Navbar
        items={Object.values(ROUTE_NAMES)}
        selectedMode={ROUTE_NAMES.HOME}
      />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a
            href={ROUTES.HOME}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
