// Define all the actions

export const setDeviceId = (deviceId) => ({
    type: "SET_DEVICEID",
    payload: deviceId,
});

export const stateCheckForNetwork = (networkCheckState) => ({
    type: "SET_STATE_CHECK_FOR_NETWORK",
    payload: networkCheckState,
});

export const stateAllCountries = (countryArr) => ({
    type: "SET_ALL_COUNTRIES",
    payload: countryArr,
});
export const stateUserInformation = (userInfo) => ({
    type: "SET_USER_INFORMATION",
    payload: userInfo,
});

//order customer data
export const customerOrderData = (userInfo) => ({
    type: "SET_CUSTOMER_ORDER_INFORMATION",
    payload: userInfo,
});

export const mappedCountriesUserData = (countryMappedUserArr) => ({
    type: "SET_MAPPED_COUNTRIES_USER_DATA",
    payload: countryMappedUserArr,
});

export const mappedProductUserData = (productMappedUserArr) => ({
    type: "SET_MAPPED_PRODUCT_USER_DATA",
    payload: productMappedUserArr,
});

// cart cart data by user
export const stateCartData = (cartData) => ({
    type: "SET_CART_DATA",
    payload: cartData
});
// cart selected beat route data by user
export const userSelectedBeatRouteData = (routeData) => ({
    type: "SET_BEAT_ROUTE_DATA",
    payload: routeData
});

// cart item data by user
export const stateDayActivitySelectionData = (dayActivitySelectionData) => ({
    type: "SET_DAY_ACTIVIY_SELECTION_DATA",
    payload: dayActivitySelectionData
});

// set user attendance data
export const userAttendanceData = (attendanceData) => ({
    type: "SET_ATTENDANCE_DATA",
    payload: attendanceData
});

// cart store data by user
export const stateStoreData = (storeData) => ({
    type: "SET_STORE_DATA",
    payload: storeData
});

// higher level product data by user
export const mappedHigherLevelProducts = (productData) => ({
    type: "SET_MAPPED_HIGHER_LEVEL_PRODUCT",
    payload: productData
});

// login data of user
export const loginData = (loginData) => ({
    type: "SET_LOGIN_DATA",
    payload: loginData
});

// login data of user
export const loginUserTypeData = (loginUserTypeData) => ({
    type: "SET_LOGIN_USER_TYPE_DATA",
    payload: loginUserTypeData
});