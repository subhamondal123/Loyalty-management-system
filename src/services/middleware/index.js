import { CommonActions } from "@react-navigation/native";
import { APP_INDEX } from "../../../globalConstant";
import { ApiConfigUrl, ApiModule } from "../api";
import { DateConvert, GetUserData, StorageDataModification, StoreDataToStorage, Toaster, userWarning } from "../common-view-function";
import { AppInfo, DeviceInfo } from "../config";
import { UsersEnums } from "../constant";
import { Platform } from "react-native";


export function MiddlewareCheck(uriName, payload, props) {
    return new Promise(async function (resolved, reject) {
        try {
            if (await userWarning.actionUnauthorizedDeviceWarning(props)) {
                if (await DeviceInfo.CheckConnection()) {
                    // const encodeData = Encoder.encode(payload);
                    payload = {
                        currentDateTime: DateConvert.fullDateFormat(new Date()),
                        platform: Platform.OS,
                        ...payload
                    }
                    let userInfo = await StorageDataModification.userCredential({}, "get");
                    if (userInfo) {
                        payload = {
                            ...payload,
                            ...await GetUserData.getUserData()
                        }
                    }
                    if (payload.refUserId && payload.refUserId.length > 0) {
                        payload.refUserId = payload.refUserId;
                        payload.refUserTypeId = payload.refUserTypeId
                    } else {
                        payload.refUserId = payload.userId;
                        payload.refUserTypeId = payload.usertypeId
                    }

                    // if (uriName !== UsersEnums.MIDDLEWARE.ODOMETER_READING_URI ) {
                    //     payload = {
                    //         ...payload,
                    //         ...await GetUserData.getUserLocation()
                    //     }
                    // }
                    if (ApiConfigUrl.APP_LAST_URI[uriName].isPicLocation == true) {
                        payload = {
                            ...payload,
                            ...await GetUserData.getUserLocation()
                        }
                    }
                    if (ApiConfigUrl.APP_LAST_URI[uriName]) {
                        // if (userInfo) {
                        //     await StoreUserCurrentLocation(payload, props); // for store the location
                        // }
                        if (props) {
                            // if (await GetVersionCheck(props)) {
                            //     let userStatus = await ApiModule.ApiCall("getUserStatus", payload);
                            //     if (userStatus.data.status == 1) {
                            //         await multipleRemove(["auth", "userCredential", "headerData", ......StoreDataToStorage.allStorageVariable]);
                            //         props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
                            //     } else {
                            resolved(await ApiModule.ApiCall(uriName, payload));
                            //     }
                            // }
                        } else {
                            resolved(await ApiModule.ApiCall(uriName, payload));
                        }
                    } else {
                        // if (userInfo) {
                        //     resolved(await StoreUserCurrentLocation(payload, props)); // for store the location
                        // }
                    }
                } else {
                    if (props) {
                        props.navigation.navigate("NetworkError");
                    }
                    resolved(false)
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}


export function MiddlewareOnlyApiCheck(uriName, payload, props) {
    return new Promise(async function (resolved, reject) {
        try {
            if (await DeviceInfo.CheckConnection()) {
                // const encodeData = Encoder.encode(payload);
                payload = {
                    platform: Platform.OS,
                    ...payload
                }
                let userInfo = await StorageDataModification.userCredential({}, "get");
                if (userInfo) {
                    payload = {
                        ...payload,
                        ...await GetUserData.getUserData()
                    }
                }
                if (ApiConfigUrl.APP_LAST_URI[uriName].isPicLocation == true) {
                    payload = {
                        ...payload,
                        ...await GetUserData.getUserLocation()
                    }
                }
                if (props) {
                    resolved(await ApiModule.ApiCall(uriName, payload));
                } else {
                    resolved(await ApiModule.ApiCall(uriName, payload));
                }
            } else {
                if (props) {
                    props.navigation.navigate("NetworkError");
                }
                resolved(false)
            }
        } catch (e) {
            reject(e);
        }
    });
}

// store the user's current location data
async function StoreUserCurrentLocation(payload, props) {
    return (await ApiModule.ApiCall(UsersEnums.MIDDLEWARE.PICK_USER_LOCATION_URI, payload));
}

// store the user's current location data
async function StoreCustomerCurrentLocation(payload, props) {
    return (await ApiModule.ApiCall(UsersEnums.MIDDLEWARE.PICK_CUSTOMER_LOCATION_URI, payload));
}


async function GetVersionCheck(props) {
    let versionCheck = true;
    let appVersion = await ApiModule.ApiCall("getCurrentAppVersionInfo", { "packageName": AppInfo.getAppPackageName(), "appIndex": APP_INDEX });
    if (appVersion.data.version !== AppInfo.getCurrentAppVersion()) {
        if (appVersion.data.isUpdate == 2) {
            versionCheck = false;
            props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'NewVersionAvailable', "data": appVersion.data }] }));
        } else if (appVersion.data.isUpdate == 1) {
            // Toaster.LongCenterToaster("A new update is available. You can update the apk.");
        }
    }
    return versionCheck;
}


