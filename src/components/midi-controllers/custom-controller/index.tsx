import { useControllers } from "../../../context/controllers";
import { Layout } from "../../controller/layout/layout";
import styles from "./styles.module.scss";

export const CustomController = ({
  controllerId,
  onClick,
}: {
  controllerId: string;
  onClick: (id: string) => void;
}) => {
  const controllers = useControllers((state) => state.controllers);

  const foundLayout = controllers.find((c) => c.id === controllerId);

  if (!foundLayout) return null;

  return (
    <div className={styles.root}>
      <Layout id={foundLayout.name} layout={foundLayout.layout} onClick={onClick} />
    </div>
  );
};
