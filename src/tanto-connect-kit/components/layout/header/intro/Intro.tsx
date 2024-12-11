import Typography from '@components/typography/Typography';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import ArrowLeftIcon from '../../../../../icons/ArrowLeftIcon';
import { tantoExamplePrefix } from '../../../../common/constant';
import MobileTabs from '../mobile-tabs/MobileTabs';

import styles from './Intro.module.scss';

const Intro: FC = () => {
  const router = useRouter();
  const isTantoWagmi = router.pathname === `${tantoExamplePrefix}/wagmi`;

  const handleClickNavigate = () => {
    if (isTantoWagmi) {
      router.push(`${tantoExamplePrefix}`);
    } else {
      router.push(`${tantoExamplePrefix}/wagmi`);
    }
  };
  return (
    <div className={styles.intro}>
      <div className={styles.content}>
        <div className={styles.menu}>
          <MobileTabs />
          <Typography size={'large'} bold>
            <span className={styles.title}>TantoKit</span>
          </Typography>
        </div>

        <Typography size={'small'} className={styles.description}>
          TantoKit is a powerful library designed to simplify the management of wallet connections for Ronin DApps,
          providing seamless integration and enhanced user experience.
        </Typography>
      </div>

      <Button
        color="primary"
        size="sm"
        variant={'light'}
        className={styles.wagmiBtn}
        onPress={handleClickNavigate}
        endContent={
          <div className={styles.icon}>
            <ArrowLeftIcon />
          </div>
        }
      >
        {isTantoWagmi ? 'Tanto-connect' : 'Tanto-wagmi'}
      </Button>
    </div>
  );
};

export default Intro;
