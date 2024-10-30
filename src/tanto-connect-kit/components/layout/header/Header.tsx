import React, { FC } from 'react';

import ConnectorTabs from './connector-tabs/Navigation';
import Intro from './intro/Intro';

import Classes from './Header.module.scss';

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
