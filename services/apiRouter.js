export const API_ROUTER = {
  // ----------------FNO----------------
  LIST_MARKET_DATAL: `fnoapi/list_market_data/`,
  LIST_SECWISE_DATE: `fnoapi/list_secwise_data/`,
  LIST_STOCK_DATA: `fnoapi/live_Stock_Data/`,
  DAILY_FII_DII_DATA: `fnoapi/fii-dii-cash-activity-data/`,

  //--------------------AUTH------------------
  LOGIN: `user/login/`,
  LOGOUT: `user/logout/`,
  REFRESH_TOKEN: `user/refresh-token/`,

  //----------------MONEY FLOW----------------
  CASH_FLOW_TOP_TEN: `moneyflow/cash/`,
  CASH_FLOW_ALL: `moneyflow/cash-chart/`,
  CANDLE_AND_MACD: `moneyflow/macd-list/`,
  STOCK_PREMIUMDECAY: `moneyflow/symbol-premium-decay/`,

  // ------------------NIFTY------------------
  ADR: `nifty/adr/`,
  NIFTY_FUTURE_DATA: `nifty/list_nifty_future/`,


  LIST_OPTIONCHAIN_DATA: `data/`,
  ACTIVE_OI: `activeoi-list/`,
  OPTIONDATA_LIST: `optiondata-list/`,
  MULTI_STRIKE: `multistrike-list/`,
  PREMIUM_DECAY: `premium-decay-list/`,
  EXPIRIES: `dates-expiries-list/`,
  MOST_ACTIVE:`most-active-strikes/`,
  TOP_GAINER_LOSSER:`top-gainers-losers/`,
  ORDERS_UPDATE :`signal/orderupdate/`,
  FUTURE_UPDATE :`signal/futureorderupdate/`
};
