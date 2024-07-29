import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
    Linking
} from "react-native";
import { AlertMessage, Color, Dimension, FontFamily, ImageName } from "../../enums";
import styles from "./Style";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    stateCheckForNetwork,
    stateUserInformation,
    stateAllCountries,
    mappedCountriesUserData,
    mappedProductUserData,
    userSelectedBeatRouteData,
    mappedHigherLevelProducts,
    loginData,
    loginUserTypeData
} from '../../redux/Sales360Action';
import { modCustomerLoginData, modLoginData, modYearData, modifyCountryArrData, modifyLocationMappedData, modifyMenuPermisionData } from "./Function";
import { BigTextButton, BottomModal, Loader, TextInputBox } from "../../shared";
import { MiddlewareCheck, MiddlewareOnlyApiCheck } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
import { DataValidator } from "../../validators";
import { CommonActions } from "@react-navigation/native";
import { AppInfo, DeviceInfo } from '../../services/config';
// import PushNotification from "react-native-push-notification";
import { GetUserData, Permissions, StorageDataModification, Toaster } from "../../services/common-view-function";
import { APP_INDEX, PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "../../../globalConstant";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { UserAccessPermission } from "../../services/userPermissions";

// ********************For Access Permission reference*******************
/*
    USE : UserAccessPermission.Login.loginType("phone", this.props)          (FORMAT)
*/
// PushNotification.localNotification({
//     autoCancel: true,
//     bigText:
//       'This is local notification demo in React Native app. Only shown, when expanded.',
//     subText: 'Local Notification Demo',
//     title: 'Local Notification Title',
//     message: 'Expand me to see more',
//     vibrate: true,
//     vibration: 300,
//     playSound: true,
//     soundName: 'default',
//     // actions: '["Yes", "No"]'
// })

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            userIdActive: false,
            password: "",
            passwordCheck: true,
            passwordActive: false,
            userIdError: false,
            passwordError: false,
            pageLoader: false,
            alertMessage: "",
            logInType: 0,
            fcmToken: "",
            versionData: {},
            permission: {},
            loginType: "userId",
            //only mobile user
            mobileNo: "",
            otp: "",
            timer: 30,
            isTimerStarted: false,
            isVisibleModal: false
        };
    }

    componentDidMount = async () => {
        // this._getToken();
        await this._onGetAppVersionInfo();
        await Permissions.GetAllPermissions();
    }

    /*  ----------------------ALL FUNCTIONS-------------------------- */
    // for get the app version info
    _onGetAppVersionInfo = async () => {
        let reqData = { "packageName": AppInfo.getAppPackageName(), "appIndex": APP_INDEX }
        let responseData = await MiddlewareOnlyApiCheck("getCurrentAppVersionInfo", reqData);
        console.log("getCurrentAppVersionInfo---", JSON.stringify(responseData))
        if (responseData) {
            if (responseData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ versionData: responseData.data })
                if (responseData.data.version !== AppInfo.getCurrentAppVersion()) {
                    if (responseData.data.isUpdate == 2) {
                        this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'NewVersionAvailable',"data": responseData.data }] }));
                    } else {
                        if (responseData.data.isUpdate == 1) {
                            Toaster.LongCenterToaster("A new update is available. You can update the apk.");
                            this.setState({ pageLoader: false });
                        }
                        else {
                            this.setState({ pageLoader: false });
                        }
                    }
                }
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    // get RCM token for push notification
    _getToken = () => {
        let that = this;

        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                // return (token);
                that.setState({
                    fcmToken: token.token
                })
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                // console.log("NOTIFICATION:", notification);

                // process the notification
                const { foreground, userInteraction, title, message } = notification;
                if (foreground && (title || message) && !userInteraction) PushNotification.localNotification(notification);
                // (required) Called when a remote is received or opened, or local notification is opened
            },



            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                // console.log("ACTION:", notification.action);
                // console.log("NOTIFICATION:", notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },



            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });

        PushNotification.localNotification({
            ignoreInForeground: true
        })
    }

    _onClearLoginData = () => {
        this.setState({
            userId: "",
            password: ""
        })
    }

    _onLoginType = async () => {
        if (this.state.logInType == 0) {
            this.state.logInType = 1;
            this.setState({
                logInType: this.state.logInType
            })
        } else {
            this.state.logInType = 0;
            this.setState({
                logInType: this.state.logInType
            })
        }
        await this._onClearLoginData()
    }

    // for get the get Hierarchy Types With Sl No
    _getHierarchyTypesSlNo = async (mappedData, modifyLoginData) => {
        let resp = [
            {
                "hierarchyTypeId": 1,
                "hmTypDesc": "Country",
                "SlNo": 1
            },
            {
                "hierarchyTypeId": 2,
                "hmTypDesc": "State",
                "SlNo": 2
            },
            {
                "hierarchyTypeId": 3,
                "hmTypDesc": "District",
                "SlNo": 3
            },
            {
                "hierarchyTypeId": 4,
                "hmTypDesc": "Zone",
                "SlNo": 4
            }
        ]
        await StorageDataModification.locationMappedData(modifyLocationMappedData(resp, mappedData), "store");
        // return true;
    }

    //--------------------------------------ALL SECTIONS -----------------------------------------

    //LOGIN HEADING SECTION
    loginHeadingSec = () => {
        const logoSection = () => {
            return (
                <>
                    {UserAccessPermission.LOGIN.loginType("userId", this.props) && this.state.loginType == "userId" ?
                        <Image source={ImageName.BLUE_KEY_ICON} style={styles.loginImage} />
                        :
                        null
                    }
                    {UserAccessPermission.LOGIN.loginType("phone", this.props) && this.state.loginType == "phone" ?
                        <Image source={ImageName.LOGIN_PHONE_ICON} style={styles.loginImage} />
                        :
                        null
                    }
                </>
            )
        }
        return (
            <View style={styles.belowImageView}>
                {logoSection()}
                <Text style={styles.loginText}>{"Login"} </Text>
            </View>
        )
    }

    // USERNAME PASSWORD SECTION
    userNamePasswordSec = () => {
        const eyeVisible = () => {
            if (this.state.password.length > 0) {
                this.state.passwordCheck = !this.state.passwordCheck;
                this.setState({
                    passwordCheck: this.state.passwordCheck,
                })
            }

        }
        //__userID field function
        const _onChangeUserId = (value) => {
            let newText = '';
            newText = DataValidator.inputEntryValidate(value, "alphanumeric");
            this.setState({
                userId: newText
            })
            if (this.state.userIdError == true) {
                this.setState({
                    userIdError: false
                })
            }
        }

        //__password field function
        const _onChangePassword = (value) => {
            let newText = '';
            newText = DataValidator.inputEntryValidate(value, "alphanumeric");
            this.setState({
                password: newText
            })
            if (this.state.userIdError == true) {
                this.setState({
                    userIdError: false
                })
            }
        }
        return (
            <View>
                <View style={{ marginBottom: 32 }}>
                    <TextInputBox
                        placeholder={"Put your ID number"}
                        value={this.state.userId}
                        onChangeText={(value) => _onChangeUserId(value)}
                        keyboardType={"default"}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        refName={ref => this.firstTextInput = ref}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        isActive={this.state.userIdActive}
                        onFocus={() => { this.setState({ userIdActive: true }) }}
                        onBlur={() => { this.setState({ userIdActive: false }) }}
                        editable={!this.state.pageLoader}
                        type={"new"}
                        inactiveBGColor={"#fff"}
                        activeBGColor={"fff"}
                        isRightIcon={true}
                        rightIcon={ImageName.LOGIN_USER_ICON}
                        rightIconStyle={{ height: 25, width: 25 }}
                        height={46}
                        placeholderTextColor="#747C90"
                        fontFamily={FontFamily.FONTS.POPPINS.REGULAR}
                        isLabelVisible={true}
                        labelText={"User ID"}
                        isHidden={!UserAccessPermission.LOGIN.loginType("userId", this.props)}
                    />
                </View>
                <View style={{ marginBottom: 32 }}>
                    <TextInputBox
                        placeholder={"Password"}
                        value={this.state.password}
                        onChangeText={(value) => _onChangePassword(value)}
                        secureTextEntry={this.state.passwordCheck}
                        refName={ref => this.secondTextInput = ref}
                        isActive={this.state.passwordActive}
                        onFocus={() => { this.setState({ passwordActive: true }) }}
                        onBlur={() => { this.setState({ passwordActive: false }) }}
                        editable={!this.state.pageLoader}
                        type={"new"}
                        inactiveBGColor={"#fff"}
                        activeBGColor={"fff"}
                        isRightIcon={true}
                        onPressRightIcon={() => eyeVisible()}
                        rightIcon={this.state.password.length > 0 ? this.state.passwordCheck ? ImageName.CLOSE_EYE : ImageName.OPEN_EYE : ImageName.BLUE_KEY_ICON}
                        rightIconStyle={{ height: 25, width: 25 }}
                        height={46}
                        placeholderTextColor="#747C90"
                        fontFamily={FontFamily.FONTS.POPPINS.REGULAR}
                        isLabelVisible={true}
                        labelText={"Password"}
                        isHidden={!UserAccessPermission.LOGIN.loginType("userId", this.props)}
                    />
                </View>
            </View>
        )
    }

    //MOBILE NUMBER SECTION
    mobileNumberSection = () => {
        //__mobile no field function
        const onChangeMobile = (value) => {
            let newText = DataValidator.inputEntryValidate(value, "mobile")
            this.setState({ mobileNo: newText })
        }
        return (
            <View style={{ marginBottom: 32 }}>
                <TextInputBox
                    placeholder={"Put your registered mobile number"}
                    value={this.state.mobileNo}
                    onChangeText={(value) => onChangeMobile(value)}
                    keyboardType={"number-pad"}
                    returnKeyType={"default"}
                    blurOnSubmit={true}
                    editable={!this.state.pageLoader}
                    type={"new"}
                    inactiveBGColor={"#fff"}
                    activeBGColor={"fff"}
                    isRightIcon={true}
                    rightIcon={ImageName.LOGIN_PHONE_ICON}
                    rightIconStyle={{ height: 26, width: 26 }}
                    height={46}
                    placeholderTextColor="#747C90"
                    fontFamily={FontFamily.FONTS.POPPINS.REGULAR}
                    isLabelVisible={true}
                    labelText={"User ID"}
                    maxLength={10}
                    isHidden={!UserAccessPermission.LOGIN.loginType("phone", this.props)}
                />
            </View>
        )
    }

    //OTP VERIFICATION SECTION
    otpVerificationSec = () => {
        const formatTimer = () => {
            const { timer } = this.state;
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            // return `${minutes}:${seconds}`;
            return `${seconds}`;
        }
        //__OTP input field function
        const _onOtpInput = (input) => {
            let newText = "";
            newText = DataValidator.inputEntryValidate(input, "number");
            this.setState({
                otp: newText,
            });
        };
        return (
            <>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={styles.otpLabelUserIdlTxt}>User ID</Text>
                        <Text style={styles.otpLabelTxt}>Put four digit OTP which is send by SMS</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View>
                        <Image source={ImageName.LOGIN_PHONE_ICON} style={styles.loginPhoneIcon} />
                    </View>
                </View>
                <View style={styles.otpmainView}>
                    <OTPInputView
                        autoFocusOnLoad={false}
                        style={{ width: "100%", height: 45 }}
                        pinCount={4}
                        code={this.state.otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged={(code) => _onOtpInput(code)}
                        codeInputFieldStyle={styles.otpView}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) => {
                            console.log(`Code is ${code}, you are good to go!`);
                        }}
                        placeholderTextColor={Color.COLOR.GRAY.PHILIPPINE_SILVER}
                        placeholderCharacter={'●'}

                    />
                </View>
                {/* {this.state.isTimerStarted ? */}
                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                    <Text style={styles.otpLabelTxt}>Please resend OTP after <Text style={styles.timerTxt}>{formatTimer()}</Text>  sec</Text>
                </View>
                {/* :
                    null
                } */}

            </>
        )
    }

    //ALERT MESSAGE SECTION
    alertMessageSec = () => {
        return (
            <>
                {
                    this.state.alertMessage == "" ?
                        null
                        :
                        <React.Fragment>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                                <Image source={ImageName.RED_EXCLAMATION} style={{ height: 15, width: 15, resizeMode: "contain" }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.alertMsg}>{this.state.alertMessage}</Text>
                                </View>
                            </View>
                        </React.Fragment>
                }
            </>

        )
    }

    _onLogin = async (type) => {
        this.state.userId = this.state.userId.replace(/\s+/g, '');
        let errorCount = 0;
        let msg = "";
        let data = {
            userId: this.state.userId,
            password: this.state.password
        }
        if (data.userId == null || data.userId == undefined || data.userId.length == 0) {
            msg = "Please enter User ID !";
            errorCount++;
        }
        // else if (emailModValidator(data.userId) == false) {
        //     msg = AlertMessage.MESSAGE.EMAIL_PASSWORD.INCORRECT;
        //     errorCount++;
        // }
        else if (data.password == null || data.password == undefined || data.password.length == 0) {
            msg = AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY;
            errorCount++;
        }
        this.setState({ alertMessage: msg })
        if (errorCount === 0) {
            this.setState({ alertMessage: "" });


            if (type == "customer") {
                let reqData = {
                    "username": this.state.userId,
                    "password": this.state.password,
                    "platform": Platform.OS,
                    "deviceId": await DeviceInfo.DeviceUniqueId(),
                    "fcmToken": this.state.fcmToken,
                    "businessType": "",
                    "type": this.state.logInType
                }
                this.setState({ pageLoader: true })
                let responseData = await MiddlewareCheck("customerLogin", reqData);
                console.log("login-----------", JSON.stringify(responseData))
                if (responseData == false) {
                    this.setState({ alertMessage: "Network Error!" });
                } else {
                    if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                        await StorageDataModification.authData(responseData.response[0].token, "store");
                        let modifyLoginData = modCustomerLoginData(responseData, type);
                        this.props.mappedCountriesUserData(modifyLoginData.mappedCountires);
                        this.props.mappedProductUserData(modifyLoginData.mappedMaxLevelForProducts);
                        this.props.mappedHigherLevelProducts(modifyLoginData.mappedHighersLevelProducts);
                        this.props.stateAllCountries(modifyCountryArrData(modifyLoginData.mappedCountires));
                        this.props.loginData(modifyLoginData)
                        await StorageDataModification.userCredential(modifyLoginData, "store");
                        await StorageDataModification.mappedLocationData(modifyLoginData.mappedCountires, "store");
                        await StorageDataModification.mappedProductData(modifyLoginData.mappedMaxLevelForProducts, "store");
                        await StorageDataModification.mappedHigherLevelProductData(modifyLoginData.mappedHighersLevelProducts, "store");
                        await StorageDataModification.routeData(modifyLoginData.lastLevelLocations, "store"); // to store the location data in async storage
                        this.props.userSelectedBeatRouteData(modifyLoginData.lastLevelLocations);// to store the location data in redux
                        this.setState({ isVisibleModal: false })
                        await this.getFinancialYearData(responseData)
                        this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'DrawerNav' }] }));
                    } else {
                        this.setState({ alertMessage: responseData.message });
                        this.setState({ isVisibleModal: false })
                    }
                }
            }
            else {
                let reqData = {
                    "email": this.state.userId,
                    "password": this.state.password,
                    "platform": Platform.OS,
                    "deviceId": await DeviceInfo.DeviceUniqueId(),
                    "fcmToken": this.state.fcmToken,
                    "businessType": "",
                    "type": this.state.logInType
                }
                this.setState({ pageLoader: true })
                let responseData = await MiddlewareCheck("loginNew", reqData);
                console.log("login----employeee-------", JSON.stringify(responseData))

                if (responseData == false) {
                    this.setState({ alertMessage: "Network Error!" });
                } else {
                    if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                        await StorageDataModification.authData(responseData.response[0].token, "store");
                        await StorageDataModification.userMenuPermision(modifyMenuPermisionData(responseData.response[0].moduleDetails), "store");
                        let modifyLoginData = modLoginData(responseData, type);
                        let userSettingsData = await GetUserData.getUserSettingsData(modifyLoginData);
                        let userModuleSettingsData = await GetUserData.getUserModuleSettingsData(modifyLoginData);
                        this.props.mappedCountriesUserData(responseData.response[0].mappedCountires);
                        this.props.mappedProductUserData(responseData.response[0].mappedMaxLevelForProducts);
                        this.props.mappedHigherLevelProducts(responseData.response[0].mappedHighersLevelProducts);
                        this.props.stateAllCountries(modifyCountryArrData(responseData.response[0].mappedCountires));
                        this.props.loginData(modifyLoginData)
                        await StorageDataModification.userCredential(modifyLoginData, "store");
                        await StorageDataModification.userSettingsData(userSettingsData, "store");
                        await StorageDataModification.userModuleSettingsData(userModuleSettingsData, "store");
                        await StorageDataModification.mappedLocationData(responseData.response[0].mappedCountires, "store");
                        await StorageDataModification.mappedProductData(responseData.response[0].mappedMaxLevelForProducts, "store");
                        await StorageDataModification.mappedHigherLevelProductData(responseData.response[0].mappedHighersLevelProducts, "store");
                        // await this._getHierarchyTypesSlNo(responseData.response[0].mappedCountires, modifyLoginData);
                        await StorageDataModification.routeData(modifyLoginData.lastLevelLocations, "store"); // to store the location data in async storage
                        this.props.userSelectedBeatRouteData(modifyLoginData.lastLevelLocations);// to store the location data in redux
                        this.setState({ isVisibleModal: false })
                        await this.getFinancialYearData(responseData)
                        this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'DrawerNav' }] }));
                    } else {
                        this.setState({ alertMessage: responseData.message });
                        this.setState({ isVisibleModal: false })
                    }
                }
            }
            this.setState({ pageLoader: false })
        }
    }

    getFinancialYearData = async () => {
        let responseData = await MiddlewareCheck("getCurrentFinYear", {}, this.props);
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modYearData(responseData.response)
                await StorageDataModification.currentFinancialYearData(modData, "store"); // to store the location data in async storage
            }
        }
    }


    _onLoginSelect = () => {
        let errorCount = 0;
        let msg = "";
        let data = {
            userId: this.state.userId,
            password: this.state.password
        }
        if (data.userId == null || data.userId == undefined || data.userId.length == 0) {
            msg = "Please enter User ID !";
            errorCount++;
        }
        // else if (emailModValidator(data.userId) == false) {
        //     msg = AlertMessage.MESSAGE.EMAIL_PASSWORD.INCORRECT;
        //     errorCount++;
        // }
        else if (data.password == null || data.password == undefined || data.password.length == 0) {
            msg = AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY;
            errorCount++;
        }
        this.setState({ alertMessage: msg })
        if (errorCount == 0) {
            this.setState({ isVisibleModal: true })
        }
    }

    //LOGIN TYPE SECTION AND LOGIN BUTTON SECTION
    loginTypeAndButtonSec = () => {
        //__on forgot password button function
        const _onForgotPassword = () => {
            this.props.navigation.navigate("ForgotPassword");
        }




        const loginTypeSec = () => {
            //__select login type function
            const onSelectLoginType = (value) => {
                // this.setState({ loginType: value })
            }

            const _onBackToPhoneNo = () => {

            }

            return (
                <View style={{ flex: 0.6, flexDirection: "row" }}>
                    {UserAccessPermission.LOGIN.loginType("fingerPrint", this.props) ?
                        <>
                            {this.state.loginType == 'otp' ?
                                null
                                :
                                <>
                                    <View>
                                        <Image source={ImageName.LOGIN_FINGERPRINT_ICON} style={{ height: 50, width: 50, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{ width: 15 }} />
                                </>

                            }

                        </>
                        :
                        null
                    }
                    {this.state.loginType == "userId" ?
                        <>
                            {UserAccessPermission.LOGIN.loginType("userId", this.props) && UserAccessPermission.LOGIN.loginType("phone", this.props) ?
                                <TouchableOpacity onPress={() => onSelectLoginType("phone")} activeOpacity={0.8}>
                                    <Image source={ImageName.LOGIN_PHONE_ICON} style={{ height: 46, width: 46, resizeMode: "contain" }} />
                                </TouchableOpacity>
                                :
                                null
                            }
                        </>
                        :
                        null}
                    {this.state.loginType == "phone" ?
                        <>
                            {UserAccessPermission.LOGIN.loginType("phone", this.props) && UserAccessPermission.LOGIN.loginType("userId", this.props) ?
                                <TouchableOpacity onPress={() => onSelectLoginType("userId")} activeOpacity={0.8}>
                                    <Image source={ImageName.BLUE_KEY_ICON} style={{ height: 46, width: 46, resizeMode: "contain" }} />
                                </TouchableOpacity>
                                :
                                null
                            }
                        </>
                        :
                        null}
                    {this.state.loginType == "otp" ?
                        <View style={{ width: "60%" }}>
                            <BigTextButton
                                backgroundColor={Color.COLOR.BLUE.LOTUS_BLUE}
                                text={"Back"}
                                onPress={() => onSelectLoginType("phone")}
                                borderRadius={25}
                            />
                            <View style={{ flex: 1 }} />
                        </View>
                        :
                        null
                    }
                </View>
            )
        }



        const loginButtonSec = () => {
            //__on next button function
            const _onNext = () => {
                this.setState({ loginType: "otp" })
            }

            //__on submit button function
            const _onSubmit = () => {
                startTimer()
            }

            const startTimer = () => {
                // Start the timer
                this.setState({ isTimerStarted: true });
                this.interval = setInterval(() => {
                    this.setState((prevState) => ({
                        timer: prevState.timer - 1
                    }), () => {
                        if (this.state.timer === 0) {
                            stopTimer();
                        }
                    });
                }, 1000);
            }

            const stopTimer = () => {
                clearInterval(this.interval);
                this.setState({ isTimerStarted: false });
            }

            //__login button function


            return (
                <View style={{ flex: 0.4, justifyContent: "flex-end" }}>
                    {this.state.pageLoader ?
                        <Loader type={"normal"} height={40} />
                        :
                        <>
                            {this.state.loginType == "userId" ?
                                <BigTextButton
                                    text={"Login"}
                                    onPress={() => this._onLoginSelect()}
                                    borderRadius={25}
                                />
                                : this.state.loginType == "phone" ?
                                    <BigTextButton
                                        text={"Next"}
                                        onPress={() => _onNext()}
                                        borderRadius={25}
                                    />
                                    :
                                    <BigTextButton
                                        text={"Submit"}
                                        onPress={() => _onSubmit()}
                                        borderRadius={25}
                                    />
                            }
                        </>
                    }

                </View>
            )
        }

        return (
            <View>
                {this.state.loginType == "otp" ?
                    null
                    :
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <View style={{ flex: 0.6, flexDirection: "row" }}>
                            <React.Fragment>
                                <Text style={styles.orLoginByTxt}>OR Login by</Text>
                            </React.Fragment>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => _onForgotPassword()} style={styles.forgotTextView}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                }

                <View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 15 }}>
                    {loginTypeSec()}
                    {loginButtonSec()}
                </View>

            </View>
        )
    }

    contactUsSec = () => {
        //__select contact type
        const onContactSelect = (value, type) => {
            switch (type) {
                case "phone":
                    // Create the tel URL
                    const url = `tel:${value}`;
                    // Open the phone dial pad
                    Linking.openURL(url)
                        .catch(error => console.log('Failed to open phone dial pad:', error));
                    break;
                case "mail":
                    const email = value; // Replace with the recipient email address
                    const subject = ''; // Replace with the desired email subject
                    const body = ''; // Replace with the desired email body
                    // Create the mailto URL
                    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    // Open the email client
                    Linking.openURL(mailUrl)
                        .catch(error => console.log('Failed to open email client:', error));
                    break;
                default:
                    return true;
            };
        }
        return (
            <>
                <View style={styles.underline} />
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                    <Text style={styles.contactHeadingTxt}>Contact</Text>
                    <Text style={styles.contactHeadingSubTxt}>Please contact to our support if you face any issue</Text>
                </View>
                <View style={styles.contactTypeSec} >
                    <TouchableOpacity onPress={() => onContactSelect(7890831532, "phone")} activeOpacity={0.8} style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={ImageName.LOGIN_PHONE_ICON} style={styles.contactIcon} />
                        <Text style={styles.contactPhoneDataTxt}>+91 7890831532</Text>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={() => onContactSelect("support.cliky.com", "mail")} activeOpacity={0.8} style={{ flexDirection: "row", flex: 1 }}>
                        <Image source={ImageName.LOGIN_MAIL_ICON} style={styles.contactIcon} />
                        <Text style={styles.contactMailDataTxt}>info@cliky.com</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    modalSec = () => {

        const closeModal = () => {
            this.setState({ isVisibleModal: false })
        }

        const onSelectCustomer = async (type) => {
            await StorageDataModification.loginUserTypeData(type, "store");
            this.props.loginUserTypeData(type)
            this._onLogin(type)
        }

        const onSelectEmployee = async (type) => {
            await StorageDataModification.loginUserTypeData(type, "store");
            this._onLogin(type)
        }

        return (
            <BottomModal
                isVisible={this.state.isVisibleModal}
                // onRequestClose={() => closeModal()}
                onBackdropPress={() => closeModal()}
                // onBackButtonPress={() => closeModal()}
                children={
                    <View style={styles.modalview}>
                        {this.state.pageLoader ?
                            <View style={{ paddingTop: 30, paddingBottom: 50, }}>
                                <Loader type={"normal"} />
                            </View>
                            :
                            <>
                                <View style={{ paddingTop: 30, paddingBottom: 10, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.loginTypeTxtHead}>Login As</Text>
                                </View>
                                <View style={{ flexDirection: "row", paddingBottom: 50, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => onSelectCustomer("customer")} style={styles.loginBtnCustomer}>
                                        <Text style={styles.loginTypeTxt}>Customer</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 50 }} />
                                    <TouchableOpacity onPress={() => onSelectEmployee("employee")} style={styles.loginBtnEmployee}>
                                        <Text style={styles.loginTypeTxt}>Employee</Text>
                                    </TouchableOpacity>
                                </View>
                            </>

                        }

                    </View>
                }
            />
        )
    }

    //RENDER FUNCTION
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps={"handled"}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.backgroundImageView}>
                        <Image source={ImageName.LOYALTY_APP_ICON} style={styles.backgroundImage} />
                    </View>
                    {this.loginHeadingSec()}
                    <View style={styles.formInputSection}>
                        {UserAccessPermission.LOGIN.loginType("phone", this.props) && this.state.loginType == "phone" ?
                            this.mobileNumberSection()
                            :
                            null
                        }
                        {UserAccessPermission.LOGIN.loginType("userId", this.props) && this.state.loginType == "userId" ?
                            this.userNamePasswordSec()
                            :
                            null
                        }
                        {this.state.loginType == "otp" ?
                            this.otpVerificationSec()
                            :
                            null
                        }
                        {this.alertMessageSec()}
                        {this.loginTypeAndButtonSec()}
                        {this.contactUsSec()}
                    </View>
                    <View style={{ bottom: 0 }}>
                        <Image source={ImageName.LOGIN_FOOTER_IMG} style={styles.footerImg} />
                    </View>
                </ScrollView>
                {this.modalSec()}
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    const { Sales360Redux } = state
    return { Sales360Redux }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        stateCheckForNetwork,
        stateUserInformation,
        stateAllCountries,
        mappedCountriesUserData,
        mappedProductUserData,
        userSelectedBeatRouteData,
        mappedHigherLevelProducts,
        loginData,
        loginUserTypeData
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
