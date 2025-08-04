import { Head } from "components/Head";
import { NAVBAR_ENUM, SMART_START_MODE_PAGE } from "constants.json";
import Navbar from "components/Navbar";
import Stepper from "components/Stepper";
import SmartStartModeComponent from "components/temp/SmartStartMode";
import getStepContent from "components/SmartStartModeSteps/getStepContent";

export function SmartStartMode() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head title="WireLess" />

      <Navbar
        items={Object.values(NAVBAR_ENUM)}
        selectedMode={NAVBAR_ENUM.SMART_START_MODE}
      />

      {/* <div className="flex-1 grid grid-cols-20 gap-15 bg-white">
        <div className="col-span-7 flex flex-col justify-start items-end pt-20">
          <div className="flex flex-col justify-center items-start">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Smart Start Mode
              </h1>
              <p className="text-gray-600">
                Follow the steps below to create your circuit
              </p>
            </div>

            <div className="block max-w-lg p-10 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Stepper steps={SMART_START_MODE_PAGE.STEPS} currentStep={0} />
            </div>
          </div>
        </div>

        <div className="col-span-13 flex flex-col justify-start items-start pt-20">
          <div className="flex flex-col justify-center items-start">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Select Power Source
              </h1>
              <p className="text-gray-600">
                Choose the power source that best fits your circuit requirements
              </p>
            </div>

            <div className="block max-w-lg p-10 bg-white border border-gray-200 rounded-lg shadow-sm">
              {getStepContent(0)()}
            </div>
          </div>
        </div>
      </div> */}

      <SmartStartModeComponent />
    </div>
  );
}
