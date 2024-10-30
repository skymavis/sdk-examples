import { IEIP1193Provider } from '@sky-mavis/tanto-connect';

declare global {
  interface Window {
    ronin?: {
      provider: IEIP1193Provider;
    };
    ethereum?: IEIP1193Provider;
    isWalletApp?: boolean;
  }
  interface WindowEventMap {
    'eip6963:announceProvider': CustomEvent;
  }
}
