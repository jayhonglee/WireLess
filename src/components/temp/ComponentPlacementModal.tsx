interface ComponentPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitStructure: string;
  components: Array<{
    id: string;
    type: string;
    value: string;
    image: string;
    mode: string;
  }>;
}

export default function ComponentPlacementModal({
  isOpen,
  onClose,
  circuitStructure,
  components,
}: ComponentPlacementModalProps) {
  if (!isOpen) return null;

  // Parse circuit structure and create placement visualization
  const parseCircuitStructure = (structure: string) => {
    const placements = [];
    let componentIndex = 0;
    let icNumber = 1;

    // Parse structure like "S2P2S2"
    const matches = structure.match(/([SP])(\d+)/g) || [];

    for (const match of matches) {
      const mode = match[0]; // S or P
      const count = parseInt(match.slice(1)); // number

      // For P1, treat as S1 (single component)
      const actualMode = count === 1 ? "S" : mode;
      const actualCount = count === 1 ? 1 : count;

      if (actualMode === "S") {
        // Series components: each component gets its own IC
        for (let i = 0; i < actualCount; i++) {
          if (componentIndex < components.length) {
            placements.push({
              icNumber: icNumber++,
              mode: actualMode,
              components: [
                {
                  ...components[componentIndex],
                  mode: actualMode,
                },
              ],
              isParallel: false,
            });
            componentIndex++;
          }
        }
      } else {
        // Parallel components: share ICs (up to 4 per IC)
        const icsNeeded = Math.ceil(actualCount / 4);

        for (let icIndex = 0; icIndex < icsNeeded; icIndex++) {
          const componentsInThisIC = Math.min(4, actualCount - icIndex * 4);
          const icComponents = [];

          for (let i = 0; i < componentsInThisIC; i++) {
            if (componentIndex < components.length) {
              icComponents.push({
                ...components[componentIndex],
                mode: actualMode,
              });
              componentIndex++;
            }
          }

          if (icComponents.length > 0) {
            placements.push({
              icNumber: icNumber++,
              mode: actualMode,
              components: icComponents,
              isParallel: true,
            });
          }
        }
      }
    }

    return placements;
  };

  const placements = parseCircuitStructure(circuitStructure);

  const renderICSlot = (placement: any, index: number) => {
    const { icNumber, components: icComponents, isParallel } = placement;

    return (
      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            8-Pin IC Socket #{icNumber}
          </h4>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isParallel
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {isParallel ? "Parallel" : "Series"}
            </span>
          </div>
        </div>

        {/* IC Visual Representation */}
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            8-Pin IC Socket
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, slotIndex) => {
              const component = icComponents[slotIndex];
              return (
                <div
                  key={slotIndex}
                  className={`h-16 border-2 rounded-lg flex items-center justify-center ${
                    component
                      ? isParallel
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  }`}
                >
                  {component ? (
                    <div className="text-center">
                      <img
                        src={component.image}
                        alt={component.type}
                        className="w-6 h-6 mx-auto mb-1 rounded"
                      />
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {component.type}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Empty
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Pins 1-8 | Pins 2-7 | Pins 3-6 | Pins 4-5
          </div>
        </div>

        {/* Component Details */}
        <div className="space-y-2">
          {icComponents.map((component: any, compIndex: number) => (
            <div
              key={compIndex}
              className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg p-2"
            >
              <img
                src={component.image}
                alt={component.type}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {component.type}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {component.value}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Slot {compIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Component Placement Guide
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Circuit Structure:{" "}
              <span className="font-mono font-semibold">
                {circuitStructure}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 8-Pin IC Socket Reference */}
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
              What is an 8-Pin IC Socket?
            </h3>
            <div className="flex justify-center mb-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-600">
                <img
                  src="/ic_socket.png"
                  alt="8-Pin IC Socket"
                  className="w-auto h-32 object-contain rounded-lg"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              An 8-pin IC socket is a connector that holds integrated circuits.
              Each socket has 8 pins (4 on each side) and can accommodate up to
              4 electronic components, with each component using 2 pins.
            </p>
          </div>

          {/* Legend */}
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Placement Rules
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                • Each 8-pin IC can hold up to 4 components (2 pins per
                component)
              </li>
              <li>• Series components (S) each get their own IC</li>
              <li>
                • Parallel components (P) share the same IC (up to 4 per IC)
              </li>
              <li>• P1 is treated as S1 (single component)</li>
            </ul>
          </div>

          {/* IC Placements */}
          <div className="space-y-4">
            {placements.length > 0 ? (
              placements.map((placement, index) =>
                renderICSlot(placement, index)
              )
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No components to place. Add components to see placement guide.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
