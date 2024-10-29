import { Button, ButtonProps } from '@nextui-org/react';
import classNames from 'classnames';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';

import styles from './CustomButton.module.scss';

interface CustomButtonProps extends ButtonProps {
  icon: string;
  subText?: string;
}

const CustomButton: FC<CustomButtonProps> = props => {
  const { name, className, variant, icon, subText, onPress } = props;

  return (
    <div className={className}>
      <Button
        fullWidth
        variant={variant}
        className={classNames(styles.customButtonContainer, styles.customButton)}
        startContent={<img className={styles.icon} src={icon} width={30} />}
        size="lg"
        onPress={onPress}
      >
        <div className={styles.textContainer}>
          <Typography bold>{name}</Typography>
          <Typography size="xSmall" color="gray">
            {subText}
          </Typography>
        </div>
      </Button>
    </div>
  );
};

export default CustomButton;