export function MiddlewareFileCheck(uriName, payload, props) {
    return new Promise(async function (resolved, reject) {
        try {
            if (await DeviceInfo.CheckConnection()) {
                const formData = new FormData();
                formData.append(
                    "file",
                    payload
                );
                // if (props) {
                //     let userStatus = await ApiModule.ApiCall("getUserStatus", payload);
                //     if (userStatus.data.status == 1) {
                //         await multipleRemove(["auth", "userCredential", "headerData", ...StoreDataToStorage.allStorageVariable]);
                //         props.stateUserInformation({});
                //         props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
                //     } else {
                //         resolved(await ApiModule.ApiFileCall(uriName, formData));
                //     }
                // } else {
                resolved(await ApiModule.ApiFileCall(uriName, formData));
                // }
            } else {
                Toaster.ShortCenterToaster("Network error !")
                resolved(false)
            }
        } catch (e) {
            reject(e);
        }
    });
}

export async function StoreUserOtherInformations(uriName, payload, props) {
    if (await DeviceInfo.CheckConnection()) {
        payload = {
            platform: Platform.OS,
            deviceId: await DeviceInfo.DeviceUniqueId(),
            ...payload
        }
        let userInfo = await StorageDataModification.userCredential({}, "get");

        if (userInfo) {
            payload = {
                ...payload,
                ...await GetUserData.getUserData(),
            }
        }


        if (userInfo.loginType == "customer") {
            // await StoreCustomerCurrentLocation(payload, props);
            let userStatus = await ApiModule.ApiCall("getCustomerStatus", payload, props);
            console.log("userStatus===",userStatus)
            if (userStatus.response.status == 1 || userStatus.status == 498) {
                StorageDataModification.removeAllStorageData();
                StorageDataModification.removeLoginData();
                // await multipleRemove(["auth", "userCredential", "headerData", ...StoreDataToStorage.allStorageVariable]);
                props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
            }

        } else {
            // await StoreUserCurrentLocation(payload, props);
            let userStatus = await ApiModule.ApiCall("getUserStatus", payload, props);
            console.log("getUserStatus::::-----resss::", JSON.stringify(userStatus));
            if (userStatus.response.status == 1 || userStatus.status == 498) {
                StorageDataModification.removeAllStorageData();
                StorageDataModification.removeLoginData();
                // await multipleRemove(["auth", "userCredential", "headerData", ...StoreDataToStorage.allStorageVariable]);
                props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
            }
        }

    } else {
        if (props) {
            props.navigation.navigate("NetworkError");
        }
    }
    return true;
}


export async function fetchCurrentLocation(uriName, payload, props) {
    if (await DeviceInfo.CheckConnection()) {
        payload = {
            platform: Platform.OS,
            deviceId: await DeviceInfo.DeviceUniqueId(),
            ...payload
        }

        payload = {
            ...payload,
            ...await GetUserData.getUserData(),
            ...await GetUserData.getUserLocation()
        }

        await ApiModule.ApiCall("getCurrentLocation", payload);

    } else {
        if (props) {
            props.navigation.navigate("NetworkError");
        }
    }
    return true;
}

export function MiddlewareFileUploadWithMultipleData(uriName, payload, props) {
    return new Promise(async function (resolved, reject) {
        try {
            if (await DeviceInfo.CheckConnection()) {
                payload = {
                    currentDateTime: DateConvert.fullDateFormat(new Date()),
                    platform: Platform.OS,
                    ...payload
                }
                let userInfo = await StorageDataModification.userCredential({}, "get");
                if (userInfo) {
                    payload = {
                        ...payload,
                        ...await GetUserData.getUserData()
                    }
                }
                if (payload.refUserId && payload.refUserId.length > 0) {
                    payload.refUserId = payload.refUserId;
                    payload.refUserTypeId = payload.refUserTypeId
                } else {
                    payload.refUserId = payload.userId;
                    payload.refUserTypeId = payload.usertypeId
                }

                const formData = new FormData();
                for (const property in payload) {
                    formData.append(property, payload[property]);
                }
                resolved(await ApiModule.ApiFileCall(uriName, formData));
            } else {
                if (props) {
                    props.navigation.navigate("NetworkError");
                }
                resolved(false)
            }
        } catch (e) {
            reject(e);
        }
    });
}