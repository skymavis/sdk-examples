enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

enum TradeState {
  LOADING = 'loading',
  INVALID = 'invalid',
  STALE = 'stale',
  NO_ROUTE_FOUND = 'no_route_found',
  VALID = 'valid',
}

enum QuoteState {
  SUCCESS = 'Success',
  NOT_FOUND = 'Not found',
}

enum RouterPreference {
  api = 'api',
  price = 'price',
}

export enum ReactQueryKey {
  // Token
  TOKEN_ALLOWANCE = 'TOKEN_ALLOWANCE',
  PERMIT_ALLOWANCE = 'PERMIT_ALLOWANCE',

  // swap
  GET_QUOTE = 'GET_QUOTE',

  // other
  GET_RON_IN_USD_PRICE = 'GET_RON_IN_USD_PRICE',
  USER_TOKEN_BALANCES = 'USER_TOKEN_BALANCES',
  RON_BALANCE = 'RON_BALANCE',
  TOKEN_NONCE_STATE = 'TOKEN_NONCE_STATE',
}

export { Field, QuoteState, RouterPreference, TradeState };
