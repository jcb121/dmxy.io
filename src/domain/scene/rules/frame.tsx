import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { decodeColour, rgbToHex } from "../../../utils/rgb";

export const SceneFrames = ({ scene }: { scene: New_GenericProfile[] }) => {
  const tableKeys = [
    ...scene.reduce((tableKeys, s) => {
      for (const key in s.state) {
        tableKeys.add(key);
      }
      return tableKeys;
    }, new Set<string>()),
  ];

  const isRGB = tableKeys.includes(ChannelSimpleFunction.colour);

  return (
    <table>
      <tbody>
        {isRGB && (
          <tr>
            <th>Color</th>

            {scene.map((s, index) => (
              <td key={index}>
                <input
                  readOnly={true}
                  type="color"
                  value={`#${rgbToHex(decodeColour(s.state[ChannelSimpleFunction.colour] ?? 0))}`}
                />
              </td>
            ))}
          </tr>
        )}
        {tableKeys.map((key) => {
          if (isRGB && key === ChannelSimpleFunction.colour) {
            return null;
          }

          return (
            <tr key={key}>
              <th>{key}</th>
              {scene.map((s, index) => (
                <td key={`${index}-${key}`}>{s.state[key as keyof typeof s.state]}</td>
              ))}
            </tr>
          );
        })}
        <tr>
          <th>Function</th>
          {scene.map((s, index) => (
            <td key={`${s.targetFunction}-${index}`}>{s.targetFunction}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
