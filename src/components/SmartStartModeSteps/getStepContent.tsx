import PowerSourceStep from "./steps/PowerSoruceStep";

export default function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <PowerSourceStep />;
    case 1:
      return <div>Step 2</div>;
  }
}
