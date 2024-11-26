import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { IBaseConnector } from '@sky-mavis/tanto-connect';

import { Erc20__factory } from '../../../../abis/types';

export const createERC20Contract = async (connector: IBaseConnector | null, tokenAddress: string) => {
  const provider = await connector?.getProvider();

  if (provider) {
    const web3Provider = new Web3Provider(provider as ExternalProvider);
    const signer = web3Provider.getSigner();
    return Erc20__factory.connect(tokenAddress, signer);
  }
};
