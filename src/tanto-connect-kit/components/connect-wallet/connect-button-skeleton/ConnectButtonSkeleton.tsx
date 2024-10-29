import React, { FC } from "react";
import { Skeleton } from "@nextui-org/react";

import styles from "./ConnectButtonSkeleton.module.scss";
const ConnectButtonSkeleton: FC = () => {
  return <Skeleton className={styles.connectButtonSkeleton} />;
};

export default ConnectButtonSkeleton;
