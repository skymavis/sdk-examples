import { DEFAULT_CONNECTORS_CONFIG, ReconnectStorage, SupportedConnectors } from '@sky-mavis/tanto-connect';

export const checkHasConnector = (connector: SupportedConnectors) => {
  return ReconnectStorage.get(DEFAULT_CONNECTORS_CONFIG[connector].id);
};
