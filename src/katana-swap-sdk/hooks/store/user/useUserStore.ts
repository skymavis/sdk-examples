import { DEFAULT_DEADLINE_FROM_NOW } from 'src/katana-swap-sdk/constants/misc';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface IUserStore {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  userExpertMode: boolean;
  updateUserExpertMode: ({ userExpertMode }: { userExpertMode: boolean }) => void;

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number | 'auto';
  userSlippageToleranceHasBeenMigratedToAuto: boolean; // temporary flag for migration status
  updateUserSlippageTolerance: ({ userSlippageTolerance }: { userSlippageTolerance: number | 'auto' }) => void;

  // deadline set by user in minutes, used in all txns
  userDeadline: number;
  updateUserDeadline: ({ userDeadline }: { userDeadline: number }) => void;

  timestamp: number;
}

const currentTimestamp = () => new Date().getTime();

export const useUserStore = create<IUserStore, [['zustand/persist', IUserStore]]>(
  persist(
    set => ({
      userExpertMode: false,
      userSlippageTolerance: 'auto',
      userSlippageToleranceHasBeenMigratedToAuto: true,
      userDeadline: DEFAULT_DEADLINE_FROM_NOW,
      timestamp: currentTimestamp(),

      updateUserDeadline: ({ userDeadline }) => {
        set(state => ({
          ...state,
          userDeadline: userDeadline,
          timestamp: currentTimestamp(),
        }));
      },

      updateUserExpertMode({ userExpertMode }) {
        set(state => ({
          ...state,
          userExpertMode: userExpertMode,
          timestamp: currentTimestamp(),
        }));
      },

      updateUserSlippageTolerance({ userSlippageTolerance }) {
        set(state => ({
          ...state,
          userSlippageTolerance: userSlippageTolerance,
          timestamp: currentTimestamp(),
        }));
      },
    }),
    { name: 'user-store' },
  ),
);
