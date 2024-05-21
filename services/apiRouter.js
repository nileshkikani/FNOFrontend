export const API_ROUTER = {
  // ----------------FNO APIs----------------
  LIST_MARKET_DATAL: `fnoapi/list_market_data/`,
  LIST_SECWISE_DATE: `fnoapi/list_secwise_data/`,
  LIST_STOCK_DATA: `fnoapi/live_Stock_Data/`,
  DAILY_FII_DII_DATA:`fnoapi/fii-dii-cash-activity-data/`,

  //--------------------AUTH------------------
  LOGIN: `user/login/`,
  LOGOUT: `user/logout/`,
  REFRESH_TOKEN: `user/refresh-token/`,

  LIST_OPTIONCHAIN_DATA: `data/`,
  ACTIVE_OI: `activeoi-list/`,
  OPTIONDATA_LIST: `optiondata-list/`,
  NIFTY_FUTURE_DATA: `nifty/list_nifty_future/`,
  CASH_FLOW_TOP_TEN: `moneyflow/cash/`,
  CASH_FLOW_ALL:`moneyflow/cash-chart/`,
  ADR: `nifty/adr/`,
  MULTI_STRIKE: `multistrike-list/`
};