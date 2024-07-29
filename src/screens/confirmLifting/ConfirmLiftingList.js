import React, { Component } from 'react'
import styles from './Style'
import Header from '../header/Header'
import { ProfileSec } from '../../pageShared'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums'
import { BigTextButton, BottomModal, DropdownInputBox, Loader, Modal, NoDataFound, TextInputBox } from '../../shared'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MiddlewareCheck } from '../../services/middleware';
import { customerModifyData, modifyContactTypeArr, modParentCustomerData } from './Function';
import { ErrorCode } from '../../services/constant';
import { StorageDataModification, Toaster } from '../../services/common-view-function';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { App_uri } from '../../services/config';
import _debounce from 'lodash/debounce';
import SvgComponent from '../../assets/svg';


class ConfirmLiftingList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            scrollY: new Animated.Value(0),
            limit: 10,
            pageNum: 0,
            searchText: "",
            customerList: [],
            refreshing: true,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            loginType: "",
            isVisibleFilter: false,
            contactTypeArr: [],
            selectedContactTypeObj: {},
            userInfo: {
                "id": "",
                "custBusinessName": "",
                "address": "",
                "profilePic": "",
                "contactTypeId": "",
                "count": "",
                "lastDate": ""
            }
        }
    }
    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                await this.setInitialState();
                await this.onLoad()
            })
    }

    onLoad = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        this.state.userInfo.id = userInfo.customerId;
        this.state.userInfo.custBusinessName = userInfo.custBusinessName && userInfo.custBusinessName.length > 0 ? userInfo.custBusinessName : userInfo.firstName + " " + userInfo.lastName;
        this.state.userInfo.address = userInfo.address;
        this.state.userInfo.profilePic = userInfo.profileImgUrl == null || userInfo.profileImgUrl == undefined ? "/images/business.jpg" : userInfo.profileImgUrl;
        this.state.userInfo.contactTypeId = userInfo.contactTypeId;
        this.state.userInfo.count = userInfo.count ? userInfo.count : "0";
        this.state.userInfo.lastDate = userInfo.lastDate ? userInfo.lastDate : "";
        this.setState({ refreshing: false, loginType: userInfo.loginType, userInfo: this.state.userInfo });
        await this.onFetchContactType()
        await this.fetchParentCustomer(userInfo);
    }

    fetchParentCustomer = async (userInfo) => {
        // console.log("this.propspspspsp----", JSON.stringify(this.props.route.params.propData.id))
        let reqData = {
            "childId": this.props.route.params.propData.id,
        }
        let responseData = await MiddlewareCheck("fetchParentCustomer", reqData, this.props);
        if (responseData && responseData.response.length > 0) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let parentCustomer = modParentCustomerData(responseData.response[0]);
                // if (custList.customerList.length == 0) {
                this.state.isApiCall = false;
                // }
                this.state.customerList = [parentCustomer];
                this.setState(this.state);
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        } else {
            let dataReq = {
                "limit": this.state.limit.toString(),
                "offset": (this.state.pageNum * this.state.limit).toString(),
                "searchText": this.state.searchText,
                "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                "forCustomer": userInfo.loginType == "customer" ? "1" : "0",
                "toContactTypeId": this.props.route.params.contactTypeData ? this.props.route.params.contactTypeData.id : ""
            }
            await this.fetchCustomerListData(dataReq);
        }
        this.setState({
            pageLoader: false,
            listLoader: false,
        })
    }

    setInitialState = async () => {
        this.setState({
            scrollY: new Animated.Value(0),
            limit: 10,
            pageNum: 0,
            searchText: "",
            customerList: [],
            refreshing: true,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            selectedContactTypeObj: {},
            userInfo: {
                "id": "",
                "custBusinessName": "",
                "address": "",
                "profilePic": "",
                "contactTypeId": "",
                "count": "",
                "lastDate": ""
            }
        })
    }

    fetchCustomerListData = async (dataReq) => {
        this.setState({ refreshing: false })
        let responseData = await MiddlewareCheck("fetchLifterDetails", dataReq, this.props);
        console.log("fetchLifterDetails:::---", JSON.stringify(responseData));
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let custList = customerModifyData(responseData);
                if (custList.customerList.length == 0) {
                    this.state.isApiCall = false;
                }
                this.state.customerList = [...this.state.customerList, ...custList.customerList];
                this.setState(this.state);
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    onFetchContactType = async () => {
        let responseData = await MiddlewareCheck("getCappingContactTypes", { "toContactTypeId": this.props.route.params.contactTypeData ? this.props.route.params.contactTypeData.id : "" }, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.contactTypeArr = modifyContactTypeArr(responseData.response)
                this.setState({
                    contactTypeArr: this.state.contactTypeArr,
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ tabLoader: false })
    }

    onRefresh = async () => {
        await this._onSetChangeData();
        await this.onLoad();
    }

    // for change the state for refrace
    _onSetChangeData = async () => {
        this.setState({
            customerList: [],
            pageLoader: true,
            listLoader: true,
            refreshing: true,
            isApiCall: true,
            limit: 10,
            pageNum: 0,
        })
    }

    onSelectContactType = (val) => {
        this.setState({ selectedContactTypeObj: val })
    }

    onUpdateForm = (item) => {
        this.props.navigation.replace("UpdateLiftingForm", { propData: this.props.route.params.propData, data: item })
    }

    //to render list
    renderContactList = (item, index) => {
        return (
            <View>
                {this.listSection(item, index)}
            </View>
        )
    }

    listSection = (item, key) => {
        return (
            <View key={key}>
                <TouchableOpacity
                    onPress={() => this.onUpdateForm(item)}
                    style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 15, borderWidth: 0.5, borderColor: "#CBCBCB" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <Image source={{ uri: item.profilePic }} style={{ height: 50, width: 50, resizeMode: "contain", borderRadius: 30 }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
                            <View>
                                <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }} numberOfLines={2}>{item.custBusinessName.length > 0 ? item.custBusinessName : item.ownerName}</Text>
                            </View>
                            <View>
                                <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{item.address}</Text>
                            </View>
                            <View>
                                <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: 11 }}>{item.contactTypeName}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>Recent</Text>
                                <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: Color.COLOR.RED.AMARANTH, alignItems: "center", justifyContent: "center", marginLeft: 5 }}>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 10 }}>{item.count}</Text>
                                </View>
                            </View>
                            {item.lastDate.length > 0 ?
                                <View>
                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>Last <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 11 }}>{item.lastDate}</Text></Text>
                                </View>
                                :
                                null}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    debouncedFetchData = _debounce(async () => {
        await this._onSetChangeData();
        let dataReq = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "searchText": this.state.searchText,
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
            "forCustomer": this.state.userInfo.loginType == "customer" ? "1" : "0",
            "toContactTypeId": this.props.route.params.contactTypeData ? this.props.route.params.contactTypeData.id : "",
            "fromContactTypeId": this.state.selectedContactTypeObj.id ? this.state.selectedContactTypeObj.id : ""
        }
        await this.fetchCustomerListData(dataReq);
    }, 400);


    searchSec = () => {
        const headerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, 5], // Adjust the range as needed
            outputRange: [1, 0], // Header opacity will go from 1 to 0 as user scrolls
            extrapolate: 'clamp',
        });
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, 100], // Adjust the range as needed
            outputRange: [50, 0], // Header height will shrink from 50 to 30 as user scrolls
            extrapolate: 'clamp',
        });
        const onSearch = async (val) => {
            this.setState({ searchText: val })
            await this.debouncedFetchData()
        }
        // const onPressSearchIcon = async () => {
        //     await this.onRefresh()
        // }
        const onPressFilterIcon = () => {
            this.setState({ isVisibleFilter: true })
        }
        return (
            // <Animated.View style={{ marginTop: 10, alignItems: 'center', opacity: headerOpacity, height: headerHeight }}>
            <View style={{ marginTop: 10 }}>
                <TextInputBox
                    placeholder={"Search by Name or Number"}
                    isRightIcon={true}
                    fontSize={FontSize.XS}
                    rightIcon={ImageName.FILTER_WITH_SEARCH}
                    rightIconStyle={{ height: 28, width: 28, marginRight: 10 }}
                    height={42}
                    borderRadius={22}
                    value={this.state.searchText}
                    onChangeText={(value) => onSearch(value)}
                    onPressRightIcon={() => onPressFilterIcon()}
                />
            </View>
            // </Animated.View>
        )
    }

    headerSec = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 5 }}>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Lifting From</Text>
                </View>
                <View style={{ flex: 1 }} />
                {/* <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.9} onPress={() => this.onFilter()}>
                    <Image source={ImageName.FILTER_WITH_SEARCH} style={{ height: 24, width: 24, resizeMode: "contain" }} />
                </TouchableOpacity> */}
            </View>
        )
    }

    // loader for scroll
    renderLoader = () => {
        return this.state.listLoader ? (
            <View style={{ marginBottom: 700 }}>
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 700 }} />
        );
    };

    ViewSkeletonPlaceholder = () => {
        let resData = [];
        for (let i = 0; i < 7; i++) {
            resData.push(
                <View style={[styles.mainBox, { marginVertical: 10 }]} key={i}>
                    <View style={styles.blueBox} />
                </View>
            )
        }
        return resData;
    }
    // fetch more
    fetchMore = async () => {
        if (this.state.listLoader) {
            return null;
        }
        this.setState(
            (prevState) => {
                return { listLoader: true, pageNum: prevState.pageNum + 1 };
            },
            () => {
                if (this.state.isApiCall) {
                    this.onLoad();
                } else {
                    this.setState({ listLoader: false })
                    return null;
                }
            }
        );
    };

    ownDetails = () => {
        return (
            <TouchableOpacity
                onPress={() => this.onUpdateForm(this.state.userInfo)}
                style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 15, borderWidth: 0.5, borderColor: Color.COLOR.RED.AMARANTH }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                        <Image source={{ uri: App_uri.AWS_S3_IMAGE_VIEW_URI + this.state.userInfo.profilePic }} style={{ height: 50, width: 50, resizeMode: "contain", borderRadius: 30 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
                        <View>
                            <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }} numberOfLines={2}>{this.state.userInfo.custBusinessName}</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{this.state.userInfo.address}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 15, paddingHorizontal: 20, paddingVertical: 10 }}>
                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 14 }}>Self</Text>
                        </View>
                        {/* <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>Recent</Text>
                            <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: Color.COLOR.RED.AMARANTH, alignItems: "center", justifyContent: "center", marginLeft: 5 }}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 10 }}>{item.count}</Text>
                            </View>
                        </View>
                        {item.lastDate.length > 0 ?
                            <View>
                                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>Last <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 11 }}>{item.lastDate}</Text></Text>
                            </View>
                            :
                            null} */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onCloseFilter = () => {
        this.setState({ isVisibleFilter: false })
    }

    onReset = async () => {
        this.onCloseFilter()
        await this._onSetChangeData()
        let dataReq = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "searchText": this.state.searchText,
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
            "forCustomer": this.state.userInfo.loginType == "customer" ? "1" : "0",
            "toContactTypeId": this.props.route.params.contactTypeData ? this.props.route.params.contactTypeData.id : ""
        }
        await this.fetchCustomerListData(dataReq);
    }

    onFilter = async () => {
        this.onCloseFilter()
        await this._onSetChangeData()
        let dataReq = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "searchText": this.state.searchText,
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
            "forCustomer": this.state.userInfo.loginType == "customer" ? "1" : "0",
            "toContactTypeId": this.props.route.params.contactTypeData ? this.props.route.params.contactTypeData.id : "",
            "fromContactTypeId": this.state.selectedContactTypeObj.id ? this.state.selectedContactTypeObj.id : ""
        }
        await this.fetchCustomerListData(dataReq);
    }

    modalSec = () => {
        return (
            <>
                <Modal
                    isVisible={this.state.isVisibleFilter}
                    onRequestClose={() => this.onCloseFilter(false)}
                    onBackdropPress={() => this.onCloseFilter(false)}
                    onBackButtonPress={() => this.onCloseFilter(false)}
                    children={
                        <View style={styles.modalview}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
                                    <Text style={{ flex: 1, color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Advance Search</Text>
                                    <TouchableOpacity onPress={() => this.onCloseFilter()} >
                                        <SvgComponent svgName={"cross"} strokeColor={"#000"} height={15} width={15} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                                    <DropdownInputBox
                                        selectedValue={this.state.selectedContactTypeObj.id ? this.state.selectedContactTypeObj.id.toString() : "0"}
                                        data={this.state.contactTypeArr}
                                        onSelect={(value) => this.onSelectContactType(value)}
                                        headerText={"Select Option"}
                                        additionalBoxStyle={{ backgroundColor: Color.COLOR.WHITE.WHITE_SMOKE, borderRadius: 10 }}
                                        isBackButtonPressRequired={true}
                                        isBackdropPressRequired={true}
                                        unSelectedTextColor={"#5F5F5F"}
                                        selectedTextColor={"#1F2B4D"}
                                        fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                        borderRadius={25}
                                        isSearchable={true}
                                    />
                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                        <BigTextButton
                                            text={"Reset"}
                                            fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                                            fontSize={FontSize.SM}
                                            fontColor={"#000"}
                                            borderRadius={30}
                                            isLinearGradient={true}
                                            gradientColors={["#fff", "#dfdfdf"]}
                                            additionalStyles={{ borderColor: "#000", borderWidth: 0.8 }}
                                            onPress={() => this.onReset()}
                                        />
                                        <View style={{ width: 55 }} />
                                        <BigTextButton
                                            isLinearGradient={true}
                                            gradientColors={["#C5C91E", "#3AB500"]}
                                            text={"Search"}
                                            fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                                            fontSize={FontSize.SM}
                                            borderRadius={30}
                                            start={{ x: 1, y: 0.3 }}
                                            end={{ x: 0.5, y: 1 }}
                                            onPress={() => this.onFilter()}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                />
            </>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <Header {...this.props} onRefresh={() => console.log("")} />
                    <ProfileSec props={this.props} />
                    <View style={{ marginHorizontal: 15 }}>
                        {this.headerSec()}
                        {this.searchSec()}
                        {this.state.loginType == "customer" ? this.ownDetails() : null}
                        {this.state.pageLoader ?
                            <View >
                                <SkeletonPlaceholder>
                                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                        {this.ViewSkeletonPlaceholder()}
                                    </ScrollView>
                                </SkeletonPlaceholder>
                            </View> :
                            <React.Fragment>
                                {this.state.customerList.length > 0 ?
                                    <React.Fragment >
                                        <View style={{ marginBottom: 60 }}>
                                            <FlatList
                                                data={this.state.customerList}
                                                renderItem={({ item, index }) => this.renderContactList(item, index)}
                                                keyExtractor={(item, index) => index}
                                                onEndReached={this.fetchMore}
                                                onEndReachedThreshold={0.1}
                                                ListFooterComponent={this.renderLoader}
                                                // showsHorizontalScrollIndicator={false}
                                                // showsVerticalScrollIndicator={false}
                                                refreshControl={
                                                    <RefreshControl
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={() => this.onRefresh()}
                                                    />
                                                }
                                            />
                                        </View>
                                    </React.Fragment>
                                    :
                                    // <React.Fragment>
                                    //     <View style={{ marginTop: 20, height: Dimension.height }}>
                                    //         <NoDataFound />
                                    //     </View>
                                    // </React.Fragment>
                                    null
                                }
                            </React.Fragment>
                        }

                    </View>
                </KeyboardAvoidingView>
                {this.modalSec()}
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => {
    const { Sales360Redux } = state;
    return { Sales360Redux };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        stateCheckForNetwork,
        stateUserInformation,
        userSelectedBeatRouteData
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmLiftingList);
