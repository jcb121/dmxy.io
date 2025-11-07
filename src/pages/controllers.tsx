import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { ListWithAction } from "../ui/list-with-actions";
import { useState } from "react";
import { useControllers } from "../context/controllers";
import { Layout } from "../components/controller/layout/layout";
import styles from "./controller.module.scss";
import { Button } from "../ui/buttonLink";

const Controllers = () => {
  const controllers = useControllers((state) => state.controllers);

  const [layout, setLayout] = useState<Layout>({
    type: "row",
    children: [],
    flex: undefined,
  });

  const [controllerName, setControllerName] = useState("");

  return (
    <BasicPage
      header={<h2>Controllers</h2>}
      left={
        <ListWithAction
          items={controllers.map((d) => ({
            name: d.name,
            id: d.id,
          }))}
          actions={[]}
        />
      }
    >
      <div className={styles.head}>
        <input
          className={styles.name}
          placeholder="Controller Name"
          value={controllerName}
          onChange={(e) => {
            setControllerName(e.target.value);
          }}
        />
        <Button
          primary
          disabled={!controllerName}
          onClick={() => {
            useControllers.setState((state) => {
              return {
                ...state,
                controllers: [
                  ...state.controllers,
                  { name: controllerName, layout, id: crypto.randomUUID() },
                ],
              };
            });
          }}
        >
          Save As
        </Button>
      </div>

      <Layout
        id=""
        layout={layout}
        onClick={() => {
          // does nothing
        }}
        editMode={true}
        onLayoutChange={(layout) => {
          setLayout(layout);
        }}
      />
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Controllers />);
