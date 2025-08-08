import { useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { animateColour, rgbToHex } from "../../../utils";
import styles from "../controller.module.scss";
import { useScenes } from "../../../context/scenes";
import { SetColour as SetColourEvent } from "../../../context/events";

export const SetColour = ({
  buttonId,
  editMode,
  payload,
  onEventChange,
}: {
  buttonId: string;
  editMode: boolean;
  payload: SetColourEvent;
  onEventChange: (s: SetColourEvent) => void;
}) => {
  const globalState = useGlobals((state) => state.values);
  const scenes = useScenes((s) => s.scenes);

  const colour = rgbToHex([
    (globalState["globalRed"]?.value as number) || 0,
    (globalState["globalGreen"]?.value as number) || 0,
    (globalState["globalBlue"]?.value as number) || 0,
  ]);

  const value = globalState[buttonId]?.value || 0;

  // const options = Object.keys(globalState).filter((key) => {
  //   if (globalState[key].type === GlobalTypes.colour) {
  //     return key;
  //   }
  // });
  // const [value, setValue] = useState(0);
  // const key = "GLOBAL_COLOURS";

  const setGlobalColour = useGlobals((state) => state.handlers.setColour);

  return (
    <>
      {/* <div>Set Colour</div> */}
      {/* <select onChange={(e) => setKey(e.target.value)}>
        <option value="">None</option>
        {options.map((_key) => (
          <option key={_key}>{_key}</option>
        ))}
      </select> */}
      <div
        className={styles.mainKnob}
        style={{
          borderColor: `#${colour}`,
        }}
      >
        <div className={styles.content}>
          <div className={styles.label}>Global Colour</div>
          <input
            className={styles.input}
            type="range"
            value={value}
            max={255}
            onChange={(e) => {
              // console.log('Setting', buttonId, parseInt(e.target.value))

              const third = 255 / 2;
              const state = parseInt(e.target.value) / third;
              const frame = Math.floor(state);

              let colour = "0000ff";
              if (frame === 0) {
                colour = animateColour("ff0000", "00ff00", 1, state - frame);
              } else if (frame === 1) {
                colour = animateColour("00ff00", "0000ff", 1, state - frame);
              }

              setGlobalColour(
                {
                  function: MidiCallback.setColour,
                  colour,
                },
                MidiEventTypes.onTurn
              );
            }}
          />
        </div>
      </div>
      {editMode && (
        <>
          Pick Scene
          <input
            list={"scenes"}
            defaultValue={scenes.find((s) => s.name === payload?.sceneId)?.name}
            type="text"
            onChange={(e) => {
              // @ts-expect-error this is a weird
              if (typeof e.nativeEvent.data === "undefined") {
                onEventChange({
                  ...payload,
                  sceneId: scenes.find((s) => s.name === e.target.value)?.id,
                  function: MidiCallback.setColour,
                });
              }
            }}
          />
          <datalist id={"scenes"}>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.name} />
            ))}
          </datalist>
        </>
      )}
    </>
  );
};
