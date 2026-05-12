import { ButtonRow } from "../../../components/buttons/button-row";
import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { Button } from "../../../ui/buttonLink";
import {
  decodeColour,
  encodeColour,
  getRGB,
  rgbToHex,
} from "../../../utils/rgb";

export const Frame = ({
  frame,
  options,
  colourOptions,
  setFrame,
  functions,
  index,
  onDelete,
}: {
  frame: New_GenericProfile;
  options: ChannelSimpleFunction[];
  colourOptions: string[];
  functions: string[];
  setFrame: React.Dispatch<React.SetStateAction<New_GenericProfile>>;
  index: number;
  onDelete: () => void;
}) => {
  const isRGB = ["ff0000", "00ff00", "0000ff"].every((hex) =>
    colourOptions.includes(hex),
  );

  const visibleOptions =
    options?.filter((fn) => !(isRGB && fn === ChannelSimpleFunction.colour)) ??
    [];
  const rowSpan = (isRGB ? 1 : 0) + visibleOptions.length;

  const labelCell = (
    <td rowSpan={rowSpan}>
      <span>Frame {index + 1}</span>
      <Button onClick={onDelete}>Delete Frame</Button>
    </td>
  );

  const functionsCell = (
    <td rowSpan={rowSpan}>
      <ButtonRow
        items={functions.map((functionName) => ({
          label: functionName,
          functionName,
          active: frame.targetFunction === functionName,
        }))}
        onClick={({ functionName }) => {
          setFrame((frame) => ({
            ...frame,
            targetFunction:
              frame.targetFunction === functionName ? undefined : functionName,
          }));
        }}
      />
      <ButtonRow
        items={colourOptions.map((colour) => ({
          buttonProps: {
            style: {
              background: `#${colour}`,
            },
          },
          colour,
          label: `#${colour}`,
        }))}
        onClick={({ colour }) => {
          setFrame((frame) => {
            const [r, g, b] = getRGB(colour);
            return {
              ...frame,
              state: {
                ...frame.state,
                [ChannelSimpleFunction.colour]: encodeColour(r, g, b),
              },
            };
          });
        }}
      />
    </td>
  );

  return (
    <tbody data-testid="frame">
      {isRGB && (
        <tr>
          {labelCell}
          <td>Color</td>
          <td>
            <input
              type="color"
              value={`#${rgbToHex(decodeColour(frame.state[ChannelSimpleFunction.colour] ?? 0))}`}
              onChange={(e) => {
                const [r, g, b] = getRGB(e.target.value.slice(1));
                setFrame((frame) => ({
                  ...frame,
                  state: {
                    ...frame.state,
                    [ChannelSimpleFunction.colour]: encodeColour(r, g, b),
                  },
                }));
              }}
            />
          </td>
          {functionsCell}
        </tr>
      )}

      {visibleOptions.map((functionName, i) => {
        return (
          <tr key={functionName}>
            {!isRGB && i === 0 && labelCell}
            <td>{functionName}</td>
            <td>
              <div>
                <input
                  min={0}
                  max={255}
                  type="range"
                  value={frame.state[functionName] || 0}
                  onChange={(e) =>
                    setFrame((frame) => {
                      return {
                        ...frame,
                        state: {
                          ...frame.state,
                          [functionName]: parseInt(e.target.value),
                        },
                      };
                    })
                  }
                />
              </div>
            </td>
            {!isRGB && i === 0 && functionsCell}
          </tr>
        );
      })}
    </tbody>
  );
};
