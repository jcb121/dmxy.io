import { ColourMode } from "../../../context/fixtures";

export const LightMode = ({
  colour,
  colourMode,
  setColourMode,
  setColour,
}: {
  colour?: string,
  colourMode: ColourMode;
  setColourMode: (m: ColourMode) => void;
  setColour: (c: string) => void;
}) => {
  return (
    <>
      <div>
        <label>
          <input
            type="radio"
            name="ColourMode"
            checked={ColourMode.fixed == colourMode}
            onChange={(e) => {
              e.target.checked && setColourMode(ColourMode.fixed);
            }}
          />
          Fixed
        </label>
        <label>
          <input
            type="radio"
            name="ColourMode"
            checked={ColourMode.rgb == colourMode}
            onChange={(e) => {
              e.target.checked && setColourMode(ColourMode.rgb);
            }}
          />
          RGB
        </label>
        <label>
          <input
            type="radio"
            name="ColourMode"
            checked={ColourMode.rgbw == colourMode}
            onChange={(e) => {
              e.target.checked && setColourMode(ColourMode.rgbw);
            }}
          />
          RGBW
        </label>
        <label>
          <input
            type="radio"
            name="ColourMode"
            checked={ColourMode.single == colourMode}
            onChange={(e) => {
              e.target.checked && setColourMode(ColourMode.single);
            }}
          />
          SINGLE
        </label>
      </div>
      {ColourMode.single == colourMode && (
        <div>
          <label>
            #:
            <input
              minLength={6}
              maxLength={6}
              value={colour}
              onChange={(e) => setColour(e.target.value)}
            />
          </label>
        </div>
      )}
    </>
  );
};
