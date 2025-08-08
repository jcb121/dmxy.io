import { Colours } from "../../../colours";
import { PlayColour as PlayColourEvent } from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { BaseButton } from "./base-button";
import { useScenes } from "../../../context/scenes";

export const SetColour = ({
  editMode,
  payload,
  onEventChange,
  active,
}: {
  active?: boolean;
  editMode: boolean;
  payload?: PlayColourEvent;
  onEventChange: (s: PlayColourEvent) => void;
}) => {
  const playColour = useGlobals((state) => state.handlers.playColour);

  const scenes = useScenes(s => s.scenes);

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          if (!payload) return;
          playColour(payload, MidiEventTypes.onPress);
        }}
        onHold={() => {
          if (!payload) return;
          playColour(payload, MidiEventTypes.onHoldRelease);
        }}
        onMouseUp={() => {
          if (!payload) return;
          playColour(payload, MidiEventTypes.onRelease);
        }}
        style={{
          border: payload?.colour ? `10px solid ${payload.colour}` : undefined,
        }}
      >
        Set Colour {payload?.colour}
      </BaseButton>
      {editMode && (
        <div>
          Pick Colour
          <input
            list={"colours"}
            defaultValue={payload?.colour || ''}
            type="text"
            onChange={(e) => {
              // @ts-expect-error this is a weird
              if (typeof e.nativeEvent.data === "undefined") {
                onEventChange({
                  ...payload,
                  colour: e.target.value as keyof typeof Colours,
                  function: MidiCallback.playColour,
                });
              }
            }}
          />
          <datalist id={"colours"}>
            {Object.keys(Colours).map((colour) => (
              <option key={colour} value={colour} />
            ))}
          </datalist>

          Pick Scene
          <input
            list={"scenes"}
            defaultValue={scenes.find(s => s.name === payload?.sceneId)?.name}
            type="text"
            onChange={(e) => {


              // @ts-expect-error this is a weird
              if (typeof e.nativeEvent.data === "undefined") {
                onEventChange({
                  ...payload,
                  sceneId: scenes.find(s => s.name === e.target.value)?.id,
                  function: MidiCallback.playColour,
                });
              }
            }}
          />
          <datalist id={"scenes"}>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.name} />
            ))}
          </datalist>

        </div>
      )}
    </>
  );
};
