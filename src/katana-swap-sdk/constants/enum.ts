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

enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

enum TransactionState {
  Waiting = 'Waiting',
  Submitted = 'Submitted',
  Successful = 'Successful',
  Fail = 'Fail',
}

enum ReactQueryKey {
  // Token
  TOKEN_ALLOWANCE = 'TOKEN_ALLOWANCE',
  PERMIT_ALLOWANCE = 'PERMIT_ALLOWANCE',

  // swap
  GET_QUOTE = 'GET_QUOTE',

  // other
  GET_PYTH_RON_PRICE = 'GET_PYTH_RON_PRICE',
  GET_TOKEN_QUOTE_PRICE = 'GET_TOKEN_QUOTE_PRICE',
  USER_TOKEN_BALANCES = 'USER_TOKEN_BALANCES',
  RON_BALANCE = 'RON_BALANCE',
}

export { Field, QuoteState, ReactQueryKey, RouterPreference, TradeState, TransactionState, WrapType };
