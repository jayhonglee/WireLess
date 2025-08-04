interface CircuitData {
  powerSource: {
    type: string;
    voltage: number;
    current: number;
    image: string;
  } | null;
  components: Array<{
    id: string;
    type: string;
    value: string;
    image: string;
  }>;
}

interface ReviewCircuitProps {
  circuitData: CircuitData;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ReviewCircuit({
  circuitData,
  onNext,
  onPrevious,
}: ReviewCircuitProps) {
  const { powerSource, components } = circuitData;

  const calculateTotalPower = () => {
    if (!powerSource) return 0;
    return powerSource.voltage * powerSource.current;
  };

  const getComponentCounts = () => {
    const counts: Record<string, number> = {};
    components.forEach((comp) => {
      counts[comp.type] = (counts[comp.type] || 0) + 1;
    });
    return counts;
  };

  const componentCounts = getComponentCounts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review Circuit Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your circuit configuration before generation
        </p>
      </div>

      {/* Circuit Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Circuit Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {powerSource ? powerSource.voltage : 0}V
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Voltage
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {powerSource ? powerSource.current : 0}A
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Current
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {calculateTotalPower()}W
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Total Power
            </div>
          </div>
        </div>
      </div>

      {/* Power Source Details */}
      {powerSource && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Power Source
          </h3>
          <div className="flex items-center space-x-4">
            <img
              src={powerSource.image}
              alt={powerSource.type}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {powerSource.type}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {powerSource.voltage}V, {powerSource.current}A
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Components Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Components ({components.length} total)
        </h3>

        {/* Component Counts */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Component Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(componentCounts).map(([type, count]) => (
              <div
                key={type}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Component List */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Component Details
          </h4>
          <div className="space-y-3">
            {components.map((component, index) => (
              <div
                key={component.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={component.image}
                    alt={component.type}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {component.type}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {component.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circuit Diagram Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Circuit Preview
        </h3>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Circuit diagram will be generated in the next step
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {components.length} components connected to{" "}
            {powerSource?.type || "power source"}
          </p>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="space-y-3">
        {!powerSource && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 dark:text-red-200">
                No power source selected
              </span>
            </div>
          </div>
        )}

        {components.length === 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 dark:text-red-200">
                No components added
              </span>
            </div>
          </div>
        )}

        {powerSource && components.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800 dark:text-green-200">
                Circuit configuration is valid and ready for generation
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!powerSource || components.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            powerSource && components.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Generate Circuit
        </button>
      </div>
    </div>
  );
}
