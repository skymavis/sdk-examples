import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import Classes from './Typography.module.scss';

interface TypographyProps {
  children: string | ReactNode;
  color?: 'gray' | 'warning' | 'danger';
  size?: 'xSmall' | 'small' | 'medium' | 'large';
  bold?: boolean;
  className?: string;
}

const Typography: FC<TypographyProps> = props => {
  const { color, size = 'small', children, bold = false, className } = props;

  return (
    <div
      className={classNames(
        Classes.typography,
        Classes[`size-${size}`],
        Classes[`color-${color}`],
        { [Classes.bold]: bold },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Typography;
