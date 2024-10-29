import Typography from '@components/typography/Typography';
import { FC } from 'react';

import Classes from './EmptyState.module.scss';

interface EmptyStateProps {
  text: string;
}

const EmptyState: FC<EmptyStateProps> = props => {
  const { text } = props;

  return (
    <div className={Classes.emptyState}>
      <img src="/static/images/not-found.png" className={Classes.image} />
      <Typography size="small" className={Classes.text}>
        {text}
      </Typography>
    </div>
  );
};

export default EmptyState;
