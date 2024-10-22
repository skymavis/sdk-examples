import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import Link from 'next/link';
import { FC } from 'react';

import Classes from './ExampleCard.module.scss';

interface ExampleData {
  id: string;
  path: string;
  title: string;
  description: string;
}

interface ExampleCardProps {
  data: ExampleData;
}

const ExampleCard: FC<ExampleCardProps> = props => {
  const { data } = props;
  const { title, description, path } = data;

  return (
    <div className={Classes.exampleCard}>
      <Link href={path} className={Classes.exampleContent}>
        <Typography size="large" bold>
          {title}
        </Typography>
        <Typography size="small" color="gray">
          {description}
        </Typography>
        <Button fullWidth color="primary" onClick={() => {}}>
          View Example
        </Button>
      </Link>
    </div>
  );
};

export default ExampleCard;
