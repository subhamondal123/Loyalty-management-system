import { combineReducers } from "redux";

const INITIAL_STATE = {
  deviceId: "",
  networkCheckState: "",
  allCountries: [],
  userInfo: {},
  customerOrderData: {},
  countryMappedUserArr: [],
  productMappedUserArr: [],
  mappedHigherLevelProductArr: [],
  routeData: {},
  dayActivitySelectionData: {},
  attendanceData: {},
  loginData: {},
  loginUserTypeData: "",
  cartData: {
    "allCart": []
  },
  storeData: {
    "allStore": []
  }
};

const Sales360Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_DEVICEID":
      state.deviceId = action.payload;
      return state;

    case "SET_STATE_CHECK_FOR_NETWORK":
      state.networkCheckState = action.payload;
      return state;

    case "SET_ALL_COUNTRIES":
      state.allCountries = action.payload;
      return state;

    case "SET_USER_INFORMATION":
      state.userInfo = action.payload;
      return state;

    case "SET_CUSTOMER_ORDER_INFORMATION":
      state.customerOrderData = action.payload;
      return state;

    case "SET_MAPPED_COUNTRIES_USER_DATA":
      state.countryMappedUserArr = action.payload;
      return state;

    case "SET_MAPPED_PRODUCT_USER_DATA":
      state.productMappedUserArr = action.payload;
      return state;

    case "SET_CART_DATA":
      state.cartData = action.payload;
      return state;

    case "SET_BEAT_ROUTE_DATA":
      state.routeData = action.payload;
      return state;

    case "SET_DAY_ACTIVIY_SELECTION_DATA":
      state.dayActivitySelectionData = action.payload;
      return state;

    case "SET_ATTENDANCE_DATA":
      state.attendanceData = action.payload;
      return state;

    case "SET_STORE_DATA":
      state.storeData = action.payload;
      return state;

    case "SET_MAPPED_HIGHER_LEVEL_PRODUCT":
      state.mappedHigherLevelProductArr = action.payload;
      return state;

    case "SET_LOGIN_DATA":
      state.loginData = action.payload;
      return state;

    case "SET_LOGIN_USER_TYPE_DATA":
      state.loginUserTypeData = action.payload;
      return state;


    default:
      return state;
  }
};

export default combineReducers({
  Sales360Redux: Sales360Reducer,
});
