import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Spinner } from '@nextui-org/react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { QRCodeSVG } from 'qrcode.react';
import { FC } from 'react';

import styles from './QRCode.module.scss';

interface QRCodeProps {
  uri: string;
}

const QRCode: FC<QRCodeProps> = props => {
  const { uri } = props;

  const hasUri = !isEmpty(uri);

  return (
    <div className={styles.qrCode}>
      <WillRender when={!hasUri}>
        <Spinner size="lg" />
      </WillRender>
      <WillRender when={hasUri}>
        <QRCodeSVG
          className={classNames(styles.qrCodeImage, { [styles.loading]: !hasUri })}
          value={uri}
          size={200}
          fgColor={'#111417'}
          imageSettings={{
            src: 'https://cdn.skymavis.com/explorer-cdn/asset/favicon/apple-touch-icon.png',
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
        <Typography>Scan with your Ronin Wallet Mobile!</Typography>
      </WillRender>
    </div>
  );
};

export default QRCode;
