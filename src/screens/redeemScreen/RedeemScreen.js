import React from "react";
import { SafeAreaView, Image, View, Text, ScrollView, TextInput, RefreshControl, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { Color, Dimension, FontFamily, FontSize, ImageName } from "../../enums";
import styles from "./Style";
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from "redux";
import { BigTextButton, NoDataFound } from "../../shared";
import Header from "../header/Header";
import SvgComponent from "../../assets/svg";
import { ActivePointAndLocationSelectionTab, CatalogueItem } from "../../pageShared";
import { MiddlewareCheck } from "../../services/middleware";
import { modCatalogueData, modListData } from "./Function";
import { ErrorCode } from "../../services/constant";
import { StorageDataModification, Toaster } from "../../services/common-view-function";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


let trader = [

    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    },
    {
        id: 4
    },
    {
        id: 5
    }
]


class ReedemScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            superTrader: trader,
            limit: 12,
            pageNum: 0,
            listData: [],
            pageLoader: true,
            refreshing: true,
            selectedLocationObj: {},
        }
    }

    // this is a initial function which is call first
    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                this._load();
            })
    }

    // this is the first function where set the state data
    _load = async () => {
        await this.getCatalogueByLocation();
    }


    onRefresh = async () => {
        await this.setInitialStateData()
        await this._load()
    }

    setInitialStateData = async () => {
        this.setState({
            limit: 12,
            pageNum: 0,
            listData: [],
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            selectedLocationObj: {},
        })
    }

    getCatalogueByLocation = async () => {
        this.setState({ refreshing: false })
        let reqData = {
            "subtype": "1",
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
        }
        let responseData = await MiddlewareCheck("getCategoryByLocation", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyResponseData = modCatalogueData(responseData.response)
                if (modifyResponseData.categories.length > 0) {
                    this.setState({ catalogueId: modifyResponseData.catalogueId, catalogueData: modifyResponseData })
                    await this.getItemByCatalogue(modifyResponseData.catalogueId)
                } else {
                    this.setState({
                        listData: [],
                        catalogueData: {},
                        limit: 12,
                        pageNum: 0,
                        pageLoader: false
                    })
                }
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    // here list api call
    getItemByCatalogue = async (catalogueId) => {
        let reqData = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "catalogueId": catalogueId,
            "categoryId": "0",
            "groupId": "0"
        }
        await this.getItems(reqData);
    }
    getItems = async (reqData) => {
        let responseData = await MiddlewareCheck("getItemByCatalogue", reqData, this.props)
        if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let modifyResponseData = modListData(responseData.response)
            this.setState({ listData: modifyResponseData.listData })
        }
        this.setState({ pageLoader: false })
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
            this.props.navigation.navigate("CatalogueItemDetails", { data: item })
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
                                    <View style={{ flex: 1, height: Dimension.height, marginTop: 20 }}>
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

    transPointSec = () => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <View style={{ flex: 0.7 }}>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Transfer Points</Text>
                    <Text style={{ color: '#5F5F5F', fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>You can transfer your points to any of your subordinate</Text>
                </View>
                <View style={{ flex: 0.3 }}>
                    <BigTextButton
                        text={"Check All"}
                        fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                        fontSize={FontSize.SM}
                        borderRadius={30}
                        height={40}
                        width={30}
                        start={{ x: 1, y: 0.3 }}
                        end={{ x: 0.5, y: 1 }}
                    // onPress={() => this._onNext()}
                    />
                </View>
            </View>
        )
    }

    listHeaderSec = () => {
        const onViewAll = () => {
            this.props.navigation.navigate("Catalogue")
        }
        return (
            <View style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 10, alignItems: "center" }}>
                <View>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Catalogue</Text>
                </View>
                <View style={{ flex: 1 }} />
                {this.state.listData.length > 0 ?
                    <TouchableOpacity style={{ borderRadius: 25, backgroundColor: Color.COLOR.RED.AMARANTH, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => onViewAll()}>
                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>View All</Text>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        )
    }

    superTraderSec = () => {
        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                    {this.state.superTrader.map((item, key) => (
                        <View style={{ alignItems: 'center', marginHorizontal: 5 }} key={key}>
                            <Image source={ImageName.USER_IMG} style={{ height: 60, width: 60, resizeMode: 'cover', borderRadius: 100, borderWidth: 0.3, borderColor: "#D1D1D1" }} />
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginTop: 8 }}>Super Trader</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )
    }

    creditAdjustmentSec = () => {
        return (
            <View style={{ backgroundColor: '#F0F4F7', marginHorizontal: 5, borderRadius: 8, marginTop: 15 }}>
                <View style={{ marginHorizontal: 8, marginTop: 10 }}>
                    <Image source={ImageName.CREDIT_ADJUSTMENT} style={{ height: 220, width: 350, resizeMode: 'contain' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, flex: 1 }}>Credit Adjustment</Text>
                        <Text style={{ color: '#F13748', fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{"-₹" + " " + "20002020"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={{ color: '#5F5F5F', fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, flex: 1 }}>You would get additional points value on credit adjustment</Text>
                        <View style={{ backgroundColor: '#2D4454', paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center', flexDirection: 'row', borderRadius: 8 }}>
                            <Image source={ImageName.COINS_YELLOW} style={{ height: 18, width: 22, resizeMode: 'contain', top: -2 }} />
                            <View style={{ width: 8 }} />
                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{"=" + " " + "₹" + " " + "20"}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 8, borderRadius: 8, marginTop: 15 }}>
                        <View style={{ marginHorizontal: 4, flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                            <View style={{}}>
                                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Active Points</Text>
                                <Text style={{ color: "#156A94", fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>12000</Text>
                            </View>
                            <View style={{ width: 10 }} />
                            <View style={{ flex: 0.7 }}>
                                <View style={{ width: "85%", justifyContent: "center", alignItems: "center", height: 40, borderWidth: 0.8, borderColor: "#000", borderRadius: 20 }}>
                                    <TextInput
                                        placeholder={"Points"}
                                        placeholderTextColor={Color.COLOR.GRAY.GRAY_COLOR}
                                        // value={item.inputRate.toString()}
                                        // onChangeText={(value) => this._onChangeRate(value, item, key)}
                                        keyboardType="number-pad"
                                        style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: 'center' }}
                                        maxLength={8}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 0.3 }}>
                                <Text style={{ color: '#5F5F5F', fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Value</Text>
                                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{"₹" + " " + "20000"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <View>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Adjusted Amount</Text>
                            <Text style={{ color: Color.COLOR.RED.AMARANTH, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginTop: 8 }}>{"₹" + " " + "2000000"}   <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: '5%' }}>{"-" + " " + "₹" + " " + "2000000"}</Text></Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, paddingVertical: 10 }}>
                    <View style={{ marginVertical: 6, flexDirection: 'row', marginHorizontal: 16, alignItems: 'center' }}>
                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, flex: 0.7 }}>{"₹" + " " + "2000000"}</Text>
                        <View style={{ flex: 0.3 }}>
                            <BigTextButton
                                text={"Process"}
                                fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                                fontSize={FontSize.SM}
                                borderRadius={30}
                                start={{ x: 1, y: 0.3 }}
                                end={{ x: 0.5, y: 1 }}
                            // onPress={() => this._onNext()}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                {/* <ScrollView> */}
                <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                    {/* {this.activePointSec()} */}
                    <ActivePointAndLocationSelectionTab {...this.props} selectedLocation={(value) => this.onSelectLocation(value)} />
                    {this.listHeaderSec()}
                    {this.listSec()}
                    {/* {this.transPointSec()}
                        {this.superTraderSec()} */}
                    {/* {this.creditAdjustmentSec()} */}

                    <View style={{ marginBottom: 50 }} />
                </View>
                {/* </ScrollView> */}
            </SafeAreaView >
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
        userSelectedBeatRouteData
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReedemScreen);