import Button from '@components/button/Button';
import EmptyState from '@components/empty-state/EmptyState';
import WillRender from '@components/will-render/WillRender';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import {
  ApproveTokenType,
  BulkBuyOrderData,
  bulkBuyToken,
  Erc,
  Erc721Token,
  getActiveOrdersOfTokens,
  getOrdersTotalPrice,
  getPaymentToken,
  getTokensNeedToApproveByOrders,
  Order,
  paymentTokens,
  TokenData,
  WalletClient,
} from '@sky-mavis/mavis-market-core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import ApproveAction from 'src/mavis-market-sdk/components/tokens/token-detail/common-actions/approve-action/ApproveAction';
import SelectPaymentTokens from 'src/mavis-market-sdk/components/tokens/token-detail/common-actions/buy-action/select-payment-tokens/SelectPaymentTokens';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';
import { generateDeadline } from 'src/mavis-market-sdk/utils/generateDeadline';
import { countCartItems, getCartKey, getTokenIds } from 'src/mavis-market-sdk/utils/getCartDataUtils';
import { roundingNumber } from 'src/mavis-market-sdk/utils/roundingNumberUtil';

import CartItem from './cart-item/CartItem';

import Classes from './Cart.module.scss';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onBuySuccessfully: (additionalText?: string) => void;
}

const Cart: FC<CartProps> = props => {
  const { isOpen, onClose, onBuySuccessfully } = props;

  const { chainId, connectedAccount, wallet } = useGetWalletConnectData();
  const { cartItems, clearCart } = useCartStore();

  const defaultPaymentToken = paymentTokens[chainId]?.RON.address;

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [latestOrders, setLatestOrders] = useState<Record<string, Order>>({});
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(defaultPaymentToken);
  const [swappedAmount, setSwappedAmount] = useState('');
  const [tokensNeedToApprove, setTokensNeedToApprove] = useState<TokenData[]>([]);

  const selectedToken = getPaymentToken(chainId, selectedTokenAddress);

  const onGetTokensNeedToApprove = async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      const tokens = await getTokensNeedToApproveByOrders(
        chainId,
        wallet as WalletClient,
        selectedOrders,
        selectedTokenAddress,
      );
      setTokensNeedToApprove(tokens);
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const onApproveFailed = (errorMessage: string) => {
    setErrorMessage(errorMessage);
  };

  const onApproveSuccessfully = () => {
    const newTokensNeedToApprove = [...tokensNeedToApprove];
    newTokensNeedToApprove.shift();
    setTokensNeedToApprove([...newTokensNeedToApprove]);
  };

  const onSelectPaymentToken = (tokenAddress: string) => {
    if (!isLoading) {
      setSelectedTokenAddress(tokenAddress);
    }
  };

  const availableCartItems = useMemo(() => {
    const newAvailableCartItems = [] as Erc721Token[];

    Object.keys(cartItems).forEach((cartItemKey: string) => {
      const isValidOrder =
        !isEmpty(latestOrders?.[cartItemKey]) &&
        latestOrders?.[cartItemKey].hash === cartItems[cartItemKey].order?.hash;
      if (isValidOrder) {
        newAvailableCartItems.push(cartItems[cartItemKey]);
      }
    });
    return newAvailableCartItems;
  }, [cartItems, latestOrders]);

  const isCartEmpty = isEmpty(cartItems);
  const countAvailableCartItems = availableCartItems.length;
  const isEmptyAvailableCartItems = isEmpty(availableCartItems);
  const cartCount = countCartItems(cartItems);
  const cartCountText = `${countAvailableCartItems}/${cartCount} token(s)`;
  const buySomeItemsText = `Continue with ${cartCountText}`;

  const selectedOrders = useMemo(() => {
    return availableCartItems.map(token => ({
      order: token.order,
      quantity: 1,
    })) as BulkBuyOrderData[];
  }, [availableCartItems]);

  const formattedPrice = swappedAmount
    ? roundingNumber(formatUnits(BigNumber.from(swappedAmount), selectedToken?.decimals), 4)
    : '0';

  const onBuy = async () => {
    try {
      setIsBuying(true);
      setErrorMessage('');

      const deadline = generateDeadline();

      await bulkBuyToken({
        chainId,
        wallet: wallet as WalletClient,
        data: selectedOrders,
        selectedTokenAddress,
        deadline,
        tokenType: Erc.Erc721,
        requiredAllSuccess: false,
      });

      onClose();
      onBuySuccessfully(cartCountText);
      clearCart();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || err);
    } finally {
      setIsBuying(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  const fetchActiveOrders = async () => {
    try {
      setIsLoading(true);
      const activeOrdersOfTokens = await getActiveOrdersOfTokens({ chainId, tokenIds: getTokenIds(cartItems) });
      const latestOrders = activeOrdersOfTokens.reduce((data: Record<string, Order>, cartItem: Order) => {
        const { id, address } = cartItem.assets[0];
        data[getCartKey(id, address)] = cartItem;
        return data;
      }, {});
      setLatestOrders(latestOrders);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const onGetOrdersTotalPrice = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const ordersTotalPrice = await getOrdersTotalPrice({
        data: selectedOrders,
        token: selectedToken,
        chainId,
        wallet: (wallet || {}) as WalletClient,
      });

      const { totalPrice } = ordersTotalPrice;
      setSwappedAmount(totalPrice);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !isCartEmpty) {
      setErrorMessage('');
      fetchActiveOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    onGetOrdersTotalPrice();
  }, [selectedOrders, selectedToken]);

  useEffect(() => {
    if (!isEmpty(latestOrders)) {
      onGetTokensNeedToApprove();
    }
  }, [connectedAccount, selectedTokenAddress, latestOrders]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className={Classes.header}>
                <Typography>My cart ({cartCount})</Typography>
                <WillRender when={!isCartEmpty}>
                  <Button onPress={handleClearCart}>Clear all</Button>
                </WillRender>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className={Classes.listingDetail}>
                <WillRender when={isCartEmpty}>
                  <EmptyState text="You haven't added anything to cart yet." />
                </WillRender>
                <WillRender when={!isCartEmpty}>
                  <div className={Classes.tokenList}>
                    {Object.values(cartItems).map((item, index) => (
                      <CartItem
                        key={`cart-item-${index}`}
                        token={item}
                        latestCartItem={latestOrders[getCartKey(item.tokenId, item.tokenAddress)]}
                      />
                    ))}
                  </div>
                  <div className={Classes.listingDetail}>
                    <SelectPaymentTokens
                      selectedTokenAddress={selectedTokenAddress}
                      onSelectPaymentToken={onSelectPaymentToken}
                    />
                    <WillRender when={!isLoading}>
                      <Typography color="gray">
                        Buy with {formattedPrice} {selectedToken?.symbol}
                      </Typography>
                    </WillRender>
                    <WillRender when={isLoading}>
                      <Typography color="gray">Buy with ...</Typography>
                    </WillRender>
                    <WillRender when={!isEmpty(errorMessage)}>
                      <Typography size="xSmall" color="danger">
                        {errorMessage}
                      </Typography>
                    </WillRender>
                  </div>
                </WillRender>
              </div>
            </ModalBody>
            <ModalFooter>
              <WillRender when={!isCartEmpty}>
                <WillRender when={!isEmpty(tokensNeedToApprove)}>
                  <ApproveAction
                    symbol={tokensNeedToApprove[0]?.symbol}
                    tokenAddress={tokensNeedToApprove[0]?.address}
                    tokenType={ApproveTokenType.Erc20}
                    onApproveSuccessfully={onApproveSuccessfully}
                    onApproveFailed={onApproveFailed}
                  />
                </WillRender>
                <WillRender when={isEmpty(tokensNeedToApprove)}>
                  <ConnectWalletButton
                    isDisabled={isEmptyAvailableCartItems}
                    isLoading={isLoading || isBuying}
                    fullWidth
                    color="primary"
                    onPress={onBuy}
                  >
                    {buySomeItemsText}
                  </ConnectWalletButton>
                </WillRender>
              </WillRender>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Cart;
