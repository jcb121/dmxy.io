import { useActiveControllers, useControllers } from "../../../context/controllers";
import { useActiveVenue } from "../../../context/venues";

export const SelectController = () => {
  const controllers = useControllers((state) => state.controllers);
  const venue = useActiveVenue((state) => state.venue);

  return (
    <select
            data-testid="add_controller"
            value={""}
            onChange={(e) => {
              useActiveControllers.setState((state) => {
                if (!venue?.id || !e) return state;
                return {
                  ...state,
                  [venue.id]: [...(state[venue.id] || []), e.target.value],
                };
              });
            }}
          >
            <option value={""}>Add Controller</option>
            {controllers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
  );
}