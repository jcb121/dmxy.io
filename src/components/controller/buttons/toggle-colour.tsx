import { useProfiles } from "../../../context/profiles";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";

import { ToggleColour as ToggleColourEvent } from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { BaseButton } from "./base-button";
import styles from "../controller.module.scss";

export const ToggleColour = ({
  active,
  editMode,
  onEventChange,
  payload,
}: {
  active?: boolean;
  editMode: boolean;
  onEventChange: (s: ToggleColourEvent) => void;
  payload?: ToggleColourEvent;
}) => {
  const profiles = useProfiles(s => s.profiles);
  const profile = profiles.find((p) => p.id === payload?.profileId);
  const toggleColour = useGlobals((state) => state.handlers.toggleColour);

  return (
    <>
      <BaseButton
        active={active}
        onMouseUp={() => {
          if (!payload) return;
          toggleColour(payload, MidiEventTypes.onRelease);
        }}
        onHold={() => {
          if (!payload) return;
          toggleColour(payload, MidiEventTypes.onHoldRelease);
        }}
        style={{
          border: profile
            ? `5px solid rgb(${profile?.state.Red},${profile?.state.Green},${profile?.state.Blue})`
            : undefined,
        }}
      >
        <div className={styles.noWrap}>Toggle {profile?.name}</div>
      </BaseButton>
      {editMode && (
        <div>
          Pick Colour
          <input
            list={"colours"}
            defaultValue={
              profiles.find((p) => p.id === payload?.profileId)?.name || ""
            }
            type="text"
            onChange={(e) => {
              // @ts-expect-error this is a weird
              if (typeof e.nativeEvent.data === "undefined") {
                const profile = profiles.find((p) => p.name === e.target.value);
                profile &&
                  onEventChange({
                    profileId: profile.id,
                    function: MidiCallback.toggleColour,
                  });
              } else {
                // do something with type
              }
            }}
          />
          <datalist id={"colours"}>
            {profiles.map((p, index) => (
              <option key={`${index}-${p.id}`} value={p.name} />
            ))}
          </datalist>
        </div>
      )}
    </>
  );
};
