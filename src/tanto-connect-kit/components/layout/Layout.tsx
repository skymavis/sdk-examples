import React, { FC, ReactNode } from "react";

import styles from "./Layout.module.scss";
import WalletActions from "../wallet-actions/WalletActions";
import ConnectorActions from "../connector-actions/ConnectActions";
import Header from "./header/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>

        <div className={styles.sections}>
          <ConnectorActions />
          <WalletActions />
        </div>
      </div>
    </div>
  );
};

export default Layout;
