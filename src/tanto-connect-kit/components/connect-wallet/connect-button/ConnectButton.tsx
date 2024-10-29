import React, { FC } from "react";
import Typography from "@components/typography/Typography";

import styles from "./ConnectButton.module.scss";
import { Button } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";
import WillRender from "@components/will-render/WillRender";

interface IPropsType {
  text: string;
  icon?: string;
  onClick?: () => void;
  isRecent?: boolean;
  isLoading?: boolean;
}

const ConnectButton: FC<IPropsType> = (props) => {
  const { text, icon, isRecent, isLoading, onClick } = props;

  return (
    <div className={styles.connectWallet}>
      <Button
        size={"lg"}
        variant={"light"}
        onClick={onClick}
        isLoading={isLoading}
        className={styles.connectBtn}
        startContent={
          icon && <img src={icon} className={styles.icon} alt={text} />
        }
        fullWidth
      >
        <Typography bold>{text}</Typography>
        <WillRender when={!!isRecent}>
          <Chip color="success" variant="dot" className={styles.chip}>
            Recent
          </Chip>
        </WillRender>
      </Button>
    </div>
  );
};

export default ConnectButton;
