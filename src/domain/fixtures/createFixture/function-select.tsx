import {
  COLOUR_SHORTCUTS,
  ChannelSimpleFunction,
  SubChannelFunction,
} from "../../../context/fixtures";
import { IconButton } from "../../../ui/buttonLink";

export const COLOR_SHORTCUT_OPTIONS = [
  { label: "Red", hex: "ff0000" },
  { label: "Green", hex: "00ff00" },
  { label: "Blue", hex: "0000ff" },
  { label: "White", hex: "ffffff" },
  { label: "Amber", hex: "ffbf00" },
];

const SHORTCUT_HEX_SET = new Set(Object.keys(COLOUR_SHORTCUTS));

const getSelectValue = (value: SubChannelFunction) => {
  if (
    value.function === ChannelSimpleFunction.colour &&
    value.value &&
    SHORTCUT_HEX_SET.has(value.value)
  ) {
    return `colour:${value.value}`;
  }
  return value.function;
};

export const FunctionSelect = ({
  channel,
  onChange,
  onRemove,
  value,
  functionIndex,
  totalFunctions,
}: {
  channel: number;
  value: SubChannelFunction;
  onRemove: () => void;
  onChange: (e: SubChannelFunction) => void;
  functionIndex: number;
  totalFunctions: number;
}) => {
  const selectValue = getSelectValue(value);
  const isShortcut =
    value.function === ChannelSimpleFunction.colour &&
    value.value &&
    SHORTCUT_HEX_SET.has(value.value);

  return (
    <tr data-testid="functionSelect">
      {functionIndex === 0 && <td rowSpan={totalFunctions}>{channel + 1}</td>}
      <td>
        <select
          value={selectValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v.startsWith("colour:")) {
              const hex = v.slice(7);
              onChange({
                ...value,
                function: ChannelSimpleFunction.colour,
                value: hex,
              });
            } else {
              onChange({ ...value, function: v as ChannelSimpleFunction });
            }
          }}
        >
          <optgroup label="Colours">
            {COLOR_SHORTCUT_OPTIONS.map(({ label, hex }) => (
              <option key={hex} value={`colour:${hex}`}>
                {label}
              </option>
            ))}
          </optgroup>
          {Object.keys(ChannelSimpleFunction).map((key) => {
            const val =
              ChannelSimpleFunction[key as keyof typeof ChannelSimpleFunction];
            return (
              <option key={key} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </td>

      <td>
        <input
          value={value.range[0]}
          onChange={(e) => {
            onChange({
              ...value,
              range: [parseInt(e.target.value), value.range[1]],
            });
          }}
          min={0}
          max={255}
          step={1}
          type="number"
        />
      </td>

      <td>
        <input
          value={value.range[1]}
          onChange={(e) => {
            onChange({
              ...value,
              range: [value.range[0], parseInt(e.target.value)],
            });
          }}
          min={0}
          max={255}
          step={1}
          type="number"
        />
      </td>

      <td>
        <input
          type="checkbox"
          data-testid="mapIntensity"
          checked={value.mapIntensity || false}
          onChange={(e) => {
            onChange({
              ...value,
              mapIntensity: e.target.checked,
            });
          }}
        />
        <small>
          If your fixture does not have an intensity channel, use a virtual one
        </small>
      </td>
      <td>
        {!isShortcut &&
          (value.function === ChannelSimpleFunction.fixedColour ||
            value.function === ChannelSimpleFunction.colourWheel ||
            value.function === ChannelSimpleFunction.strobe ||
            value.function === ChannelSimpleFunction.colour) && (
            <input
              type="color"
              title="Channel Color"
              value={`#${value.value || "000000"}`}
              onChange={(e) => {
                onChange({
                  ...value,
                  value: e.target.value.replace("#", ""),
                });
              }}
            />
          )}
      </td>
      <td>
        <IconButton onClick={onRemove}>🗑️</IconButton>
      </td>
    </tr>
  );
};
