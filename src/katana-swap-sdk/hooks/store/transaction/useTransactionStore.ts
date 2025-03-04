import create from 'zustand';

interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

interface ITransactionDetails {
  hash: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  claim?: { recipient: string };
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
}

interface ITransactionStore {
  [chainId: number]: {
    [txHash: string]: ITransactionDetails;
  };

  addTransaction: ({
    chainId,
    from,
    hash,
    approval,
    claim,
    summary,
  }: {
    chainId: number;
    hash: string;
    from: string;
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
    summary?: string;
  }) => void;
}

const currentTimestamp = () => new Date().getTime();
export const useTransactionStore = create<ITransactionStore>(set => ({
  addTransaction({ chainId, from, hash, approval, claim, summary }) {
    set(state => {
      if (state[chainId]?.[hash]) {
        throw Error('Attempted to add existing transaction.');
      }
      const txs = { ...(state[chainId] ?? {}) };
      txs[hash] = { hash, approval, summary, claim, from, addedTime: currentTimestamp() };
      return { ...state, [chainId]: txs };
    });
  },
}));

export type { ITransactionDetails };
