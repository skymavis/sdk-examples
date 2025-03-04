// You may throw an instance of this class when the user rejects a request in their wallet.
// The benefit is that you can distinguish this error from other errors using didUserReject().
class UserRejectedRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserRejectedRequestError';
  }
}

function toReadableError(errorText: string, error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const e = error as Error & { reason?: string };
    return new Error(`${errorText} 👺 ${e.message ?? e.reason ?? 'unknown'}`);
  }
  return new Error(`${errorText} 👺 ${error}`);
}

function getReason(error: any): string | undefined {
  let reason: string | undefined;
  while (error) {
    reason = error.reason ?? error.message ?? reason;
    error = error.error ?? error.data?.originalError;
  }
  return reason;
}

function didUserReject(error: any): boolean {
  const reason = getReason(error);
  if (
    error?.code === 4001 ||
    // ethers v5.7.0 wrapped error
    error?.code === 'ACTION_REJECTED' ||
    // For Rainbow :
    (reason?.match(/request/i) && reason?.match(/reject/i)) ||
    // For Frame:
    reason?.match(/declined/i) ||
    // For SafePal:
    reason?.match(/cancell?ed by user/i) ||
    // For Trust:
    reason?.match(/user cancell?ed/i) ||
    // For Coinbase:
    reason?.match(/user denied/i) ||
    // For Fireblocks
    reason?.match(/user rejected/i) ||
    error instanceof UserRejectedRequestError
  ) {
    return true;
  }
  return false;
}

export class TransactionFailedError extends Error {
  txHash: string;
  constructor(message: string, txHash: string) {
    super(message);
    this.name = 'TransactionFailedError';
    this.txHash = txHash;
  }
}

export class WrongChainError extends Error {
  constructor() {
    super('Wrong network');
  }
}

export class SignatureExpiredError extends Error {
  private _id: string;
  constructor() {
    super('common.signatureExpired');
    this.name = 'SignatureExpiredError';
    this._id = `SignatureExpiredError-${window?.crypto.randomUUID()}`;
  }

  get id(): string {
    return this._id;
  }
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error - An error from the ethers provider
 */
export function swapErrorToUserReadableMessage(error: any): string {
  if (didUserReject(error)) {
    return `Transaction rejected`;
  }

  let reason = getReason(error);
  if (reason?.indexOf('execution reverted: ') === 0) {
    reason = reason.substr('execution reverted: '.length);
  }

  switch (reason) {
    case 'UniswapV2Router: EXPIRED':
      return `This transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.`;
    case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
      return `This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.`;
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return `The input token cannot be transferred. There may be an issue with the input token.`;
    case 'UniswapV2: TRANSFER_FAILED':
      return `The output token cannot be transferred. There may be an issue with the output token.`;
    case 'UniswapV2: K':
      return `The Uniswap invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping incorporates custom behavior on transfer.`;
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return `This transaction will not succeed due to price movement. Try increasing your slippage tolerance.`;
    case 'TF':
      return `The output token cannot be transferred. There may be an issue with the output token.`;
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason);
        return `An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.`;
      }
      return `${
        reason ? reason?.slice(0, 1)?.toUpperCase() + reason?.slice(1) : 'Unknown error'
      } .You may need to increase your slippage tolerance.`;
  }
}

export { didUserReject, toReadableError, UserRejectedRequestError };
