import { Head } from "components/Head";
import { NAVBAR_ENUM, HOME_PAGE } from "constants.json";
import Navbar from "components/Navbar";
import DefaultHeading from "components/DefaultHeading";
import Card from "components/Card";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head title="WireLess" />

      <Navbar
        items={Object.values(NAVBAR_ENUM)}
        selectedMode={NAVBAR_ENUM.HOME}
      />

      <div className="flex-1 bg-white bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] relative">
        <div className="bg-gradient-to-b from-blue-50 to-transparent absolute top-0 left-0 w-full h-full z-0" />

        <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full z-20">
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
    </div>
  );
}
