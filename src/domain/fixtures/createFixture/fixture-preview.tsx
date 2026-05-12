import { useState } from "react";
import { ConnectedLight } from "../../../components/connectedLight";
import { FixtureComponent } from "../fixture";
import { ChannelTestValues } from "./channel-test-values";
import { TempFixture } from "./index";
import { FixtureShape } from "../../../context/fixtures";
import { Button } from "../../../ui/buttonLink";
import styles from "./fixture-preview.module.scss";

const TEMP_FIXTURE_ID = "1";

export const FixturePreview = ({
  fixture,
  onShapeChange,
}: {
  fixture: TempFixture;
  onShapeChange: (shape: FixtureShape) => void;
}) => {
  const [dmxChannel, setDmxChannel] = useState(1);
  const [values, setValues] = useState<Record<number, number>>({});

  return (
    <div className={styles.root} data-testid="fixture_preview">
      <div className={styles.shapeRow}>
        <ConnectedLight
          fixture={{ ...fixture, id: TEMP_FIXTURE_ID }}
          venueFixture={{
            channel: dmxChannel,
            fixtureId: TEMP_FIXTURE_ID,
            universe: 0,
            id: "TempFixture",
            x: 0,
            y: 0,
            overwrites: {},
            tags: [],
          }}
        >
          <FixtureComponent fixture={{ ...fixture, id: TEMP_FIXTURE_ID }} />
        </ConnectedLight>

        {Object.values(FixtureShape).filter((shape) => shape !== fixture.fixtureShape).length > 0 && (
          <>
            <div className={styles.shapeDivider} />
            <div className={styles.shapeOptions}>
              {Object.values(FixtureShape)
                .filter((shape) => shape !== fixture.fixtureShape)
                .map((shape) => (
                  <div
                    data-testid="fixture_option"
                    key={shape}
                    onClick={() => onShapeChange(shape)}
                    className={styles.shapeOption}
                  >
                    <span>{shape}</span>
                    <FixtureComponent
                      fixture={{
                        ...fixture,
                        id: TEMP_FIXTURE_ID,
                        fixtureShape: shape,
                      }}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {fixture.deviceFunctions && fixture.deviceFunctions.length > 0 && (
        <div className={styles.functionsRow}>
          {fixture.deviceFunctions.map((df) => (
            <Button
              key={df.id}
              onClick={() => {
                const next: Record<number, number> = {};
                Object.entries(df.values).forEach(([key, value]) => {
                  if (key !== "") next[parseInt(key) - 1] = value;
                });
                setValues(next);
              }}
            >
              {df.label || "Unnamed"}
            </Button>
          ))}
        </div>
      )}

      <ChannelTestValues
        channelCount={fixture.channelFunctions.length}
        onChannelChange={setDmxChannel}
        values={values}
        onValuesChange={setValues}
      />
    </div>
  );
};
