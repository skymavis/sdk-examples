import { CollectionData, Erc, Erc721Token } from '@sky-mavis/mavis-market-core';
import { isNil } from 'lodash';
import { FC } from 'react';
import WillRender from 'src/components/will-render/WillRender';

import { CancelListingAction, GiftAction, ListingAction } from '../../../common-actions';

import Classes from './OwnerActions.module.scss';

interface OwnerActionsProps {
  tokenData: Erc721Token;
  collectionData: CollectionData;
}

const OwnerActions: FC<OwnerActionsProps> = props => {
  const { tokenData, collectionData } = props;
  const { order, tokenAddress, tokenId } = tokenData;
  const hasOrder = !isNil(order);

  return (
    <div className={Classes.ownerActions}>
      <WillRender when={hasOrder}>
        <CancelListingAction order={order} />
      </WillRender>
      <WillRender when={!hasOrder}>
        <ListingAction tokenType={Erc.Erc721} tokenId={tokenId} collectionData={collectionData} />
      </WillRender>
      <GiftAction tokenAddress={tokenAddress} tokenId={tokenId} tokenType={Erc.Erc721} />
    </div>
  );
};

export default OwnerActions;
