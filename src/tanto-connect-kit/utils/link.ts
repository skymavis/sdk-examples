export const toDeepLinkInAppBrowser = (url: string) => {
  return `roninwallet://in_app_browser?url=${encodeURIComponent(url)}`;
};

export const toDeepLinkWalletConnect = (uri: string) => {
  return `https://wallet.roninchain.com/auth-connect?uri=${encodeURIComponent(uri)}`;
};
