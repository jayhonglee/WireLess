import { getIcon, type IconTypeType } from "../utils/getIcon";

interface StepperProps {
  steps: Record<string, string>[];
  currentStep: number;
}

export default function Stepper({ steps = [], currentStep = 0 }: StepperProps) {
  return (
    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
      {steps.map((step, index) => {
        return (
          <li
            className={`${index === steps.length - 1 ? "mb-0" : "mb-10"} ms-6`}
          >
            <span
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white ${
                currentStep === index ? "bg-green-200" : "bg-gray-100"
              }`}
            >
              {step.ICON && getIcon(step.ICON as IconTypeType)}
            </span>
            <h3 className="font-medium leading-tight">{step.TITLE}</h3>
            <p className="text-sm">{step.DESCRIPTION}</p>
          </li>
        );
      })}
    </ol>
  );
}
