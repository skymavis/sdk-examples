export const toDeepLink = (uri: string) => {
  const encoded = encodeURIComponent(uri);
  return `https://wallet.roninchain.com/auth-connect?uri=${encoded}`;
};
