import React, { FC } from "react";

import Classes from "./Header.module.scss";
import Intro from "./intro/Intro";
import ConnectorTabs from "./connector-tabs/Navigation";

const Header: FC = () => {
  return (
    <div className={Classes.header}>
      <div className={Classes.content}>
        <Intro />
        <ConnectorTabs />
      </div>
    </div>
  );
};

export default Header;
