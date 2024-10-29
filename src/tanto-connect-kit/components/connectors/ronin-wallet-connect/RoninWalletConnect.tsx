import {
  ConnectorEvent,
  DEFAULT_CONNECTORS_CONFIG,
  IConnectResult,
  requestRoninWalletConnectConnector,
} from "@sky-mavis/tanto-connect";
import { isNil } from "lodash";
import { QRCodeSVG } from "qrcode.react";
import React, { FC, useEffect } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import WillRender from "@components/will-render/WillRender";

import styles from "./RoninWalletConnect.module.scss";
import Typography from "@components/typography/Typography";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";

const wcOptions = {
  projectId: "d2ef97836db7eb390bcb2c1e9847ecdc",
  metadata: {
    name: "TantoKit Example",
    description: "TantoKit Example",
    icons: [
      "https://cdn.skymavis.com/skymavis-home/public//homepage/core-value.png",
    ],
    url: "https://mavis-sdk-examples.vercel.app/",
  },
};

const defaultConfigs = DEFAULT_CONNECTORS_CONFIG.RONIN_WC;
const RoninWalletConnect: FC = () => {
  const {
    connector,
    setConnector,
    setIsConnected,
    isConnected,
    setChainId,
    setAccount,
  } = useConnectorStore();
  const [uri, setUri] = React.useState<string | null>(null);

  const onConnect = (payload: IConnectResult) => {
    setIsConnected(true);
    setAccount(payload.account);
    setChainId(payload.chainId);
  };

  const onAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  const onChainChanged = (chainId: number) => {
    setChainId(chainId);
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    connector?.connect(2021);
  };

  const onDisplayUri = (uri: string) => {
    setIsConnected(false);
    setUri(uri);
  };

  useEffect(() => {
    const initializeConnector = async () => {
      try {
        const connector = await requestRoninWalletConnectConnector(wcOptions);
        setConnector(connector);
        connector.connect(2021);

        connector.on(ConnectorEvent.DISPLAY_URI, onDisplayUri);
        connector.on(ConnectorEvent.CONNECT, onConnect);
        connector.on(ConnectorEvent.ACCOUNTS_CHANGED, onAccountChange);
        connector.on(ConnectorEvent.CHAIN_CHANGED, onChainChanged);
        connector.on(ConnectorEvent.DISCONNECT, onDisconnect);
      } catch (error) {
        console.error("[initialize_ronin_wallet_connector]", error);
      }
    };

    setIsConnected(false);
    initializeConnector();

    return () => {
      connector?.removeAllListeners();
      setConnector(null);
    };
  }, []);

  console.log(uri);
  return (
    <div className={styles.roninWalletConnect}>
      <WillRender when={!isConnected && isNil(uri)}>
        <WaitingWallet icon={defaultConfigs.icon} name={defaultConfigs.name} />
      </WillRender>
      <WillRender when={!isConnected && !isNil(uri)}>
        <div className={"w-full flex flex-col items-center gap-2 p-6"}>
          <QRCodeSVG
            value={uri as string}
            marginSize={2}
            size={164}
            imageSettings={{
              src: defaultConfigs.icon as string,
              height: 32,
              width: 32,
              excavate: true,
            }}
          />
          <Typography size={"small"}>Scan with Ronin Wallet</Typography>
        </div>
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default RoninWalletConnect;
