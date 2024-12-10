import React, { Component } from 'react'
import { Animated, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { ActivePointCard, DynamicCategoryTab, LmsActivitySelectionTab, LmsDashboardChart } from '../../pageShared'
import { Text } from 'react-native'
import Header from '../header/Header'
import styles from './Style'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums'
import { Image } from 'react-native'
import SvgComponent from '../../assets/svg'
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { modRecentLiftingData } from './Function'
import { DateConvert, StorageDataModification } from '../../services/common-view-function'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'


const data = {
    target: [
        { x: "Lock", y: 10000, },
        { x: "Active", y: 10000 },
        { x: "Exp 30", y: 10000 }
    ],
    achieved: [
        { x: "Lock", y: 1000 },
        { x: "Active", y: 7200 },
        { x: "Exp 30", y: 4210 }
    ],
}


export default class LmsDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabLoader: true,
            chartData: {},
            chartLoader: true,
            refreshing: true,
            tabLoader: true,
            activePointLoader: false,
            activityAnim: new Animated.Value(0),
            totalMtd: "",
            recentLiftingData: [],
            recentLoader: false,
            userInfo: {}
        }
    }

    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                let userInfo = await StorageDataModification.userCredential({}, "get");
                this.setState({ userInfo: userInfo })
                await this.setInitialState()
                await this.load()
            })
    }

    setInitialState = async () => {
        this.setState({
            totalMtd: "",
            recentLiftingData: [],
            recentLoader: false
        })
    }


    load = async () => {
        Animated.spring(
            this.state.activityAnim,
            {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            }
        ).start();
        this.setState({ refreshing: false, })
        // await this.getChartData()
        // await this.setTabLoader(false)
        // await this.setActivePointLoader(false)
        // await this.setChartLoader(false)
        StoreUserOtherInformations("", {}, this.props);
        await this.fetchRecentSecondarySalesList();
    }

    fetchRecentSecondarySalesList = async () => {
        let reqData = {
            refUserId: this.state.userInfo.userId,
            limit: "5",
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

    setTabLoader = async (type) => {
        this.setState({ tabLoader: type })
    }
    setChartLoader = async (type) => {
        this.setState({ chartLoader: type })
    }

    setActivePointLoader = async (type) => {
        this.setState({ activePointLoader: type })
    }

    getChartData = async () => {
        let responseData = await MiddlewareCheck("dashboardChart", {}, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ chartData: responseData.response })
            }
        }
    }

    activitySec = () => {
        const onSelect = (type) => {
            if (type == "ConfirmNewLifting" || type == "RequestRedemtionCategory" || type == "Catalogue" || type == "PassbookAndRedemption") {
                this.props.navigation.navigate("CustomerListTab", { data: type })
            } else if (type == "NewCustomerRegistration") {
                this.props.navigation.navigate("NewCustomerRegistration", { data: type })
            }
            // else if (type == "RequestRedemtionCategory") {
            //     this.props.navigation.navigate(type, { data: type })
            // } else if (type == "Catalogue") {
            //     this.props.navigation.navigate(type, { data: type })
            // }
        }
        return (
            <Animated.View style={{ marginHorizontal: 15, borderRadius: 15, backgroundColor: "#FFF2F3", justifyContent: "center", alignItems: "center", marginTop: 20, paddingBottom: 10, paddingHorizontal: 10, transform: [{ scale: this.state.activityAnim }] }}>
                <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 16, marginTop: 10 }}>Activity on Behalf of Customers</Text>
                <View>
                    <Image source={ImageName.LMS_DASH_INITIAL_LOGO} style={{ height: 120, width: 150, resizeMode: "cover" }} />
                </View>
                <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 10 }}>
                    {/* <TouchableOpacity
                        onPress={() => onSelect("SalesConfirmation")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"threeDBox"} height={26} width={26} strokeColor={"#F13748"} />
                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Sales{"\n"} Confirmation</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
                        onPress={() => onSelect("ValidateSales")}
                        style={{ borderWidth: 0.5, borderColor: "#F4C5C9", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, alignItems: "center", justifyContent: "center", height: 90, width: Dimension.width / 3 - 20, marginHorizontal: 5 }}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"invoiceWithTick"} height={26} width={26} strokeColor={"#F13748"} />

                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Validate {"\n"}Sales INV</Text>

                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => onSelect("ConfirmNewLifting")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"threeDCubeScan"} height={26} width={26} strokeColor={"#F13748"} />
                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Add New{"\n"}Lifting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSelect("NewCustomerRegistration")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"userWithPencil"} height={26} width={26} strokeColor={"#F13748"} />
                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Customer{"\n"}Registration</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSelect("RequestRedemtionCategory")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"threeDBoxWithTwoCircleRotate"} height={28} width={28} strokeColor={"#F13748"} />

                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Request{"\n"}Redemption</Text>

                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => onSelect("Catalogue")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 10 }}>
                            <SvgComponent svgName={"threeDBoxRotate"} height={28} width={28} strokeColor={"#F13748"} />

                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Catalogue</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onSelect("PassbookAndRedemption")}
                        style={styles.activityBox}>
                        <View style={{ paddingBottom: 5 }}>
                            <SvgComponent svgName={"threeDBoxRotate"} height={32} width={32} strokeColor={"#F13748"} />

                        </View>
                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12, textAlign: "center" }}>Passbook &{"\n"}Redemption</Text>

                    </TouchableOpacity>

                </View>

            </Animated.View>
        )
    }

    onSelectTab = () => {
    }

    // for users activity section
    onUserActivitySelectionSection = () => {
        return (
            <>
                {this.state.refreshing ? null :
                    // <View style={{backgroundColor:"red"}}>
                    <LmsActivitySelectionTab {...this.props} onClickItem={() => this.onSelectTab()} />
                    // </View>

                }

            </>
        );
    }

    pointSec = () => {
        const onSelect = () => {
        }
        return (
            <View>
                <ActivePointCard {...this.props} onPress={() => onSelect()} data={this.state.chartData} />
            </View>
        )
    }

    graphSec = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", }}>
                <LmsDashboardChart data={this.state.chartData}  {...this.props} />
            </View>
        )
    }

    onRefresh = async () => {
        // this.onClearStateData();
        await this.setChartLoader(true)
        await this.setActivePointLoader(true)
        await this.setTabLoader(true)
        await this.setInitialState()
        this.setState({
            refreshing: true,
        })
        await this.load()
    }

    onClearStateData = () => {
        this.setState({

        })
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
        this.props.navigation.navigate("AllRecentLiftingList", { type: "employee" });
    }

    recentLiftingSec = () => {
        return (
            <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.MD, textAlign: "center" }}>Recent Lifting</Text>
                    <View style={{ flex: 1 }} />
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
                {
                    this.state.recentLoader ?
                        <View>
                            {this.skelitonSec()}
                        </View> :
                        <React.Fragment>
                            {this.state.recentLiftingData.length > 0 ?
                                <React.Fragment>
                                    {this.state.recentLiftingData.map((item, key) => (
                                        <View key={key} style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 15, borderWidth: 0.5, borderColor: "#CBCBCB" }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <View>
                                                    <Image source={{ uri: item.referUserProfilePic }} style={{ height: 50, width: 50, resizeMode: "contain", borderRadius: 30 }} />
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
                                                    <View>
                                                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }}>{item.referCustName ? item.referCustName : item.referUserName}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{item.refUserTypeName}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <View style={{ alignItems: 'flex-end' }}>
                                                        <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Act. Lifting Month</Text>
                                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10, top: -4 }}>{DateConvert.getMonthYearName(item.salesDate)}</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-end' }}>
                                                        <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Create Date</Text>
                                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10, top: -4 }}>{DateConvert.getDayMonthYearName(item.createdAt)}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                            <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
                                                <View>
                                                    <Image source={{ uri: item.liftFromUserProfilePic }} style={{ height: 50, width: 50, resizeMode: "contain", borderRadius: 30 }} />
                                                </View>
                                                <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
                                                    <View>
                                                        <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 11 }}>From</Text>
                                                    </View>
                                                    <View style={{ top: -5 }}>
                                                        <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }}>{item.liftFromCustName.length == 0 ? item.liftFromUserName : item.liftFromCustName}</Text>
                                                    </View>
                                                    <View style={{ top: -5 }}>
                                                        <Text style={{ color: "#5A5A5A", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{item.liftFromUserTypeName}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: "flex-end" }}>
                                                    {/* <Image source={item.isVerified == "0" ? ImageName.YELLOW_CLOCK : item.isVerified == "2" ? ImageName.RED_BG_CROSS : ImageName.GREEN_TICK} style={item.isVerified == "2" ? { height: 25, width: 25, resizeMode: 'contain', top: -5 } : { height: 20, width: 20, resizeMode: "contain", top: -5 }} /> */}
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 11, marginRight: 10 }}>{item.topLevelProduct}</Text>
                                                        <SvgComponent svgName={"threeDBox"} height={18} width={18} strokeColor={"#F13748"} />
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11, marginRight: 10 }} numberOfLines={1}>{item.leafLevelProduct}</Text>
                                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 11 }}>{item.productQuantity}{item.unitName}</Text>
                                                    </View>
                                                    <Image source={ImageName.YELLOW_CLOCK} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XXS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Subject to Approval</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </React.Fragment>
                                :
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>No Data Found !</Text>
                                </View>}
                        </React.Fragment>
                }
            </View >
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header onRefresh={() => console.log("")} {...this.props} />
                <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                >
                    {this.activitySec()}
                    {/* <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        horizontal={true}
                    >
                        <View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 20 }}>
                            {this.state.tabLoader ? null : this.onUserActivitySelectionSection()}
                        </View>

                    </ScrollView>
                    {this.state.activePointLoader ? null : this.pointSec()}
                    {this.state.chartLoader ? null : this.graphSec()} */}
                    {/* {this.tabSec()} */}
                    {this.recentLiftingSec()}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
