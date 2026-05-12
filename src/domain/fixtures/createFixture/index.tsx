import { useEffect, useState } from "react";
import {
  Fixture,
  FixtureShape,
  SupportedFixtures,
} from "../../../context/fixtures";

import styles from "./createFixture.module.scss";
import { ChannelFunctionsList } from "./channel-functions-list";
import { defaultValue } from "./channel";
import { Functions } from "./functions/functions";
import { Button } from "../../../ui/buttonLink";
import { FixturePreview } from "./fixture-preview";

export const DEFAULT_DMX_UNIVERSE = 0;

const BASIC_FIXTURE = (): TempFixture => ({
  type: SupportedFixtures.light,
  model: "",
  channelFunctions: [[defaultValue]],
  fixtureShape: FixtureShape.square,
});

export type TempFixture = Omit<Fixture, "id"> & { id?: string };

export const CreateFixture = ({
  fixture: _fixture,
  onSubmit,
  onClose,
}: {
  fixture?: TempFixture;
  onSubmit: (fixture: TempFixture) => void;
  onClose: () => void;
}) => {
  const [fixture, setFixture] = useState<TempFixture>(
    _fixture || BASIC_FIXTURE(),
  );
  useEffect(() => {
    setFixture(_fixture || BASIC_FIXTURE());
  }, [_fixture]);
  const original = !fixture.id;

  return (
    <div className={styles.root} data-testid="create_fixture">
      <div className={styles.left}>
        <div className={styles.header}>
          <input
            placeholder="Fixture name"
            className={styles.name}
            id="fixture_name"
            name="fixture_name"
            value={fixture.model}
            onChange={(e) =>
              setFixture((state) => ({
                ...state,
                model: e.target.value,
              }))
            }
          />
          <div className={styles.buttons}>
            {original ? (
              <Button primary onClick={() => onSubmit(fixture)}>
                Save As
              </Button>
            ) : (
              <>
                <Button onClick={() => onClose()}>Close</Button>
                <Button primary onClick={() => onSubmit(fixture)}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
        <ChannelFunctionsList
          channelFunctions={fixture.channelFunctions}
          onChange={(channelFunctions) =>
            setFixture((state) => ({ ...state, channelFunctions }))
          }
        />

        <Functions
          channels={fixture.channelFunctions}
          functions={fixture.deviceFunctions}
          setFunctions={(action) => {
            if (typeof action === "function") {
              setFixture((state) => ({
                ...state,
                deviceFunctions: action(state.deviceFunctions),
              }));
            } else {
              setFixture((state) => ({
                ...state,
                deviceFunctions: action,
              }));
            }
          }}
        />
      </div>

      <FixturePreview
        fixture={fixture}
        onShapeChange={(shape) =>
          setFixture((state) => ({ ...state, fixtureShape: shape }))
        }
      />
    </div>
  );
};
