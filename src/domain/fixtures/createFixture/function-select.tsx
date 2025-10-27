import {
  SubChannelFunction,
  ChannelSimpleFunction,
} from "../../../context/fixtures";

export const FunctionSelect = ({
  onChange,
  value,
}: {
  value: SubChannelFunction;
  onChange: (e: SubChannelFunction) => void;
}) => {
  return (
    <div>
      <label>
        Function:
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
      </label>
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
      <label>
        From:
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
      </label>
      <label>
        To:
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
      </label>
    </div>
  );
};
