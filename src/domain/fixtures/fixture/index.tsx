import { Light } from "../../../components/light";
import {
  Fixture as FixtureType,
  SupportedFixtures,
} from "../../../context/fixtures";

export const FixtureComponent = ({ fixture }: { fixture: FixtureType }) => {
  if (fixture.type === SupportedFixtures.smokeMachine)
    return <div>Smoke Machine</div>;

  return <Light fixture={fixture} />;
};
