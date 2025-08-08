import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { ListWithAction } from "../ui/list-with-actions";

const Controllers = () => {
  return (
    <BasicPage
      left={
        <>
          <ListWithAction
            items={[
              {
                name: "controler a",
              },
            ]}
            actions={[
              {
                name: "edit",
                onClick: (c) => {
                  console.log(c);
                },
              },
            ]}
          />
        </>
      }
    ></BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Controllers />);
