import React, { FC } from "react";

import Layout from "../../../src/tanto-connect-kit/components/layout/Layout";
import RoninWallet from "../../../src/tanto-connect-kit/components/connectors/ronin-wallet/RoninWallet";

const RoninWalletPage: FC = () => {
  return (
    <Layout>
      <RoninWallet />
    </Layout>
  );
};

export default RoninWalletPage;
