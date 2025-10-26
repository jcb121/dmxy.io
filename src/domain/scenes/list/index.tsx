import { Scene } from "../../../context/scenes";
import { ListWithAction } from "../../../ui/list-with-actions";

export const ScenesList = ({
  scenes,
  setScene,
}: {
  setScene: (s: Scene) => void;
  scenes: Scene[];
}) => {
  return (
    <ListWithAction
      items={scenes}
      actions={[
        {
          name: "edit",
          onClick: (scene) => {
            const url = new URL(window.location.href);
            url.searchParams.set("scene_id", scene.id);
            window.history.pushState(null, "", url);
            setScene(JSON.parse(JSON.stringify(scene)));
          },
        },
        {
          name: "delete",
          // onClick: (scene) => {
          //   deleteScene(scene);
          // },
        },
      ]}
    />
  );
};
