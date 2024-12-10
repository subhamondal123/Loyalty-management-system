import React, { Component } from 'react'
import { Image, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { ActivePointCard, DynamicCategoryTab, LmsCustomerActivitySelectionTab, LmsDashboardChart } from '../../pageShared'
import { Text } from 'react-native'
import Header from '../header/Header'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import styles from './Style'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums'
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { modMonthlyPointData, modRecentLiftingData } from './Function'
import { DateConvert, StorageDataModification } from '../../services/common-view-function'


const tabData = [
    {
        id: 1,
        name: "Confirm Sales",
        check: false
    },
    {
        id: 2,
        name: "Add New \n Lifting",
        check: false,
        image: ImageName.ADD_NEW_LIFTING
    },
    // {
    //     id: 3,
    //     name: "Refer a customer",
    //     check: false
    // },

]

const activityData = [
    // {
    //     id: 1,
    //     name: "Passbook",
    //     check: false,
    //     image: ImageName.PASSBOOK
    // },
    {
        id: 2,
        name: "Add New \n Lifting",
        check: false,
        image: ImageName.ADD_NEW_LIFTING
    },
    {
        id: 3,
        name: "Customer \n Registration",
        check: false,
        image: ImageName.CUSTOMER_REGISTRATION
    },
    {
        id: 4,
        name: "Request \n Reeemption",
        check: false,
        image: ImageName.REQUEST_REDEEM
    },
    {
        id: 5,
        name: "Catalogue",
        check: false,
        image: ImageName.CALENDAR_VISIT
    },
    {
        id: 6,
        name: "Passbook & Redemption",
        check: false,
        image: ImageName.COINS
    },
]

const influencerActivityData = [

    {
        id: 4,
        name: "Request \n Reeemption",
        check: false,
        image: ImageName.REQUEST_REDEEM
    },
    {
        id: 5,
        name: "Catalogue",
        check: false,
        image: ImageName.CALENDAR_VISIT
    },
    {
        id: 6,
        name: "Passbook & Redemption",
        check: false,
        image: ImageName.COINS
    },
]

export default class LmsDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabData: tabData,
            tabLoader: false,
            chartData: {},
            chartLoader: true,
            pointLoader: true,
            refreshing: true,
            activityOptionData: [],
            totalMtd: "",
            recentLiftingData: [],
            recentLoader: false,
            monthlyPointDataArr: [],
            graphLoader: true,
            userInfo: {}
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                let userInfo = await StorageDataModification.userCredential({}, "get");
                this.setState({ userInfo: userInfo })
                this.load()
            })
    }
    load = async () => {
        this.setState({ refreshing: false, })
        StoreUserOtherInformations("", {}, this.props);
        await this.setInitialState()
        await this.setTabData();
        await this.getChartData()
        // await this.setTabLoader(false)
        // await this.setPointLoader(false)
        await this.setChartLoader(false)
        await this.fetchRecentSecondarySalesList();
        await this.fetchMonthWisePoint();
    }

    setTabData = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        // if (userInfo.mstSlNo != "4") {
        this.setState({ activityOptionData: activityData })
        // } 
        // else {
        //     this.setState({ activityOptionData: influencerActivityData })
        // }
    }

    fetchMonthWisePoint = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        let reqData = {
            "refCustomerId": userInfo.customerId.toString(),
            "refUserId": userInfo.customerId.toString(),
        }
        let responseData = await MiddlewareCheck("getMonthWisePoint", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = [
                    {
                        "point": "200",
                        "month": "Apr"
                    },
                    // {
                    //     "point": "270",
                    //     "month": "May"
                    // },
                    // {
                    //     "point": "50",
                    //     "month": "June"
                    // },
                    // {
                    //     "point": "210",
                    //     "month": "July"
                    // },
                    // {
                    //     "point": "70",
                    //     "month": "Aug"
                    // },
                    // {
                    //     "point": "350",
                    //     "month": "Sept"
                    // },
                    // {
                    //     "point": "10",
                    //     "month": "Oct"
                    // },
                    // {
                    //     "point": "70",
                    //     "month": "Nov"
                    // },
                    // {
                    //     "point": "3500",
                    //     "month": "Dec"
                    // },
                    // {
                    //     "point": "1010",
                    //     "month": "Jan"
                    // },
                    // {
                    //     "point": "500",
                    //     "month": "Feb"
                    // },
                    // {
                    //     "point": "910",
                    //     "month": "Mar"
                    // }
                ]
                // let modifyData = modMonthlyPointData(modData);

                let modifyData = modMonthlyPointData(responseData.response);
                this.setState({ monthlyPointDataArr: modifyData })
            }
        }
        this.setState({ graphLoader: false });
    }

    fetchRecentSecondarySalesList = async () => {
        let reqData = {
            "refCustomerId": this.state.userInfo.customerId.toString(),
            refUserId: this.state.userInfo.customerId.toString(),
            mstSlNo: this.state.userInfo.mstSlNo.toString(),
            limit: "5",
            isCustomer: "1",
            offset: "0"
        }
        this.setState({ recentLoader: true })
        let responseData = await MiddlewareCheck("fetchRecentSecondarySalesList", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyData = modRecentLiftingData(responseData.response);
                this.setState({ recentLiftingData: modifyData.list, totalMtd: modifyData.count })
            }
        }
        this.setState({ recentLoader: false })
    }
    setInitialState = async () => {
        this.setState({
            totalMtd: "",
            recentLiftingData: [],
            recentLoader: false
        })
    }


    setTabLoader = async (type) => {
        this.setState({ tabLoader: type })
    }
    setPointLoader = async (type) => {
        this.setState({ pointLoader: type })
    }
    setChartLoader = async (type) => {
        this.setState({ chartLoader: type })
    }

    getChartData = async () => {
        let reqData = {
            "refCustomerId": this.state.userInfo.customerId.toString(),
            refUserId: this.state.userInfo.customerId.toString(),
        }
        let responseData = await MiddlewareCheck("dashboardChart", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ chartData: responseData.response })
                await StorageDataModification.activePointData(responseData.response.achieved, "store")
            }
        }
    }

    //new   

    onSelectTab = async (item) => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        if (item.id == 1) {
            this.props.navigation.navigate("PassbookListTab")
        } else if (item.id == 2 && userInfo.mstSlNo != "4") {
            let data = {
                "profilePic": userInfo.profileImgUrl,
                "custBusinessName": userInfo.custBusinessName,
                "customerName": userInfo.firstName + " " + userInfo.lastName,
                "contactTypeName": userInfo.contactTypeName
            }

            this.props.navigation.navigate("CustomerListTab", { data: "ConfirmNewLifting" })
            // this.props.navigation.navigate("ConfirmNewLifting", { propData: data, contactTypeData: { id: userInfo.contactTypeId, } })

        } else if (item.id == 3 && userInfo.mstSlNo != "4") {
            this.props.navigation.navigate("NewCustomerRegistration")
        }
        else if (item.id == 4) {
            this.props.navigation.navigate("RequestRedemtionCategory", { data: "RequestRedemtionCategory", dataFrom: "RequestRedemtionCategory" })
        } else if (item.id == 5) {
            this.props.navigation.navigate("Catalogue", { data: "catalogue", dataFrom: "catalogue" })
        } else if (item.id == 6) {
            this.props.navigation.navigate("PassbookAndRedemption", { data: "PassbookAndRedemption", dataFrom: "PassbookAndRedemption" })
        }
    }


    // old 
    // onSelectTab = async (item) => {
    //     let userInfo = await StorageDataModification.userCredential({}, "get");
    //     if (item.id == 1) {
    //         this.props.navigation.navigate("PassbookListTab")
    //     } else if (item.id == 2 && userInfo.mstSlNo != "4") {
    //         let data = {
    //             "profilePic": userInfo.profileImgUrl,
    //             "custBusinessName": userInfo.custBusinessName,
    //             "customerName": userInfo.firstName + " " + userInfo.lastName,
    //             "contactTypeName": userInfo.contactTypeName
    //         }

    //         this.props.navigation.navigate("CustomerListTab", { data: "ConfirmNewLifting" })
    //         // this.props.navigation.navigate("ConfirmNewLifting", { propData: data, contactTypeData: { id: userInfo.contactTypeId, } })

    //     } else if (item.id == 3) {
    //         this.props.navigation.navigate("NewCustomerRegistration")
    //     }
    //     else if (item.id == 4) {
    //         this.props.navigation.navigate("RequestRedemtionCategory", { data: "RequestRedemtionCategory", dataFrom: "RequestRedemtionCategory" })
    //     } else if (item.id == 5) {
    //         this.props.navigation.navigate("Catalogue", { data: "catalogue", dataFrom: "catalogue" })
    //     } else if (item.id == 6) {
    //         this.props.navigation.navigate("PassbookAndRedemption", { data: "PassbookAndRedemption", dataFrom: "PassbookAndRedemption" })
    //     }
    // }

    // for users activity section
    onUserActivitySelectionSection = () => {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 15, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                {this.state.activityOptionData.map((item, key) => (
                    <TouchableOpacity onPress={() => this.onSelectTab(item)} style={{ backgroundColor: Color.COLOR.BLUE.ALICE_BLUE, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, height: Dimension.height / 5, width: Dimension.width / 2.3, marginBottom: 10 }} key={key}>
                        <Image source={item.image} style={{ height: 35, width: 35, resizeMode: 'contain', marginBottom: 25 }} />
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XS, textAlign: "center" }}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    tabSec = () => {
        const tabSelect = (item, key) => {
            let tabData = this.state.tabData;
            for (let i = 0; i < tabData.length; i++) {
                if (i == key) {
                    tabData[i].check = true;
                } else {
                    tabData[i].check = false;
                }
            }
            this.setState({ tabData: tabData })
            if (item.id == 1) {
                this.props.navigation.navigate("CustomerListTab", { data: "SalesConfirmation" })
                // this.props.navigation.navigate("SalesConfirmation")
            } else if (item.id == 2) (
                this.props.navigation.navigate("CustomerListTab", { data: "StockUpdatePage" })
            )
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
                <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                    {/* {this.state.tabLoader ?
                        skelitonPlaceHolder()
                        : */}
                    <React.Fragment>
                        {/* {this.state.tabData.length > 0 ? */}
                        <View style={{ marginHorizontal: 5 }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Earn Loyalty</Text>

                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: "row" }}>
                                {this.state.tabData.map((item, key) => (
                                    <View style={{ marginHorizontal: 5, marginVertical: 5, flexDirection: "row", }} key={key}>
                                        <DynamicCategoryTab
                                            data={item}
                                            onSelectedTab={() => tabSelect(item, key)}
                                        />
                                    </View>
                                ))}
                            </View>

                        </ScrollView>
                    </React.Fragment>
                </View>
            </>
        )
    }

    onSelect = () => {
    }

    pointSec = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, marginTop: 20 }}>
                    <View>
                        <Image source={ImageName.POINT_COINS_IMG} style={{ height: 80, width: 80, resizeMode: 'contain' }} />
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XL }}>{Object.keys(this.state.chartData).length > 0 ? this.state.chartData.achieved[1].y : 0}</Text>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Your Total Points</Text>
                    </View>
                </View>
                {this.state.recentLiftingData && this.state.recentLiftingData.length > 0 ?
                    <View style={{ marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>Last Lifting Month</Text>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getMonthYearName(this.state.recentLiftingData[0].salesDate)}</Text>
                    </View>
                    : null
                }
            </View>
        )
    }
    graphSec = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <LmsDashboardChart data={this.state.monthlyPointDataArr}  {...this.props} />
            </ View>
        )
    }

    skelitonSec = () => {
        return (
            <>
                <SkeletonPlaceholder>
                    <View style={{ height: 140, borderRadius: 10, marginTop: 15 }} />
                    <View style={{ height: 140, borderRadius: 10, marginVertical: 15 }} />
                </SkeletonPlaceholder>
            </>
        )
    }

    onPressViewAll = () => {
        this.props.navigation.navigate("AllRecentLiftingListCustomer", { type: "customer" });
    }


    recentLiftingSec = () => {
        return (
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.MD }}>Recent Lifting</Text>
                    </View>
                    {/* <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.9} onPress={() => this.onPressViewAll()}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, borderBottomColor: Color.COLOR.BLUE.LOTUS_BLUE, borderBottomWidth: 1 }}>View All</Text>
                    </TouchableOpacity> */}
                    {this.state.totalMtd ?
                        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.9} onPress={() => this.onPressViewAll()}>
                                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>View All</Text>
                            </TouchableOpacity>
                            <View style={{ borderWidth: 1, borderColor: Color.COLOR.GRAY.GRAY_TINTS, justifyContent: "center", alignItems: "center", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 2 }}>
                                <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XXS }}><Text style={{ color: Color.COLOR.RED.AMARANTH, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XXS }}><Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XXS }}>Total Lifting Till {DateConvert.formatDDMMYYYY(this.state.recentLiftingData[0].createdAt)}</Text> {Number(this.state.totalMtd).toFixed(2)}</Text> MT</Text>
                            </View>
                        </View>
                        :
                        null}
                </View>
                {this.state.recentLoader ?
                    <View>
                        {this.skelitonSec()}
                    </View> :
                    <React.Fragment>
                        {this.state.recentLiftingData.length > 0 ? <React.Fragment>
                            {this.state.recentLiftingData.map((item, key) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.COLOR.BLUE.ALICE_BLUE, borderRadius: 10, padding: 10, marginVertical: 5 }} key={key}>
                                    <View style={{ flex: 0.2 }}>
                                        <View style={{ height: 55, width: 55, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={{ uri: this.state.userInfo.mstSlNo == 4 ? item.liftFromUserProfilePic : item.referUserProfilePic }} style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 25 }} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                        <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? "From" : "To"}</Text>
                                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? (item.liftFromCustName && item.liftFromCustName.length > 0 ? item.liftFromCustName : item.liftFromUserName) : (item.referCustName && item.referCustName.length > 0 ? item.referCustName : item.referUserName)}</Text>
                                        <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? item.liftFromUserTypeName : item.refUserTypeName}</Text><View style={{ flexDirection: 'row' }}>
                                            <View style={{ marginRight: 10 }}>
                                                <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Act. Lifting Month</Text>
                                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>{DateConvert.getMonthYearName(item.salesDate)}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Create Date</Text>
                                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>{DateConvert.getDayMonthYearName(item.createdAt)}</Text>
                                            </View>
                                        </View>

                                    </View>
                                    <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                        {/* <Image source={item.isVerified == "0" ? ImageName.YELLOW_CLOCK : ImageName.GREEN_TICK} style={{ height: 20, width: 20, resizeMode: 'contain', marginBottom: 7 }} /> */}
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS, marginRight: 10 }}>{item.topLevelProduct}</Text>
                                            <Image source={ImageName.RED_BOX} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS, marginRight: 10 }}>{item.leafLevelProduct}</Text>
                                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS }}>{item.productQuantity}{item.unitName}.</Text>
                                        </View>
                                        <Image source={ImageName.YELLOW_CLOCK} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XXS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Subject to Approval</Text>
                                    </View>
                                </View>
                            ))}
                        </React.Fragment>
                            :
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>No Data Found !</Text>
                            </View>
                        }
                    </React.Fragment>
                }
            </View>
        )
    }


    onRefresh = async () => {
        // await this.setTabLoader(true)
        // await this.setPointLoader(true)
        // await this.setChartLoader(true)
        await this.setInitialState()

        this.setState({
            refreshing: true,
        })
        await this.load()
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header onRefresh={() => console.log("")} {...this.props} />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: 0 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                >
                    {this.onUserActivitySelectionSection()}
                    {this.pointSec()}

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        horizontal={true}
                    >
                        {this.graphSec()}
                    </ScrollView>
                    {this.recentLiftingSec()}
                    <View style={{ height: 100 }} />
                </ScrollView>
                {/* <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                >
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        horizontal={true}
                    >
                        <View style={{ flexDirection: "row", marginTop: 5, marginHorizontal: 20 }}>
                            {this.onUserActivitySelectionSection()}
                        </View>

                    </ScrollView>
                    {this.tabSec()}
                    {this.state.pointLoader ? null : this.pointSec()}
                    {this.state.chartLoader ? null : this.graphSec()}

                    <View style={{ height: 100 }} />
                </ScrollView> */}
            </SafeAreaView>
        )
    }
}
