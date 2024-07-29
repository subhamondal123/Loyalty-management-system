import React, { Component } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Header from '../header/Header'
import { ActivePointAndLocationSelectionTab, AllCustomerList, AllInfluencerList, DynamicCategoryTab } from '../../pageShared'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './Style';
import { StorageDataModification, Toaster } from '../../services/common-view-function';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { TextInputBox } from '../../shared';
import { FontFamily, FontSize, ImageName } from '../../enums';
import { modifyCustomerTypeArr } from './Function';
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware';
import { ErrorCode } from '../../services/constant';

class CustomerList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabData: [],
            tabLoader: true,
            selectedLocationObj: {},
            requestApiData: {
                "searchText": "",
                "selectedCustomerType": {}
            },
            searchText: "",
            selectedCustomerObj: {},
            selectedScreen: "",
            listLoader: false,

            scrollY: new Animated.Value(0),
            headerHeight: new Animated.Value(50),
            userCredentialData: {
                "id": "",
                "customerName": "",
                "custBusinessName": "",
                "name": "",
                "phone": "",
                "contactTypeName": "",
                "contactTypeId": "",
                "organizationName": "",
                "profilePic": "",
                "address": "",
                "ownerName": "",
                "customerAccessTypeName": "",
            }
        }
    }

    componentDidMount = async () => {
        let locationData = await StorageDataModification.locationMappedData({}, "get");
        console.log("locationData::::-----", JSON.stringify(locationData));
        StoreUserOtherInformations("", {}, this.props);
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        await this.setUserCredentialData()
        // await this.onFetchCustomerType()
        await this.onFetchContactType()
        this.setState({ selectedScreen: this.props.route.params ? this.props.route.params.data : "" })
        // })
    }
    // componentWillUnmount() {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }

    setUserCredentialData = async () => {
        let userData = await StorageDataModification.userCredential({}, "get")
        this.state.userCredentialData.id = userData.userId
        this.state.userCredentialData.customerName = userData.firstName + " " + userData.lastName
        this.state.userCredentialData.custBusinessName = userData.firstName + " " + userData.lastName
        this.state.userCredentialData.ownerName = userData.firstName + " " + userData.lastName
        this.state.userCredentialData.phone = userData.phoneNumber
        this.state.userCredentialData.contactTypeName = userData.contactTypeName
        this.state.userCredentialData.contactTypeId = userData.contactTypeId
        this.state.userCredentialData.profilePic = userData.profileImgUrl
        this.state.userCredentialData.address = userData.lastLevelLocations.hmName
        this.state.userCredentialData.customerAccessTypeName = userData.customerAccessTypeName

        this.setState(this.state)
    }

    // onFetchCustomerType = async () => {

    //     let favouriteObj = {
    //         id: "",
    //         name: "Favourite",
    //         check: true
    //     }
    //     this.setLoader(true)
    //     let responseData = await MiddlewareCheck("getContactTypes_v2", { "isProject": "" }, this.props);
    //     if (responseData) {
    //         if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
    //             this.state.tabData = modifyCustomerTypeArr(responseData.response)
    //             const selectedCustomerObj = this.state.tabData.find(obj => obj.check === true);
    //             console.log("selectedCustomerObj-----", selectedCustomerObj)
    //             this.state.requestApiData.selectedCustomerType = selectedCustomerObj;
    //             this.setState({
    //                 // tabData: [favouriteObj, ...this.state.tabData]
    //                 tabData: this.state.tabData,
    //                 // selectedCustomerObj: selectedCustomerObj,
    //                 requestApiData: this.state.requestApiData
    //             })
    //         } else {
    //             Toaster.ShortCenterToaster(responseData.message)
    //         }
    //     }
    //     this.setState({ tabLoader: false ,listLoader:false})
    //     StoreUserOtherInformations("", {}, this.props);
    // }

    onFetchContactType = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");

        let reqData = {
            "fromContactTypeId": this.props.Sales360Redux.loginData.loginType == "employee" ? null : userInfo.contactTypeId,
            "isCustomer": this.props.Sales360Redux.loginData.loginType == "employee" ? "0" : "1"
        }
        await this.setLoader(true)
        let responseData = await MiddlewareCheck("getCappingContactTypes", reqData, this.props);
        console.log("getCappingContactTypes:::resss------", JSON.stringify(responseData));
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.tabData = modifyCustomerTypeArr(responseData.response)
                if (this.state.tabData.length > 0) {
                    const selectedCustomerObj = this.state.tabData.find(obj => obj.check === true);
                    this.state.requestApiData.selectedCustomerType = selectedCustomerObj
                    this.state.selectedCustomerObj = selectedCustomerObj
                }
                ;
                this.setState({
                    // tabData: [favouriteObj, ...this.state.tabData]
                    tabData: this.state.tabData,
                    selectedCustomerObj: this.state.selectedCustomerObj,
                    requestApiData: this.state.requestApiData
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ tabLoader: false })
        await this.setLoader(false)
        StoreUserOtherInformations("", {}, this.props);
    }

    onSelectLocation = async (val) => {
        console.log("location val======", JSON.stringify(val));
        await this.setLoader(true)
        let modObj = {
            "SlNo": "",
            "check": val.check,
            "hierarchyDataId": val.hierarchyDataId,
            "hierarchyTypeId": val.hierarchyTypeId,
            "hmName": val.hmName,
            "hmTypDesc": val.hmTypDesc
        }
        this.state.selectedLocationObj = modObj;
        // this.state.selectedCustomerObj = {}
        this.state.searchText = ""
        this.state.requestApiData.searchText = ""
        this.setState(this.state)
        this.props.userSelectedBeatRouteData(modObj);
        await StorageDataModification.routeData(modObj, "store");
        await this.setLoader(false)
    }

    setLoader = async (type) => {
        this.setState({ listLoader: type })
    }

    onSelectProfile = (item) => {
        // this.props.navigation.navigate(this.state.selectedScreen == "SalesConfirmation" && item.contactTypeName == "Dealer" ? "GetSalesConfirmation" : this.state.selectedScreen, { propData: item })
        // if (this.state.requestApiData.selectedCustomerType.mstSlNo == 1) {
        //     // this.props.navigation.navigate("ConfirmLiftingListForCustomer", { propData: item })
        // } else {
        this.props.navigation.navigate(this.state.selectedScreen, { propData: item, contactTypeData: this.state.requestApiData.selectedCustomerType ? this.state.requestApiData.selectedCustomerType : {} })
        // }
    }

    onSelectInfluencer = async (item) => {
        // let reqData = {
        //     "refUserId": item.id.toString()
        // }
        // let responseData = await MiddlewareCheck("checkSameDayLifting", reqData, this.props);
        // console.log("responseDatra===", responseData)
        // if (responseData) {
        //     if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        //         if (responseData.response) {
        //             Toaster.ShortCenterToaster("Lifting Data already updated. You can do it again tomorrow.");
        //         } else {
        this.props.navigation.navigate("ConfirmNewLifting", { propData: item, contactTypeData: this.state.requestApiData.selectedCustomerType ? this.state.requestApiData.selectedCustomerType : {} })
        //         }
        //     }
        // }
        // ConfirmNewLifting
        // if (this.props.route.params.data == "ConfirmLiftingListForCustomer") {

        // } else {
        // this.props.navigation.navigate("ConfirmNewLifting", { propData: item })
        // }
    }

    tabSec = () => {

        const headerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, 1], // Adjust the range as needed
            outputRange: [1, 0], // Header opacity will go from 1 to 0 as user scrolls
            extrapolate: 'clamp',
        });
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, 100], // Adjust the range as needed
            outputRange: [50, 0], // Header height will shrink from 50 to 30 as user scrolls
            extrapolate: 'clamp',
        });

        const tabSelect = async (item, key) => {
            await this.setLoader(true)
            let tabData = this.state.tabData;
            for (let i = 0; i < tabData.length; i++) {
                if (i == key) {
                    tabData[i].check = true;
                } else {
                    tabData[i].check = false;
                }
            }
            // this.setState({ tabData: tabData, selectedCustomerObj: item })
            this.state.requestApiData.searchText = this.state.searchText;
            this.state.requestApiData.selectedCustomerType = item;
            this.setState({
                requestApiData: this.state.requestApiData,
                tabData: tabData,
                selectedCustomerObj: item
            })
            await this.setLoader(false)
        }

        const skelitonPlaceHolder = () => {
            return (
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                        <View style={{ height: 30, width: 80, marginHorizontal: 5, borderRadius: 20 }} />
                        <View style={{ height: 30, width: 80, marginHorizontal: 5, borderRadius: 20 }} />
                        <View style={{ height: 30, width: 80, marginHorizontal: 5, borderRadius: 20 }} />
                        <View style={{ height: 30, width: 80, marginHorizontal: 5, borderRadius: 20 }} />
                    </View>
                </SkeletonPlaceholder>
            )
        }
        return (
            <>
                {/* <Animated.View style={{ marginTop: 10, marginHorizontal: 15, opacity: headerOpacity, maxHeight: headerHeight }}>
                    {this.state.tabLoader ?
                        <>
                            {skelitonPlaceHolder()}
                        </>
                        :
                        <>
                            {this.state.tabData.length > 0 ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                    <View style={{ flexDirection: "row" }}>
                                        {this.state.tabData.map((item, key) => (
                                            <View style={{ marginRight: 5, marginVertical: 5, flexDirection: "row", }} key={key}>
                                                <DynamicCategoryTab
                                                    data={item}
                                                    onSelectedTab={() => tabSelect(item, key)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                </ScrollView>
                                :
                                null
                            }
                        </>
                    }
                </Animated.View> */}
                <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                    {this.state.tabLoader ?
                        <>
                            {skelitonPlaceHolder()}
                        </>
                        :
                        <>
                            {this.state.tabData.length > 0 ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                    <View style={{ flexDirection: "row" }}>
                                        {this.state.tabData.map((item, key) => (
                                            <View style={{ marginRight: 5, marginVertical: 5, flexDirection: "row", }} key={key}>
                                                <DynamicCategoryTab
                                                    data={item}
                                                    onSelectedTab={() => tabSelect(item, key)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                </ScrollView>
                                :
                                null
                            }
                        </>
                    }
                </View>
            </>
        )
    }

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
        const onSearch = (val) => {
            this.setState({ searchText: val })
        }
        const onPressSearchIcon = async () => {
            await this.setLoader(true)
            console.log("this.state.selectedCustomerObj", this.state.selectedCustomerObj)
            this.state.requestApiData.searchText = this.state.searchText;
            this.state.requestApiData.selectedCustomerType = this.state.selectedCustomerObj;
            console.log("this.state.requestApiData.selectedCustomerType======", this.state.requestApiData.selectedCustomerType)
            this.setState({
                requestApiData: this.state.requestApiData
            })
            await this.setLoader(false)
        }
        return (
            <Animated.View style={{ marginTop: 10, alignItems: 'center', marginHorizontal: 15, opacity: headerOpacity, height: headerHeight }}>
                {/* <View style={{ flex: 1 }}> */}
                <TextInputBox
                    placeholder={"Search Customer Name or Number"}
                    isRightIcon={true}
                    fontSize={FontSize.XS}
                    rightIcon={ImageName.SEARCH_IMG}
                    rightIconStyle={{ height: 45, width: 45 }}
                    height={42}
                    borderRadius={22}
                    value={this.state.searchText}
                    onChangeText={(value) => onSearch(value)}
                    onPressRightIcon={() => onPressSearchIcon()}
                />
                {/* </View> */}
            </Animated.View>
        )
    }

    onSelf = () => {
        this.props.navigation.navigate(this.state.selectedScreen, { propData: this.state.userCredentialData })

    }

    buttonSec = () => {
        return (
            <TouchableOpacity style={{ paddingHorizontal: 100, marginVertical: 10 }} onPress={() => this.onSelf()}>
                <View style={{ backgroundColor: "red", justifyContent: "center", alignItems: "center", paddingVertical: 10, borderRadius: 25 }}>
                    <Text style={{ color: "white", fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>For Self</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {/* <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                > */}
                <Header {...this.props} onRefresh={() => console.log("")} onApplyFilter={() => console.log("")} onResetFilter={() => console.log("")} onPressNotification={() => this.onNotification()} />
                <ActivePointAndLocationSelectionTab {...this.props} selectedLocation={(value) => this.onSelectLocation(value)} isVisibleActivePoint={false} />
                {this.tabSec()}
                {this.searchSec()}
                {/* {this.props.Sales360Redux.loginData.loginType == "employee" ? null : this.buttonSec()} */}
                {
                    this.state.listLoader ?
                        null :
                        <>
                            {this.state.requestApiData && this.state.requestApiData.selectedCustomerType.mstSlNo == 4 ?
                                <AllInfluencerList
                                    {...this.props}
                                    requestData={this.state.requestApiData}
                                    scrollY={this.state.scrollY}
                                    // isVisibleLocation={false}
                                    // isVisibleUserType={false}export default connect(mapStateToProps, mapDispatchToProps)(AllCustomerList);
                                    onSelect={(item) => this.onSelectInfluencer(item)}
                                />
                                :
                                <AllCustomerList
                                    {...this.props}
                                    requestData={this.state.requestApiData}
                                    scrollY={this.state.scrollY}
                                    // isVisibleLocation={false}
                                    // isVisibleUserType={false}export default connect(mapStateToProps, mapDispatchToProps)(AllCustomerList);
                                    onSelect={(item) => this.onSelectProfile(item)}
                                />
                            }
                        </>
                }
                {/* </KeyboardAvoidingView> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);