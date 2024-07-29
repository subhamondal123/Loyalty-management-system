import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Color, Dimension, FontFamily, ImageName } from '../../enums'
import styles from './Style'
import { ActivePointAndLocationSelectionTab, CatalogueItem, DynamicCategoryTab, LmsBannerModal, LmsLocationMapping, ProfileSec } from '../../pageShared'
import Header from './../header/Header'
import { MiddlewareCheck } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { modCatalogueData, modGroupData, modListData, modifyCategoryData } from './Function'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { connect } from 'react-redux'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from 'redux'
import { StorageDataModification, Toaster } from '../../services/common-view-function'
import { Loader, NoDataFound } from '../../shared'


class RequestRedemptionCategory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            limit: 12,
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
            catalogueData: {},
            catalogueId: "",
            selectedTab: {},
            selectedSubTab: {},
            propData: this.props.route.params.propData
        }
    }

    componentDidMount = () => {
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        this.load()
        // })
    }

    load = async () => {
        await this.getCatalogueByLocation()
        this.setState({ pageLoader: false, refreshing: false })
    }

    onRefresh = async () => {
        await this.setInitialStateData()
        await this.load()
    }
    clearListData = async () => {
        this.setState({
            pageLoader: true,
            limit: 12,
            pageNum: 0,
            listData: []
        })
    }
    setInitialStateData = async () => {
        this.setState({
            limit: 12,
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
            catalogueData: {},
            catalogueId: "",
            selectedTab: {},
            selectedSubTab: {},
        })
    }

    getCatalogueByLocation = async () => {
        let reqData = {
            "subtype": "1",
            // "refUserId": this.state.propData.id.toString(),
            // "refUserTypeId": this.state.propData.contactTypeId.toString(),
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
        }
        let responseData = await MiddlewareCheck("getCategoryByLocation", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyResponseData = modCatalogueData(responseData.response)
                if (modifyResponseData.categories.length > 0) {
                    this.setState({ catalogueId: modifyResponseData.catalogueId, catalogueData: modifyResponseData, tabData: modifyResponseData.categories, selectedTab: modifyResponseData.categories[0] })
                    await this.getGroupData(modifyResponseData.catalogueId, modifyResponseData.categories.length > 0 ? modifyResponseData.categories[0].id : "0")
                    await this.getItemByCatalogue(modifyResponseData.catalogueId, modifyResponseData.categories.length > 0 ? modifyResponseData.categories[0].id : "0", Object.keys(this.state.selectedSubTab).length > 0 ? this.state.selectedSubTab.id : "0")
                } else {
                    this.setState({
                        listData: [],
                        catalogueData: {},
                        tabData: [],
                        subTabData: [],
                        limit: 12,
                        pageNum: 0
                    })
                }
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }

    }

    getGroupData = async (catalogueId, categoryId) => {
        this.setState({ subTabLoader: true })
        let reqData = {
            "categoryId": categoryId,
            "catalogueId": catalogueId
        }
        let responseData = await MiddlewareCheck("getGroupByCategory", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyResponseData = modGroupData(responseData.response)
                this.setState({ subTabData: modifyResponseData, selectedSubTab: modifyResponseData.length > 0 ? modifyResponseData[0] : { id: "0" } })
            }
        }

        this.setState({ subTabLoader: false })
        // await this.getItemByCatalogue(catalogueId, categoryId, this.state.subTabData.length > 0 ? this.state.subTabData[0].id : "0")

    }

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

    getItemByCatalogue = async (catalogueId, categoryId, groupId) => {
        // await this.clearListData()
        let reqData = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "catalogueId": catalogueId,
            "categoryId": categoryId,
            "groupId": groupId
        }
        await this.getItems(reqData);
    }

    getItems = async (reqData) => {
        let responseData = await MiddlewareCheck("getItemByCatalogue", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyResponseData = modListData(responseData.response)
                if (modifyResponseData.listData.length == 0) {
                    this.state.isApiCall = false;
                }
                this.setState(this.state)
                this.setState({ listData: [...this.state.listData, ...modifyResponseData.listData] })
            }
        }

        this.setState({ pageLoader: false, listLoader: false, })
    }
    getPromotionBanner = async () => {
        let bannerData = await MiddlewareCheck("getPromotionalImage", { clientid: 4 }, this.props)
        if (bannerData) {
            if (bannerData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ bannerDataArr: bannerData.response })
            }
        }
    }

    tabSec = () => {
        const tabSelect = async (item, key) => {
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
                                                    onSelectedTab={() => tabSelect(item, key)}
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


    subTabSec = () => {
        const tabSelect = async (item, key) => {
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
                                                    onSelectedTab={() => tabSelect(item, key)}
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
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 500 }} />
        );
    };
    // fetch more
    fetchMore = async () => {
        // if (this.state.initialApiCall) {
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
        // }
    };

    skelitonSec = () => {
        return (
            <View style={{ marginTop: 20 }}>
                {/* <ActivityIndicator size={"small"} /> */}
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
            this.props.navigation.navigate("CatalogueItemDetails", { data: item, propData: this.props.route.params.propData })
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
                        // <View style={{ justifyContent: "center", alignItems: "center", height: Dimension.height / 2, flex: 1 }}>
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
        await this.getCatalogueByLocation()
    }

    catalogueTitle = () => {
        return (
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>{this.state.catalogueData.catalogueName}</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} onApplyFilter={() => console.log("")} onResetFilter={() => console.log("")} onPressNotification={() => this.onNotification()} />
                <View style={{ marginTop: 5 }}>
                    {/* <ActivePointAndLocationSelectionTab {...this.props} selectedLocation={(value) => this.onSelectLocation(value)} /> */}
                    {/* <ProfileSec props={this.props} /> */}
                    {/* {this.catalogueTitle()} */}
                    {this.tabSec()}
                    {this.subTabSec()}
                    {this.listSec()}
                    {/* {this.modalSec()} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestRedemptionCategory);