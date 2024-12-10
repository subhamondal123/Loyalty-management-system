
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Color, FontFamily, FontSize, ImageName } from "../../../../enums";
import { StorageDataModification } from "../../../../services/common-view-function";
import styles from "./style";
import SvgComponent from "../../../../assets/svg";
import { showHideIcon } from "./function";
import { Filter } from "../../../../pageShared";
// import { Filter, VisitFilterModal } from "../../../../pageShared";

class LmsHeaderWithFilter extends React.Component {
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

            isVisibleFilter: false
        }
    }

    componentDidMount() {
        this._load();
    }

    // componentWillUnmount() {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }

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

    _onLogoutModal = () => {
        this.setState({
            logoutModal: !this.state.logoutModal
        })
    }

    filterModal = () => {
        this.setState({ isVisibleFilter: !this.state.isVisibleFilter })

    }

    onApplyFilterData = (data) => {
        this.props.onApplyFilter(data)
    }

    onResetData = () => {
        this.props.onResetFilter()
    }

    onNotification = () => {
        this.props.onNotificationData()
    }

    modalSec = () => {
        return (
            <>
                <Filter isVisible={this.state.isVisibleFilter} onCloseModal={() => this.filterModal()} props={this.props} onFilter={(data) => this.onApplyFilterData(data)} onDataReset={() => this.onResetData()}/>
            </>
        )
    }

    render() {
        const isVisibleIcon = showHideIcon(this.props);
        return (
            <View style={styles.headerContainer}>
                <View style={styles.gamificationMainView}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.goBack()}>
                        <SvgComponent svgName={"back"} strokeColor={"#1F2B4D"} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginHorizontal: 10 }} >
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.SM }}>{this.props.headerText}</Text>
                    </View>

                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => this.filterModal()}>
                        <SvgComponent svgName={"lmsFilter"} strokeColor={"#1F2B4D"} />
                    </TouchableOpacity>
                    {isVisibleIcon.isVisibleBellIcon ?
                        <TouchableOpacity onPress={() => this.onNotification()} style={{ borderRadius: 100, borderWidth: 0.5, borderColor: "#D1D1D1", padding: 5 }}>
                            <SvgComponent svgName={"notification"} strokeColor={"#1F2B4D"} height={24} width={24} />
                        </TouchableOpacity>
                        : null
                    }

                </View>
                {this.modalSec()}
            </View>
        )
    }
}

export default LmsHeaderWithFilter;