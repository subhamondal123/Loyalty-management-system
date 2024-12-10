import React, { Component } from 'react'
import { ActivityIndicator, Animated, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Color, Dimension, FontFamily, ImageName } from '../../enums'
import styles from './Style'
import { ActivePointAndLocationSelectionTab, CatalogueItem, DynamicCategoryTab, LmsBannerModal, LmsLocationMapping } from '../../pageShared'
import Header from './../header/Header'
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { formatYearRange, getImageFromBlob, modCatalogueData, modGroupData, modListData, modPointData, modifyCategoryData, modifyFinancialYearDropdownData } from './Function'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { connect } from 'react-redux'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from 'redux'
import { StorageDataModification, Toaster } from '../../services/common-view-function'
import { DropdownInputBox, Loader, NoDataFound } from '../../shared'
import SvgComponent from '../../assets/svg'

class Catalogue extends Component {
    constructor(props) {
        super(props)

        this.state = {
            limit: 6,
            pageNum: 0,
            tabLoader: false,
            subTabLoader: false,
            listData: [],
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            isApiCall: true,
            isVisibleBanner: true,
            bannerDataArr: [],
            selectedLocationObj: {},
            catalogueData: {},
            selectedCategoryObj: {},
            catalogueId: "",
            selectedTab: {},
            selectedSubTab: {},
            scrollListY: new Animated.Value(0),
            userPoint: 0,
            selectedFinancialYearObj: {},
            financialYearArr: [],
            cartCount: 0,
            userData: {},
            pointLoader: false,
            cartData: {
                count: 0
            },
            propData: this.props.route.params.propData ? this.props.route.params.propData : {}
        }
    }

    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                await this.setInitialStateData()
                this.load()
            })
    }

    load = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        this.setState({ userData: userInfo })
        await this.setFinancialYear()
        await this.getUserPoints()
        await this.getCatalogueAndCategoryData()
        await this.getCartCount();
        this.setState({ pageLoader: false, refreshing: false })
        StoreUserOtherInformations("", {}, this.props);

    }

    getCartCount = async () => {
        this.setState({ countLoader: true })
        let reqData = {
            "limit": 100,
            "offset": "0",
            "catalogueId": this.state.catalogueId,
            "targetId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId,
            "groupTypeId": 1
        }
        let responseData = await MiddlewareCheck("getCatalogueCartCountByTargetId", reqData, this.props)

        if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            this.state.cartData.count = responseData.response.total
        }
        this.setState({ countLoader: false })

    }


    getUserPoints = async () => {
        let reqData = {
            "forFinancialYearId": this.state.selectedFinancialYearObj.id,
            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString()
        }
        this.setState({ pointLoader: true })
        let responseData = await MiddlewareCheck("getTargetUserPoint", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modPointData(responseData.response)
                this.setState({
                    userPoint: modData.activePoints
                })
            }
        }
        this.setState({ pointLoader: false })
    }

    setFinancialYear = async () => {
        let responseData = await MiddlewareCheck("getFinYear", {}, this.props)
        this.state.selectedFinancialYearObj = await this.modSelectedFinYear(responseData.response)

        this.setState({
            financialYearArr: modifyFinancialYearDropdownData(responseData.response),
            selectedFinancialYearObj: this.state.selectedFinancialYearObj
        })
    }

    modSelectedFinYear = async (data) => {
        let finYearData = await StorageDataModification.currentFinancialYearData({}, "get")
        let respObj = {}
        if (data) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].financialyearId == finYearData.financialyearId) {
                        respObj["id"] = data[i].financialyearId
                        respObj["name"] = formatYearRange(data[i].financialYearStartDate, data[i].financialYearEndDate)
                    }
                }
            }
        }
        return respObj
    }

    getCatalogueAndCategoryData = async () => {
        // let userData = await StorageDataModification.userCredential({}, "get")
        let reqData = {
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
            "viewOnly": "1", //2- for catalogue view , 1 - for redemption view
            "forFinancialYearId": this.state.selectedFinancialYearObj.id,
            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
            "refUserTypeId": Object.keys(this.state.propData).length > 0 ? this.state.propData.contactTypeId : this.state.userData.contactTypeId.toString()
            // "targetId": userData.userId,
        }
        let responseData = await MiddlewareCheck("getCatalogueOfUser", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyResponseData = modCatalogueData(responseData.response)
                await StorageDataModification.catalogueAndCategoryData(modifyResponseData, "store")
                if (modifyResponseData.catalogueId.length > 0) {
                    await this.getItemByCatalogue(modifyResponseData.catalogueId)
                } else {
                    this.setState({ pageLoader: false, listLoader: false, refreshing: false })
                }
                this.setState({
                    catalogueId: modifyResponseData.catalogueId,
                    catalogueData: modifyResponseData,
                    cartCount: modifyResponseData.cartCount
                })
            }
        }
    }
    getItemByCatalogue = async (catalogueId, categoryId, groupId) => {
        // await this.clearListData()
        let reqData = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "catalogueId": catalogueId,
            "categoryId": this.state.selectedCategoryObj.id ? this.state.selectedCategoryObj.id : "",
            // "groupId": groupId
        }
        await this.getItems(reqData);
    }

    getItems = async (reqData) => {
        let modifyResponseData = [];
        let responseData = await MiddlewareCheck("getCatalogueAndItemForUser", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                modifyResponseData = modListData(responseData.response)
                if (modifyResponseData.listData.length == 0) {
                    this.state.isApiCall = false;
                }
                this.setState({ isApiCall: this.state.isApiCall })
                this.setState({ listData: [...this.state.listData, ...modifyResponseData.listData] })
            }
        }
        this.setState({ pageLoader: false, listLoader: false, refreshing: false })
    }


    onRefresh = async () => {
        await this.setInitialStateData()
        await this.load()
    }
    clearListData = async () => {
        this.state.listData = []
        this.setState({
            pageLoader: true,
            limit: 6,
            pageNum: 0,
            listData: this.state.listData,
            isApiCall: true
        })
    }
    setInitialStateData = async () => {
        this.setState({
            limit: 6,
            pageNum: 0,
            tabData: [],
            subTabData: [],
            selectedTabData: {},
            tabLoader: false,
            subTabLoader: false,
            listData: [],
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            isApiCall: true,
            isVisibleBanner: true,
            bannerDataArr: [],
            selectedLocationObj: {},
            selectedCategoryObj: {},
            catalogueData: {},
            catalogueId: "",
            selectedTab: {},
            selectedSubTab: {},
            userPoint: 0,
            selectedFinancialYearObj: {},
            financialYearArr: [],
        })
    }


    // getGroupData = async (catalogueId, categoryId) => {
    //     this.setState({ subTabLoader: true })
    //     let reqData = {
    //         "categoryId": categoryId,
    //         "catalogueId": catalogueId
    //     }
    //     let responseData = await MiddlewareCheck("getGroupByCategory", reqData, this.props)
    //     if (responseData) {
    //         if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
    //             let modifyResponseData = modGroupData(responseData.response)
    //             this.setState({ subTabData: modifyResponseData, selectedSubTab: modifyResponseData.length > 0 ? modifyResponseData[0] : { id: "0" } })
    //         }
    //     }

    //     this.setState({ subTabLoader: false })
    //     // await this.getItemByCatalogue(catalogueId, categoryId, this.state.subTabData.length > 0 ? this.state.subTabData[0].id : "0")

    // }

    setCategory = (arrData) => {
        let tabItemData = {};
        for (let i = 0; i < arrData.length; i++) {
            if (i == 0) {
                arrData[i].check = true;
                tabItemData = arrData[i]
            }
        }

        this.setState({ tabData: arrData, selectedTabData: tabItemData })

        this.getItemByCategory(tabItemData)
    }


    getPromotionBanner = async () => {
        let bannerData = await MiddlewareCheck("getPromotionalImage", { clientid: 4 }, this.props)
        if (bannerData) {
            if (bannerData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ bannerDataArr: bannerData.response })
            }
        }
    }

    tabSelect = async (item, key) => {
        await this.clearListData()
        let tabData = this.state.tabData;
        for (let i = 0; i < tabData.length; i++) {
            if (i == key) {
                tabData[i].check = true;
            } else {
                tabData[i].check = false;
            }
        }
        this.setState({ tabData: tabData, selectedTab: item })
        await this.getGroupData(this.state.catalogueId, item.id)
        await this.getItemByCatalogue(this.state.catalogueId, item.id, this.state.selectedSubTab.id)

    }
    tabSec = () => {
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
                <View style={{ marginHorizontal: 10, marginTop: 5, }}>
                    {this.state.tabLoader ?
                        skelitonPlaceHolder()
                        :
                        <React.Fragment>
                            {this.state.tabData.length > 0 ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                    <View style={{ flexDirection: "row" }}>
                                        {this.state.tabData.map((item, key) => (
                                            <View style={{ marginHorizontal: 5, marginVertical: 5, flexDirection: "row", }} key={key}>
                                                <DynamicCategoryTab
                                                    data={item}
                                                    onSelectedTab={() => this.tabSelect(item, key)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                </ScrollView>
                                :
                                null
                            }
                        </React.Fragment>
                    }
                </View>
            </>
        )
    }

    subTabSelect = async (item, key) => {
        await this.clearListData()
        let tabData = this.state.subTabData;
        for (let i = 0; i < tabData.length; i++) {
            if (i == key) {
                tabData[i].check = true;
            } else {
                tabData[i].check = false;
            }
        }
        this.setState({ subTabData: tabData, selectedSubTab: item })
        await this.getItemByCatalogue(this.state.catalogueId, this.state.selectedTab.id, item.id)
    }
    subTabSec = () => {
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
                <View style={{ marginHorizontal: 10 }}>
                    {this.state.subTabLoader ?
                        skelitonPlaceHolder()
                        :
                        <React.Fragment>
                            {this.state.subTabData.length > 0 ?
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                    <View style={{ flexDirection: "row" }}>
                                        {this.state.subTabData.map((item, key) => (
                                            <View style={{ marginHorizontal: 5, flexDirection: "row", }} key={key}>
                                                <DynamicCategoryTab
                                                    data={item}
                                                    onSelectedTab={() => this.subTabSelect(item, key)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                </ScrollView>
                                :
                                null
                            }
                        </React.Fragment>
                    }
                </View>
            </>
        )
    }


    // loader for scroll
    renderLoader = () => {
        return this.state.listLoader ? (
            <View style={{ marginBottom: 500 }}>
                {/* <Loader type={"normal"} /> */}
                <ActivityIndicator size={"small"} color={Color.COLOR.BLUE.LOTUS_BLUE} />
            </View>
        ) : (
            <View style={{ marginBottom: 500 }} />
        );
    };
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
                    this.getItemByCatalogue(this.state.catalogueId, this.state.selectedTab.id, this.state.selectedSubTab.id);
                } else {
                    this.setState({ listLoader: false })
                    return null;
                }
            }
        );
    };

    skelitonSec = () => {
        return (
            <View style={{ marginTop: 20 }}>
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                        <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                        <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                    </View>
                </SkeletonPlaceholder >
            </View>
        )
    }

    listSec = () => {
        const onSelectItem = (item) => {
            let propItem = Object.assign(item, { catalogueId: this.state.catalogueId })
            this.props.navigation.navigate("CatalogueItemDetails", { data: propItem, propData: this.props.route.params.propData, dataFrom: this.props.route.params.dataFrom, selectedFinancialYearObj: this.state.selectedFinancialYearObj, cartCount: this.state.cartCount })
        }

        const renderList = (item, key) => {
            return (
                <View key={key}>
                    <View>
                        {listDataSec(item, key)}
                    </View>
                </View>
            );
        };

        const listDataSec = (item, key) => {
            return (
                <View style={{ marginHorizontal: 5, marginTop: 15, marginBottom: 10 }} key={key}>
                    <CatalogueItem
                        data={item}
                        index={key}
                        onPress={() => onSelectItem(item)}
                        width={Dimension.width / 3 - 20}
                        backgroundColor={"#D1D1D1"}
                    />
                </View>
            )
        }

        return (
            <View style={{ paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    {this.state.pageLoader ?
                        <>
                            {this.skelitonSec()}
                        </>
                        :
                        <>
                            {this.state.listData.length > 0 ?
                                <FlatList
                                    numColumns={3}
                                    data={this.state.listData}
                                    renderItem={({ item, index }) => renderList(item, index)}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={this.renderLoader}
                                    onEndReached={this.fetchMore}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh()}
                                        />
                                    }
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: this.state.scrollListY } } }],
                                        { useNativeDriver: false }
                                    )}
                                />
                                :
                                <React.Fragment>
                                    <View style={{ flex: 1, height: Dimension.height }}>
                                        <NoDataFound />
                                    </View>
                                </React.Fragment>
                            }
                        </>
                    }
                </View>
            </View >
        )
    }

    onNotification = () => {
    }

    modalSec = () => {
        const onClose = () => {
            this.setState({ isVisibleBanner: false })
        }
        return (
            <>
                {this.state.bannerDataArr.length > 0 ?
                    <LmsBannerModal
                        isVisible={this.state.isVisibleBanner}
                        data={this.state.bannerDataArr[0]}
                        onCloseModal={() => onClose()}
                    />
                    :
                    null
                }
            </>
        )
    }
    onSelectLocation = async (val) => {
        let modObj = {
            "SlNo": "",
            "check": val.check,
            "hierarchyDataId": val.hierarchyDataId,
            "hierarchyTypeId": val.hierarchyTypeId,
            "hmName": val.hmName,
            "hmTypDesc": val.hmTypDesc
        }
        this.state.selectedLocationObj = modObj;
        this.setState(this.state)
        this.props.userSelectedBeatRouteData(modObj);
        await StorageDataModification.routeData(modObj, "store");
        await this.getCatalogueAndCategoryData()
        // await this.getItemByCatalogue()
    }

    catalogueTitle = () => {
        const onChangeFinancialYear = async (val) => {
            this.setState({ selectedFinancialYearObj: val })
            await this.clearListData()
            await this.getUserPoints()
            await this.getCatalogueAndCategoryData()
        }
        return (
            <View style={{ marginHorizontal: 15, marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 0.65 }}>
                    <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.BOLD }} numberOfLines={1}>{this.state.catalogueData.catalogueName}</Text>
                </View>
                <View style={{ flex: 0.35 }}>
                    <DropdownInputBox
                        selectedValue={this.state.selectedFinancialYearObj.id ? this.state.selectedFinancialYearObj.id.toString() : "0"}
                        data={this.state.financialYearArr}
                        onSelect={(value) => onChangeFinancialYear(value)}
                        headerText={""}
                        additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0, backgroundColor: "#fff", paddingVertical: 0, elevation: 0 }}
                        isBackButtonPressRequired={true}
                        isBackdropPressRequired={true}
                        unSelectedTextColor={"#1F2B4D"}
                        selectedTextColor={"#1F2B4D"}
                        fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                        fontSize={11}
                        borderRadius={25}
                    />
                </View>
            </View>
        )
    }

    onFilter = async (data) => {
        await this.clearListData();
        this.state.selectedCategoryObj = data.selectedCategoryObjData ? data.selectedCategoryObjData : {}
        this.setState({ selectedCategoryObj: this.state.selectedCategoryObj })
        await this.getItemByCatalogue(this.state.catalogueId)
    }

    onReset = async () => {
        await this.clearListData();
        this.setState({ selectedCategoryObj: {} })
        await this.getItemByCatalogue(this.state.catalogueId)
    }

    // for navigation to cart
    onCart = () => {
        let data = {
            catalogueId: this.state.catalogueId
        }
        this.props.navigation.replace("OrderCartDetails", { propData: this.props.route.params.propData, data: data, cartData: this.state.cartData, selectedFinancialYearObj: this.state.selectedFinancialYearObj })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Header {...this.props} onRefresh={() => console.log("")} onFilterData={(value) => this.onFilter(value)} onReset={() => this.onReset()} onPressNotification={() => this.onNotification()} />
                    </View>
                    <View style={{}}>
                        <TouchableOpacity activeOpacity={0.9} style={styles.cardTab} onPress={() => this.onCart()}>
                            <View>
                                <Image source={ImageName.SHOPING_ORDER_BOX} style={styles.shoppingImg} />
                            </View>
                            <View style={{ width: 10 }} />
                            <View>
                                <Text style={styles.cartCountTxt}>{this.state.cartData.count}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ marginTop: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 0.5 }}>
                            <View
                                style={{ borderWidth: 1, borderRadius: 30, borderColor: this.state.borderColor, alignSelf: "flex-start", flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#fff", alignItems: "center", marginLeft: 15 }}>
                                <SvgComponent svgName={"nineDot"} strokeColor={"#F13748"} height={11} width={11} />
                                <Text style={{ color: "#817D7A", fontSize: 14, fontFamily: FontFamily.FONTS.INTER.BOLD, marginLeft: 5 }}>Point : </Text>
                                <Text style={{ color: "#F13748", fontSize: 14, fontFamily: FontFamily.FONTS.INTER.BOLD, marginLeft: 5 }}>{this.state.userPoint}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <ActivePointAndLocationSelectionTab {...this.props} selectedLocation={(value) => this.onSelectLocation(value)} isVisibleActivePoint={false} />
                        </View>
                    </View>
                    {this.catalogueTitle()}
                    {this.listSec()}
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);