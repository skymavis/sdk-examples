import React, { FC } from "react";
import Typography from "@components/typography/Typography";
import styles from "./WaitingWallet.module.scss";
import { Button, Spinner } from "@nextui-org/react";
import WillRender from "@components/will-render/WillRender";
import { isNil } from "lodash";
import XIcon from "../../../../icons/XIcon";

interface IPropsType {
  name?: string;
  icon?: string;
  text?: string;
  description?: string;
  onCancel?: () => void;
}

const WaitingWallet: FC<IPropsType> = (props) => {
  const { icon, name, text, description, onCancel } = props;
  return (
    <div className={styles.waitingWallet}>
      <WillRender when={!isNil(onCancel)}>
        <Button
          isIconOnly
          variant={"light"}
          className={styles.closeBtn}
          onClick={onCancel}
        >
          <XIcon />
        </Button>
      </WillRender>

      <WillRender when={!isNil(icon)}>
        <img src={icon} className={styles.icon} alt={name} />
      </WillRender>
      <Spinner color="default" className={styles.spinner} />

      <WillRender when={!isNil(name)}>
        <Typography size={"small"}>{text || `Opening ${name}...`}</Typography>
      </WillRender>
      <Typography size={"small"} color={"gray"}>
        {description || "Confirm connection in the wallet"}
      </Typography>
    </div>
  );
};

export default WaitingWallet;
