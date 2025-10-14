interface ComponentInsertionModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentType: string;
  componentImage: string;
}

export default function ComponentInsertionModal({
  isOpen,
  onClose,
  componentType,
  componentImage,
}: ComponentInsertionModalProps) {
  if (!isOpen) return null;

  const getInsertionInstructions = (type: string) => {
    switch (type.toLowerCase()) {
      case "resistor":
        return {
          title: "How to Insert Resistor",
          steps: [
            "1. Identify the resistor value using the color bands",
            "2. Locate the resistor slots on the breadboard",
            "3. Insert the resistor leads into the breadboard holes",
            "4. Ensure proper orientation (resistors are not polarized)",
            "5. Check that the resistor is firmly seated",
          ],
          tips: [
            "Resistors can be inserted in either direction",
            "Use the color code chart to identify values",
            "Ensure good contact with breadboard pins",
          ],
        };
      case "led":
        return {
          title: "How to Insert LED",
          steps: [
            "1. Identify the LED polarity (longer leg = positive, shorter = negative)",
            "2. Locate the LED slots on the breadboard",
            "3. Insert the longer leg (anode) into the positive rail",
            "4. Insert the shorter leg (cathode) into the negative rail",
            "5. Always use a current-limiting resistor with LEDs",
          ],
          tips: [
            "LEDs are polarized - wrong direction won't work",
            "Never connect LEDs directly to power without a resistor",
            "Check the LED datasheet for forward voltage",
          ],
        };
      case "capacitor":
        return {
          title: "How to Insert Capacitor",
          steps: [
            "1. Identify capacitor polarity (electrolytic capacitors have + and - markings)",
            "2. Locate the capacitor slots on the breadboard",
            "3. Insert the positive lead into the positive rail",
            "4. Insert the negative lead into the negative rail",
            "5. Ensure proper orientation for polarized capacitors",
          ],
          tips: [
            "Electrolytic capacitors are polarized",
            "Ceramic capacitors are not polarized",
            "Check voltage ratings before use",
          ],
        };
      default:
        return {
          title: "How to Insert Component",
          steps: [
            "1. Identify the component type and specifications",
            "2. Locate the appropriate slots on the breadboard",
            "3. Check for polarity requirements",
            "4. Insert the component leads carefully",
            "5. Verify proper connection",
          ],
          tips: [
            "Always check component datasheets",
            "Ensure proper orientation for polarized components",
            "Double-check connections before powering on",
          ],
        };
    }
  };

  const instructions = getInsertionInstructions(componentType);

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {instructions.title}
          </h2>
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
        <div className="p-6 space-y-6">
          {/* Component Image */}
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <img
                src={componentImage}
                alt={componentType}
                className="w-32 h-32 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Insertion Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Insertion Steps
            </h3>
            <div className="space-y-2">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Important Tips
            </h3>
            <ul className="space-y-1">
              {instructions.tips.map((tip, index) => (
                <li
                  key={index}
                  className="text-yellow-800 dark:text-yellow-200 flex items-start"
                >
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">
                    •
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
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
