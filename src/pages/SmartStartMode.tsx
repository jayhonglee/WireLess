import { Head } from "components/Head";
import { NAVBAR_ENUM, SMART_START_MODE_PAGE } from "constants.json";
import Navbar from "components/Navbar";
import Stepper from "components/Stepper";

export function SmartStartMode() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head title="WireLess" />

      <Navbar
        items={Object.values(NAVBAR_ENUM)}
        selectedMode={NAVBAR_ENUM.SMART_START_MODE}
      />

      <div className="flex-1 grid grid-cols-2 gap-4 bg-white">
        <div className="col-span-1 flex justify-center items-center">
          <Stepper steps={SMART_START_MODE_PAGE.STEPS} currentStep={0} />
        </div>
        <div className="col-span-1 flex justify-center items-center">
          {/* Somethign here */}
        </div>
      </div>
    </div>
  );
}
