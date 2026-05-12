import { Controller } from "../../../components/controller/controller";
import { useActiveControllers } from "../../../context/controllers";
import { useActiveVenue } from "../../../context/venues";

export const Controllers = () => {
  const venue = useActiveVenue((state) => state.venue);

  const activeControlers =
    useActiveControllers((state) => venue?.id && state[venue?.id]) || [];

  return (
    <>
      {activeControlers?.map((controller, index) => (
        <Controller
          key={index}
          onClick={(e) => {
            if (e.shiftKey) {
              useActiveControllers.setState((state) => {
                if (!venue?.id) return state;
                state[venue.id].splice(index, 1);
                return {
                  ...state,
                  [venue.id]: [...state[venue.id]],
                };
              });
            }
          }}
          controller={controller}
        />
      ))}
    </>
  );
};
