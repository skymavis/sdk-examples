import { Button as NextUIButton, ButtonProps as NextUIButtonProps, forwardRef } from '@nextui-org/react';
import classNames from 'classnames';

import Classes from './Button.module.scss';

const ButtonForwardRefComponent = (props: NextUIButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { className, color = 'default', ...otherProps } = props;
  return (
    <NextUIButton
      {...otherProps}
      ref={ref}
      color={color}
      className={classNames(className, Classes.button, Classes[color])}
    />
  );
};

const Button = forwardRef(ButtonForwardRefComponent);

export default Button;
