import { useState } from "react";

interface PowerSource {
  type: string;
  voltage: number;
  current: number;
  image: string;
}

interface PowerSourceSelectionProps {
  powerSource: PowerSource | null;
  onUpdate: (powerSource: PowerSource | null) => void;
  onNext: () => void;
}

const POWER_SOURCE_OPTIONS = [
  {
    type: "Battery",
    voltage: 9,
    current: 1,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&h=200&fit=crop&crop=center",
    description: "Standard 9V battery for small circuits",
  },
  {
    type: "USB Power",
    voltage: 5,
    current: 2,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop&crop=center",
    description: "USB power supply for digital circuits",
  },
  {
    type: "AC Adapter",
    voltage: 12,
    current: 3,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&h=200&fit=crop&crop=center",
    description: "AC to DC adapter for higher power needs",
  },
  {
    type: "Solar Panel",
    voltage: 6,
    current: 0.5,
    image:
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=200&h=200&fit=crop&crop=center",
    description: "Solar power for eco-friendly circuits",
  },
];

export default function PowerSourceSelection({
  powerSource,
  onUpdate,
  onNext,
}: PowerSourceSelectionProps) {
  const [selectedSource, setSelectedSource] = useState<PowerSource | null>(
    powerSource
  );

  const handleSourceSelect = (source: PowerSource) => {
    setSelectedSource(source);
    onUpdate(source);
  };

  const handleNext = () => {
    if (selectedSource) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Power Source
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the power source that best fits your circuit requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POWER_SOURCE_OPTIONS.map((option) => (
          <div
            key={option.type}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              selectedSource?.type === option.type
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
            onClick={() => handleSourceSelect(option)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={option.image}
                  alt={option.type}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {option.type}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {option.description}
                </p>
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {option.voltage}V
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {option.current}A
                  </span>
                </div>
              </div>
              {selectedSource?.type === option.type && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSource && (
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
            <span className="text-green-800 dark:text-green-200 font-medium">
              {selectedSource.type} selected: {selectedSource.voltage}V,{" "}
              {selectedSource.current}A
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedSource}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedSource
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
