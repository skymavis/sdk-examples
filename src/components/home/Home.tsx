import { FC } from 'react';
import { examplesData } from 'src/common/examplesData';
import { useCheckClient } from 'src/mavis-market-sdk/hooks/useCheckClient';

import ExampleCard from './example-card/ExampleCard';

import Classes from './Home.module.scss';

const Home: FC = () => {
  const { isClient } = useCheckClient();

  if (!isClient) {
    return null;
  }

  return (
    <div className={Classes.home}>
      <div className={Classes.header}>
        <div className={Classes.logo}>
          <img src="https://cdn.skymavis.com/skymavis-home/public/homepage/core-value.png" width={50} />
          SDK Examples
        </div>
      </div>
      <div className={Classes.example}>
        {examplesData.map(example => (
          <ExampleCard key={example.id} data={example} />
        ))}
      </div>
    </div>
  );
};

export default Home;
