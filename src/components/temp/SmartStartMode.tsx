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
    id: string;
    type: string;
    value: string;
    image: string;
  }>;
}

// Power Source Selection Component
function PowerSourceSelection({
  powerSource,
  onUpdate,
  onNext,
}: {
  powerSource: CircuitData["powerSource"];
  onUpdate: (powerSource: CircuitData["powerSource"]) => void;
  onNext: () => void;
}) {
  const [selectedSource, setSelectedSource] =
    useState<CircuitData["powerSource"]>(powerSource);

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

  const handleSourceSelect = (source: CircuitData["powerSource"]) => {
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

  const COMPONENT_OPTIONS = [
    {
      type: "Resistor",
      values: ["100Ω", "220Ω", "470Ω", "1kΩ", "10kΩ", "100kΩ"],
      image:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&h=200&fit=crop&crop=center",
      description: "Resistive components for current limiting",
    },
    {
      type: "LED",
      values: ["Red", "Green", "Blue", "White", "Yellow"],
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop&crop=center",
      description: "Light emitting diodes for indicators",
    },
    {
      type: "Capacitor",
      values: ["1µF", "10µF", "100µF", "1mF", "10mF"],
      image:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&h=200&fit=crop&crop=center",
      description: "Capacitive components for filtering",
    },
  ];

  const handleAddComponent = () => {
    if (selectedType && selectedValue) {
      const newComponent = {
        id: `${selectedType}-${Date.now()}`,
        type: selectedType,
        value: selectedValue,
        image:
          COMPONENT_OPTIONS.find((opt) => opt.type === selectedType)?.image ||
          "",
      };
      onUpdate([...components, newComponent]);
      setSelectedType("");
      setSelectedValue("");
    }
  };

  const handleRemoveComponent = (id: string) => {
    onUpdate(components.filter((comp) => comp.id !== id));
  };

  const getAvailableValues = () => {
    const option = COMPONENT_OPTIONS.find((opt) => opt.type === selectedType);
    return option ? option.values : [];
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value/Specification
            </label>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              disabled={!selectedType}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">Select value...</option>
              {getAvailableValues().map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddComponent}
              disabled={!selectedType || !selectedValue}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                selectedType && selectedValue
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

export default function SmartStartMode() {
  const [currentStep, setCurrentStep] = useState(0);
  const [circuitData, setCircuitData] = useState<CircuitData>({
    powerSource: null,
    components: [],
  });

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

  const updatePowerSource = (powerSource: CircuitData["powerSource"]) => {
    setCircuitData((prev) => ({ ...prev, powerSource }));
  };

  const updateComponents = (components: CircuitData["components"]) => {
    setCircuitData((prev) => ({ ...prev, components }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PowerSourceSelection
            powerSource={circuitData.powerSource}
            onUpdate={updatePowerSource}
            onNext={handleNext}
          />
        );
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Smart Start Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Follow the steps below to create your circuit
          </p>
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
