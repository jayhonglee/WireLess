import { useState } from "react";

interface Component {
  id: string;
  type: string;
  value: string;
  image: string;
}

interface ComponentSelectionProps {
  components: Component[];
  onUpdate: (components: Component[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

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
  {
    type: "Switch",
    values: ["Toggle", "Push Button", "Slide", "Rotary"],
    image:
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=200&h=200&fit=crop&crop=center",
    description: "Switching components for control",
  },
  {
    type: "Transistor",
    values: ["NPN", "PNP", "MOSFET", "JFET"],
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200&h=200&fit=crop&crop=center",
    description: "Amplification and switching devices",
  },
  {
    type: "IC",
    values: ["555 Timer", "Op-Amp", "Logic Gate", "Microcontroller"],
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop&crop=center",
    description: "Integrated circuits for complex functions",
  },
];

export default function ComponentSelection({
  components,
  onUpdate,
  onNext,
  onPrevious,
}: ComponentSelectionProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleAddComponent = () => {
    if (selectedType && selectedValue) {
      const newComponent: Component = {
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

      {/* Component Selection */}
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

      {/* Selected Components */}
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
