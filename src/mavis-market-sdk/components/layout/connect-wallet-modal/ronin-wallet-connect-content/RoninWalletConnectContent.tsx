import Typography from '@components/typography/Typography';
import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import Link from 'next/link';
import { FC } from 'react';
import { toDeepLink } from 'src/mavis-market-sdk/utils/toDeepLink';

import styles from './RoninWalletConnectContent.module.scss';

interface RoninWalletConnectContentProps {
  uri: string;
}

const RoninWalletConnectContent: FC<RoninWalletConnectContentProps> = props => {
  const { uri } = props;

  return (
    <div className={styles.roninMobileIconContainer}>
      <img className={styles.roninMobileIcon} src={DEFAULT_CONNECTORS_CONFIG.RONIN_WC.icon} />
      <Typography size="medium">Opening Ronin Mobile</Typography>
      <Typography color="gray">Confirm connection in Ronin Mobile</Typography>
      <Link href={toDeepLink(uri)} className={styles.openAppButton}>
        Open App
      </Link>
    </div>
  );
};

export default RoninWalletConnectContent;
