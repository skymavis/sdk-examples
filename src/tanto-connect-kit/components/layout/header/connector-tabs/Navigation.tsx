import Typography from '@components/typography/Typography';
import { Tab, Tabs } from '@nextui-org/react';
import { SupportedConnectors } from '@sky-mavis/tanto-connect';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, Key } from 'react';

import { connectorPaths, connectorTabs, tantoExamplePrefix } from '../../../../common/constant';

import styles from './Navigation.module.scss';

interface ITabTitleProps {
  icon: string | undefined;
  name: string;
}

const TabTitle: FC<ITabTitleProps> = ({ icon, name }) => (
  <div className={styles.tabTitle}>
    {icon && <img src={icon} alt={name} className="w-6 h-6 rounded-md" />}
    <Typography>{name}</Typography>
  </div>
);

interface IPropsType {
  isVertical?: boolean;
  className?: string;
}

const ConnectorTabs: FC<IPropsType> = ({ isVertical, className }) => {
  const router = useRouter();

  const handleChangeSelection = (key: Key) => {
    const isRootPage = tantoExamplePrefix === router.pathname;
    if (key === SupportedConnectors.RONIN_WALLET && isRootPage) {
      return;
    }
    const url = connectorPaths[key as SupportedConnectors];
    if (url !== router.pathname) {
      router.push(url);
    }
  };

  const selectedKey = connectorTabs.find(tab => tab.url === router.pathname)?.id;

  // Hide Safe connector
  const tabs = connectorTabs.filter(i => i.id !== SupportedConnectors.SAFE);

  return (
    <Tabs
      onSelectionChange={handleChangeSelection}
      className={classNames(styles.navigation, className)}
      selectedKey={selectedKey}
      isVertical={isVertical}
      items={tabs}
      disableAnimation={false}
      fullWidth={true}
    >
      {item => (
        <Tab
          className={classNames(styles.tab, {
            [styles.activeTab]: item.id === selectedKey,
          })}
          key={item.id}
          title={<TabTitle icon={item.icon} name={item.name} />}
          disabled={item.id === SupportedConnectors.SAFE}
        />
      )}
    </Tabs>
  );
};

export default ConnectorTabs;
