import { Button, ButtonProps } from '@nextui-org/react';
import classNames from 'classnames';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';

import styles from './ButtonOption.module.scss';

interface ButtonOptionProps extends ButtonProps {
  icon: string;
  subText?: string;
}

const ButtonOption: FC<ButtonOptionProps> = props => {
  const { name, className, variant, icon, subText, onClick } = props;

  return (
    <div className={className}>
      <Button
        fullWidth
        variant={variant}
        className={classNames(styles.buttonOptionContainer, styles.buttonOption)}
        startContent={<img className={styles.icon} src={icon} width={30} />}
        size="lg"
        onClick={onClick}
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

export default ButtonOption;
