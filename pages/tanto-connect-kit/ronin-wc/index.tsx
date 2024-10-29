import { FC } from "react";

import Layout from "../../../src/tanto-connect-kit/components/layout/Layout";
import RoninWalletConnect from "../../../src/tanto-connect-kit/components/connectors/ronin-wallet-connect/RoninWalletConnect";

const RoninWCPage: FC = () => {
  return (
    <Layout>
      <RoninWalletConnect />
    </Layout>
  );
};

export default RoninWCPage;
