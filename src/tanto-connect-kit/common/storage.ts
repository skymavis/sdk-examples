import { LocalStorage, STORAGE_PREFIX } from '@sky-mavis/tanto-connect';

export const RecentConnectorStorage = {
  key: `${STORAGE_PREFIX}.recentConnector`,
  check: (connectorId: string) => LocalStorage.get(RecentConnectorStorage.key) === connectorId,
  set: (connectorId: string) => LocalStorage.set(RecentConnectorStorage.key, connectorId),
  clear: () => LocalStorage.remove(RecentConnectorStorage.key),
};
