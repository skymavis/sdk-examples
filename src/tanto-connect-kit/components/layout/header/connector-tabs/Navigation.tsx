import Typography from '@components/typography/Typography';
import { Tab, Tabs } from '@nextui-org/react';
import { SupportedConnectors } from '@sky-mavis/tanto-connect';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, Key } from 'react';

import { connectorPaths, connectorTabs } from '../../../../common/constant';

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

const ConnectorTabs: FC = () => {
  const router = useRouter();

  const handleChangeSelection = (key: Key) => {
    const url = connectorPaths[key as SupportedConnectors];
    router.push(url);
  };

  const selectedKey = connectorTabs.find(tab => tab.url === router.pathname)?.id;

  // Hide Safe connector tab
  const tabs = connectorTabs.filter(i => i.id !== SupportedConnectors.SAFE);

  return (
    <Tabs
      onSelectionChange={handleChangeSelection}
      className={styles.navigation}
      selectedKey={selectedKey}
      disableAnimation={false}
      items={tabs}
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
