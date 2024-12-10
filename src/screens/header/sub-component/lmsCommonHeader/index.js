
import React from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userAttendanceData } from "../../../../redux/Sales360Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Color, ImageName } from "../../../../enums";
import { DateConvert, StorageDataModification, Toaster } from "../../../../services/common-view-function";
import { App_uri } from "../../../../services/config";
import { ErrorCode } from "../../../../services/constant";
import { MiddlewareCheck, StoreUserOtherInformations } from "../../../../services/middleware";
import { DropdownInputBox, LogOutModal, Modal, NormalLoader } from "../../../../shared";
import styles from "./style";
import { getModData, modifyAttendanceData } from "./function";
import { CommonActions } from "@react-navigation/native";
import { UserAccessPermission } from "../../../../services/userPermissions";
import SvgComponent from "../../../../assets/svg";

class LmsCommonHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headerText: "",
            isVisibleModal: false,
            isSuccessAttendance: false,
            pageLoader: false,
            attendanceLoader: true,
            attendanceSuccessLoader: false,
            isAttendancePermission: true,

            attendanceDropDownArr: [],
            attendanceDropDownObj: {},
            showDropDown: false,
            logoutModal: false,
            logOutLoader: false,
            userGeneralData: {},
            isAttendanceModal: false,
            userData: {},
            permissionData: {
                attendance: {}
            },

            attendanceModalViewLoader: false,
            // attendanceModalViewLoader: Object.keys(this.props.Sales360Redux.userInfo).length > 0 ? false : true
        }
    }

    componentDidMount = async () => {
        this.state.permissionData.attendance = await UserAccessPermission.ATTENDANCE.attendancePermission(this.props)
        this.setState(this.state)
        await this._load();
    }

    // componentWillUnmount() {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }


    _load = async () => {
        // this._getUserInfoFromApi();
        // let userMainData = await StorageDataModification.userCredential({}, "get");
        // this.setState({ userData: userMainData })
        StoreUserOtherInformations("", {}, this.props);
    }

    _onProfile = () => {
        this.props.navigation.navigate("ProfilePage")
    }


    _onToggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    // for notification page
    _onNotification = () => {
        this.props.navigation.navigate("Notification");
    }

    _onSelectExpenceType = async (value) => {
        this.setState({

            attendanceDropDownObj: value
        })
    }

    // for visiblr attendance
    _onAttendanceVisible = () => {
        this.state.isSuccessAttendance = !this.state.isSuccessAttendance;
        this.setState({
            isSuccessAttendance: this.state.isSuccessAttendance
        })
    }

    // for header name set
    setHeaderText = () => {
        let headerText = "";
        if (this.props.route) {
            if (this.props.route.name == "Dashboard") {
                headerText = "Dashboard";
            } else if (this.props.route.name == "TaskList") {
                headerText = "Task Management";
            } else if (this.props.route.name == "ContactListPage") {
                headerText = "Contact Management";
            } else if (this.props.route.name == "OrganizationList") {
                headerText = "Organizations";
            } else if (this.props.route.name == "LeadsList") {
                headerText = "Leads Management";
            } else if (this.props.route.name == "OpportunityList") {
                headerText = "Opportunity";
            } else if (this.props.route.name == "EnquiryList") {
                headerText = "Enquiry";
            } else if (this.props.route.name == "MyActivity") {
                headerText = "My Activity";
            } else if (this.props.route.name == "MmsEventList") {
                headerText = "Meetings";
            }
        }
        return headerText;
    }

    _onAttendanceModal = () => {
        this.setState({
            isAttendanceModal: !this.state.isAttendanceModal
        })
    }

    // for logout section
    _onLogoutModal = () => {
        this.setState({
            logoutModal: !this.state.logoutModal
        })
    }
    modalSec = () => {
        // for logout api call
        const _onLogout = async () => {
            this.setState({ logOutLoader: true });

            // if (this.props.Sales360Redux.loginData.loginType == "employee") {
            let responseData = await MiddlewareCheck("logout", {});
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                await StorageDataModification.removeLoginData();
                await StorageDataModification.removeAllStorageData();
                this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
            } else {
                Toaster.ShortCenterToaster(responseData.message);
            }
            // } else {
            //     let responseData = await MiddlewareCheck("customerLogout", {});
            //     if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            //         await StorageDataModification.removeLoginData();
            //         await StorageDataModification.removeAllStorageData();
            //         this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LogIn' }] }));
            //     } else {
            //         Toaster.ShortCenterToaster(responseData.message);
            //     }
            // }

            this.setState({ logOutLoader: false, logoutModal: false });
        }

        return (
            <>
                <LogOutModal
                    isVisible={this.state.logoutModal}
                    isLoading={this.state.logOutLoader}
                    onCloseModal={() => this._onLogoutModal()}
                    onLogout={() => _onLogout()}
                />
            </>

        )
    }


    onNotification = () => {
        this.props.onNotificationData()
    }

    render() {

        let profileCheck = false;
        let userImg = ImageName.PROFILE_GRAY;
        if (this.state.pageLoader == false) {
            if (this.props.Sales360Redux.userInfo == undefined || this.props.Sales360Redux.userInfo == null) {
                userImg = ImageName.PROFILE_GRAY;
            } else {
                if (Object.keys(this.props.Sales360Redux.userInfo).length > 0) {
                    if (this.props.Sales360Redux.userInfo.details == undefined || this.props.Sales360Redux.userInfo.details == null || (Object.keys(this.props.Sales360Redux.userInfo.details).length) == 0) {
                    } else {
                        if (this.props.Sales360Redux.userInfo.details.profileImgUrl == undefined || this.props.Sales360Redux.userInfo.details.profileImgUrl == null || this.props.Sales360Redux.userInfo.details.profileImgUrl.length == 0) {
                        } else {
                            userImg = this.props.Sales360Redux.userInfo.details.profileImgUrl;
                            profileCheck = true;
                        }
                    }
                }
            }

        }
        let headerText = this.setHeaderText();
        return (
            <View style={styles.headerContainer}>
                {this.modalSec()}
                <>
                    <View style={styles.gamificationMainView}>
                        <View
                            style={styles.drawerIconSection}
                            activeOpacity={0.9}
                            onPress={() => this._onToggleDrawer()}>
                            <Image source={ImageName.LMS_DASH_LOGO} style={styles.gamificationDrawerIcon} />
                        </View>

                        <View style={{ flex: 1 }} />
                        <View style={{ borderRadius: 100, borderWidth: 2, borderColor: "#F13748", padding: 2 }}>
                            <TouchableOpacity style={[styles.gamificationProfileImgView, profileCheck ? {} : { borderWidth: 1, borderColor: Color.COLOR.GRAY.GRAY_COLOR, }]} activeOpacity={0.8}
                                onPress={this._onProfile}>
                                <Image source={{ uri: profileCheck ? App_uri.AWS_S3_IMAGE_VIEW_URI + userImg : userImg }} style={styles.gamificationProfileImg} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ height: 23, width: 23, borderRadius: 100, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginHorizontal: 15 }} onPress={() => this._onLogoutModal()} activeOpacity={0.7}>
                            <View style={{ borderRadius: 100, borderWidth: 2, borderColor: "#F13748", padding: 2 }}>

                                <Image source={ImageName.LOGOUT_BLUE} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => this.onNotification()} style={{ borderRadius: 100, borderWidth: 0.5, borderColor: "#D1D1D1", padding: 5, marginLeft: 20 }}>
                            <SvgComponent svgName={"log"} strokeColor={"#1F2B4D"} height={30} width={30} />
                        </TouchableOpacity> */}

                    </View>
                </>

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { Sales360Redux } = state;
    return { Sales360Redux };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        stateAllCountries,
        stateCheckForNetwork,
        stateUserInformation,
        userAttendanceData
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LmsCommonHeader);