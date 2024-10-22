import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import ButtonOption from '../button-option/ButtonOption';

const RoninWaypoint: FC = () => {
  const { connectWaypoint } = useConnectWallet();

  const onClickWaypointButton = () => {
    connectWaypoint();
  };

  return (
    <ButtonOption
      icon={DEFAULT_CONNECTORS_CONFIG.WAYPOINT.icon as string}
      name="Ronin Waypoint"
      subText="Connect the wallet with your email"
      variant="bordered"
      onClick={onClickWaypointButton}
    />
  );
};

export default RoninWaypoint;
