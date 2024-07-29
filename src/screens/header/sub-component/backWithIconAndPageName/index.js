
import React from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Color, FontFamily, FontSize, ImageName } from "../../../../../enums";
import { DateConvert, StorageDataModification, Toaster } from "../../../../services/common-view-function";
import { App_uri } from "../../../../../services/config";
import { ErrorCode } from "../../../../../services/constant";
import { MiddlewareCheck, StoreUserOtherInformations } from "../../../../../services/middleware";
import { DropdownInputBox, LogOutModal, LottyViewLoad, Modal, NormalLoader } from "../../../../../shared";
import { CustomStyle } from "../../../../style";
import styles from "./style";
import { getIconName, getModData, modifyAttendanceData } from "./function";
import { CommonActions } from "@react-navigation/native";
import SvgComponent from "../../../../../assets/svg";

class BackWithIconAndPageName extends React.Component {
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
        }
    }

    componentDidMount() {
        this._load();
    }

  

    _load = async () => {
    }


    // for network errror
    _onNetworkError = async () => {
        let headerData = await StorageDataModification.headerData({}, "get")
        if (headerData !== null || headerData !== undefined) {
            this.setState({ pageLoader: true });
            this.props.stateUserInformation(headerData);
            this.setState({ pageLoader: false });
        }
    }

    render() {

        // let headerText = this.setHeaderText();
        return (
            <View style={styles.headerContainer}>
                <View style={styles.gamificationMainView}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.goBack()}>
                        <SvgComponent svgName={"back"} strokeColor={"#1F2B4D"} />
                    </TouchableOpacity>
                    <View style={styles.drawerIconSection}>
                        <SvgComponent svgName={getIconName(this.props)} strokeColor={"#fff"} height={16} width={16} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10 }} >
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.SM }}>{this.props.headerText}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default BackWithIconAndPageName;