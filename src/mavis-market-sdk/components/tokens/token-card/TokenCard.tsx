import { useRouter } from 'next/router';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';
import Price from 'src/mavis-market-sdk/components/price/Price';

import Classes from './TokenCard.module.scss';

interface TokenCardProps {
  imageUrl: string;
  tokenAddress: string;
  tokenId: string;
  name: string;
  listingPrice?: string | null;
  paymentToken?: string;
}

const TokenCard: FC<TokenCardProps> = props => {
  const { tokenAddress, tokenId, name, listingPrice, paymentToken, imageUrl } = props;

  const router = useRouter();

  const onClickCard = () => {
    router.push(`/mavis-market-sdk/tokens/${tokenAddress}/${tokenId}`);
  };

  return (
    <div className={Classes.tokenCard} onClick={onClickCard}>
      <div className={Classes.imageWrapper}>
        <div className={Classes.image}>
          <img src={imageUrl} />
        </div>
      </div>
      <div className={Classes.footer}>
        <Typography className={Classes.tokenName}>{name}</Typography>
        <Price tokenAddress={paymentToken} amount={listingPrice as string} />
      </div>
    </div>
  );
};

export default TokenCard;
