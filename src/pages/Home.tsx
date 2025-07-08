import { Head } from "components/Head";
import { NAVBAR_ENUM, HOME_PAGE } from "constants.json";
import Navbar from "components/Navbar";
import DefaultHeading from "components/DefaultHeading";
import Card from "components/Card";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head title="WireLess" />

      <Navbar
        items={Object.values(NAVBAR_ENUM)}
        selectedMode={NAVBAR_ENUM.HOME}
      />

      <div className="flex flex-col items-center justify-center flex-1">
        <DefaultHeading
          title={HOME_PAGE.TITLE}
          description={HOME_PAGE.DESCRIPTION}
        />

        <div className="h-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
          {HOME_PAGE.CARDS.map((card) => (
            <Card
              key={card.TITLE}
              emoji={card.EMOJI}
              title={card.TITLE}
              description={card.DESCRIPTION}
              buttonText={card.BUTTON_TEXT}
              disabled={card.DISABLED}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
