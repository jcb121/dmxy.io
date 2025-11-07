import {
  SubChannelFunction,
  ChannelSimpleFunction,
} from "../../../context/fixtures";
import { IconButton } from "../../../ui/buttonLink";

export const FunctionSelect = ({
  onChange,
  onRemove,
  value,
}: {
  value: SubChannelFunction;
  onRemove: () => void;
  onChange: (e: SubChannelFunction) => void;
}) => {
  return (
    <tr>
      <td>
        <IconButton onClick={onRemove}>🗑️</IconButton>
      </td>
      <td>
        <select
          value={value.function}
          onChange={(e) => {
            onChange({
              ...value,
              function: e.target.value as ChannelSimpleFunction,
            });
          }}
        >
          {Object.keys(ChannelSimpleFunction).map((key) => {
            return (
              <option key={key}>
                {
                  ChannelSimpleFunction[
                    key as keyof typeof ChannelSimpleFunction
                  ]
                }
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
          checked={value.mapIntensity || false}
          onChange={(e) => {
            onChange({
              ...value,
              mapIntensity: e.target.checked,
            });
          }}
        />
      </td>
      <td>
        {(value.function === ChannelSimpleFunction.fixedColour ||
          value.function === ChannelSimpleFunction.colourWheel ||
          value.function === ChannelSimpleFunction.strobe ||
          value.function === ChannelSimpleFunction.colour) && (
          <span>
            <span
              style={{
                background: `#${value.value}`,
              }}
            >
              #
            </span>
            <input
              placeholder="HTML color Code"
              // type="number"
              prefix="#"
              value={value.value}
              onChange={(e) => {
                onChange({
                  ...value,
                  value: e.target.value.replace("#", ""),
                });
              }}
            />
          </span>
        )}
      </td>
    </tr>
  );
};
