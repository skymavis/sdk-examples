import Typography from '@components/typography/Typography';
import { TraitDistribution } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';

import Classes from './AttributeItem.module.scss';

interface AttributeItemProps {
  attribute: TraitDistribution;
}

const AttributeItem: FC<AttributeItemProps> = props => {
  const { attribute } = props;
  const { key, value } = attribute;
  return (
    <div className={Classes.attributeItem}>
      <Typography color="gray" size="xSmall">
        {key}:
      </Typography>
      <Typography size="xSmall">{value}</Typography>
    </div>
  );
};

export default AttributeItem;
