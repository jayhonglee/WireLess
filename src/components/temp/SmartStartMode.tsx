import { useState } from "react";
import { IconType, type IconTypeType } from "../../utils/getIcon";
import STM32Connection from "./STM32Connection";
import Stepper from "../Stepper";

interface Step {
  TITLE: string;
  DESCRIPTION: string;
  ICON: IconTypeType;
}

const STEPS: Step[] = [
  {
    TITLE: "Power Source Selection",
    DESCRIPTION: "Define power source parameters",
    ICON: IconType.POWER_SOURCE,
  },
  {
    TITLE: "Component Selection",
    DESCRIPTION: "Add components to your circuit",
    ICON: IconType.COMPONENT,
  },
  {
    TITLE: "Review Circuit Summary",
    DESCRIPTION: "Review your circuit summary",
    ICON: IconType.REVIEW,
  },
  {
    TITLE: "Generate Circuit",
    DESCRIPTION: "Automatically generate a circuit",
    ICON: IconType.GENERATE,
  },
];

interface CircuitData {
  powerSource: {
    type: string;
    voltage: number;
    current: number;
    image: string;
  } | null;
  components: Array<{
    mode: string;
    id: string;
    type: string;
    value: string;
    image: string;
  }>;
}

// Power Source Selection Component
function PowerSourceSelection({ onNext }: { onNext: () => void }) {
  const handleNext = () => {
    // Auto-advance since power source is manually adjusted
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Power Source Configuration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your power source directly on the STM32F446RE board
        </p>
      </div>

      {/* Instructions for AC Power */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 12 Q7 0 11 10 T19 10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              AC Power Frequency Adjustment
            </h3>
            <div className="text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                <strong>For AC power usage:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>The square wave output is 3.3 V</li>
                <li>The sine and triangle wave outputs default to 0.6 V</li>
                <li>Rotate the knob to adjust frequency up to 12MHz</li>
                <li>
                  The display on the board will show real-time frequency updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions for DC Power */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              DC Power Voltage Measurement
            </h3>
            <div className="text-green-800 dark:text-green-200 space-y-2">
              <p>
                <strong>For DC power usage:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Connect your DC power source to the dedicated DC pins</li>
                <li>The DC voltage will be up to 5V by default</li>
                <li>
                  Use the built-in multimeter pins for voltage measurement
                </li>
                <li>
                  The board will automatically detect and display DC voltage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* General Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Important Safety Notes
            </h3>
            <div className="text-yellow-800 dark:text-yellow-200 space-y-2">
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Handle all components carefully to avoid damage or incorrect
                  wiring
                </li>
                <li>
                  Check voltage ratings of components before applying power
                </li>
                <li>Start with lower voltages/frequencies when testing</li>
                <li>
                  Always use appropriate safety precautions when working with
                  power
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Component Selection
        </button>
      </div>
    </div>
  );
}

// Component Selection Component
function ComponentSelection({
  components,
  onUpdate,
  onNext,
  onPrevious,
}: {
  components: CircuitData["components"];
  onUpdate: (components: CircuitData["components"]) => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [addMode, setAddMode] = useState<"series" | "parallel">("series");

  const COMPONENT_OPTIONS = [
    {
      type: "Resistor",
      values: ["100Ω", "220Ω", "470Ω", "1kΩ", "10kΩ", "100kΩ"],
      image:
        "https://projectpoint.in/image/cache/catalog/CFR-1W-3M3-672x504.jpg",
      description: "Resistive components for current limiting",
    },
    {
      type: "LED",
      values: ["Red", "Green", "Blue", "White", "Yellow"],
      image:
        "https://cdn11.bigcommerce.com/s-am5zt8xfow/images/stencil/300x300/products/1158/2882/apipocsrl__91685.1554989476.jpg?c=2",
      description: "Light emitting diodes for indicators",
    },
    {
      type: "Capacitor",
      values: ["1µF", "10µF", "100µF", "1mF", "10mF"],
      image:
        "https://components101.com/sites/default/files/components/Electrolytic-capacitor.jpg",
      description: "Capacitive components for filtering",
    },
  ];

  const handleAddComponent = () => {
    if (selectedType) {
      const newComponent = {
        id: `${selectedType}-${Date.now()}`,
        type: selectedType,
        value: selectedValue,
        image:
          COMPONENT_OPTIONS.find((opt) => opt.type === selectedType)?.image ||
          "",
        mode: addMode, // Track how it was added
      };
      onUpdate([...components, newComponent]);
      setSelectedType("");
      setSelectedValue("");
      setAddMode("series");
    }
  };

  const handleRemoveComponent = (id: string) => {
    onUpdate(components.filter((comp) => comp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Components
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add components to your circuit. You can add multiple components of the
          same type.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Add New Component
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Component Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedValue("");
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select type...</option>
              {COMPONENT_OPTIONS.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.type}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Mode
            </label>
            <select
              value={addMode}
              onChange={(e) =>
                setAddMode(e.target.value as "series" | "parallel")
              }
              disabled={components.length === 0} // Disable for first component
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="series">Series</option>
              <option value="parallel">Parallel</option>
            </select>
            {/* {components.length === 0 && (
              <p className="absolute bottom-[-20px] left-[10px] text-xs text-gray-500 mt-1">
                First component must be in series.
              </p>
            )} */}
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddComponent}
              disabled={!selectedType}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                selectedType
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add Component
            </button>
          </div>
        </div>
      </div>

      {components.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Selected Components ({components.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component) => (
              <div
                key={component.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={component.image}
                    alt={component.type}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {component.type}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {component.value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveComponent(component.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  {component.mode === "parallel" && (
                    <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                      Parallel
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={components.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            components.length > 0
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

// Review Circuit Component
function ReviewCircuit({
  circuitData,
  onNext,
  onPrevious,
}: {
  circuitData: CircuitData;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const { components } = circuitData;

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

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Power Source Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              3.3V
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              AC Square Wave
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              0.6V
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              AC Sine/Triangle Wave
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              5V
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              DC Voltage (Max)
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              12MHz
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              AC Frequency (Max)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Components ({components.length} total)
        </h3>

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

      <div className="space-y-3">
        {false && (
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

        {components.length > 0 && (
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

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={components.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            components.length > 0
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

// --- Add this helper function ---
function getCircuitStructure(components: CircuitData["components"]) {
  if (components.length === 0) return "";
  let structure = "";
  let i = 0;
  while (i < components.length) {
    const comp = components[i];
    if (!comp) break;
    const mode = comp.mode;
    let count = 1;
    // Count consecutive components with the same mode
    while (
      i + count < components.length &&
      components[i + count] &&
      components[i + count]!.mode === mode
    ) {
      count++;
    }
    structure += (mode === "series" ? "S" : "P") + count;
    i += count;
  }
  return structure;
}

export default function SmartStartMode() {
  const [currentStep, setCurrentStep] = useState(0);
  const [circuitData, setCircuitData] = useState<CircuitData>({
    powerSource: null,
    components: [],
  });
  const [circuitStructure, setCircuitStructure] = useState<string>("");

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update components and circuit structure
  const updateComponents = (components: CircuitData["components"]) => {
    setCircuitData((prev) => ({ ...prev, components }));
    setCircuitStructure(getCircuitStructure(components));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PowerSourceSelection onNext={handleNext} />;
      case 1:
        return (
          <ComponentSelection
            components={circuitData.components}
            onUpdate={updateComponents}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <ReviewCircuit
            circuitData={circuitData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <STM32Connection
            circuitData={circuitData}
            circuitStructure={circuitStructure}
            onCircuitGenerated={(success, message) => {
              console.log("Circuit generation result:", success, message);
            }}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Start Mode
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Follow the steps below to create your circuit
            </p>
            {/* Show circuit structure */}
            {circuitStructure && (
              <div className="mt-2 text-blue-700 dark:text-blue-300 font-mono">
                Circuit Structure: {circuitStructure}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stepper Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <Stepper steps={STEPS as any} currentStep={currentStep} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
