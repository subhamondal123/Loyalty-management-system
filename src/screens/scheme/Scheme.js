import React from "react";
import { SafeAreaView, View, Text, ScrollView, RefreshControl } from "react-native";
import { connect } from "react-redux";
import { Color, Dimension, FontFamily, FontSize, ImageName } from "../../enums";
import styles from "./Style";
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from "redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Header from "../header/Header";
import SvgComponent from "../../assets/svg";
import { ActivePointAndLocationSelectionTab, CatalogueItem, DynamicCategoryTab, DynamicOfferCard, DynamicRecentlyCard } from "../../pageShared";
import { StorageDataModification } from "../../services/common-view-function";
import { MiddlewareCheck, StoreUserOtherInformations } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
import { modOfferData, modRecentOfferData } from "./Function";
import { NoDataFound } from "../../shared";

let data = [

    {
        id: 1,
        image: ImageName.GIFT_BANNER,

    },
    {
        id: 2,
        image: ImageName.OFFER_BANNER,

    },
    {
        id: 3,
        image: ImageName.GIFT_BANNER,

    },
    {
        id: 4,
        image: ImageName.OFFER_BANNER,

    },
]

const tabDataArr = [
    {
        id: 1,
        name: "Offers"
    },

    {
        id: 2,
        name: "Additional Points"
    },
    {
        id: 1,
        name: "Gift"
    },

]


let joyadhaanidata = [

    {
        id: 1,
        image: ImageName.JOYADHAANI_BANNER,

    },
    {
        id: 2,
        image: ImageName.JOYADHAANI_BANNER,

    },
    {
        id: 3,
        image: ImageName.JOYADHAANI_BANNER,

    },
    {
        id: 4,
        image: ImageName.JOYADHAANI_BANNER,

    },
]

let imgData = [

    {
        id: 1,
        image: "images/image1",
        label: "Bike",
        amount: "2000"
    },
    {
        id: 2,
        image: "images/image1",
        label: "Car",
        amount: "2000"
    },
    {
        id: 3,
        image: "images/image1",
        label: "Bike",
        amount: "2000"
    },
    {
        id: 3,
        image: "images/image1",
        label: "Bike",
        amount: "2000"
    },
    {
        id: 3,
        image: "images/image1",
        label: "Bike",
        amount: "2000"
    },
    {
        id: 3,
        image: "images/image1",
        label: "Bike",
        amount: "2000"
    },

]



class SchemePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabData: tabDataArr,
            offerCard: [],
            recentOffer: [],
            listData: imgData,
            selectedLocationObj: {},
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            isApiCall: true,

        }
    }

    // this is a initial function which is call first
    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                await this._load();
            })
    }

    // this is the first function where set the state data
    _load = async () => {
        await this._apiCallRes();
        await this.getRecentOffer()
        StoreUserOtherInformations("", {}, this.props);
    }

    onRefresh = async () => {
        await this.setInitialState()
        await this._load
    }
    setInitialState = async () => {
        this.setState({
            offerCard: [],
            recentOffer: [],
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            isApiCall: true,
        })
    }
    // here list api call
    _apiCallRes = async () => {
        this.setState({ refreshing: false })
        let reqData = {
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
        }
        await this.getOfferByLocation(reqData)
    }

    getOfferByLocation = async (reqData) => {
        let responseData = await MiddlewareCheck("fetchOffer", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modOfferData(responseData.response)
                this.setState({ offerCard: modData })
            }
        }
    }

    getRecentOffer = async () => {
        let reqData = {

        }
        let responseData = await MiddlewareCheck("fetchLatestOffer", {}, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modRecentOfferData(responseData.response)
                this.setState({ recentOffer: modData })
            }
        }
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
                <View style={{ marginTop: 10, }}>
                    {this.state.tabLoader ?
                        skelitonPlaceHolder()
                        :
                        <React.Fragment>
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
                        </React.Fragment>
                    }
                </View>
            </>
        )
    }

    listSec = () => {
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 18, flexDirection: "row", }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: "row" }} >
                        {this.state.listData.map((item, key) => (
                            <View style={{ marginHorizontal: 5, marginVertical: 5 }} key={key}>
                                <CatalogueItem
                                    data={item}
                                    // onPress={(value) => onSelectItem(value)}
                                    width={Dimension.width / 3 - 20}
                                    backgroundColor={"#D1D1D1"}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

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
        await this.getOfferByLocation()
        await this.getRecentOffer()
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                <View style={{ marginHorizontal: 10 }}>
                    <ActivePointAndLocationSelectionTab {...this.props} selectedLocation={(value) => this.onSelectLocation(value)} />

                    {/* {this.tabSec()} */}
                </View>
                {this.state.offerCard.length == 0 && this.state.recentOffer.length == 0 ?
                    <React.Fragment>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.onRefresh()}
                                />
                            }
                        >
                            <View style={{ flex: 1, height: Dimension.height - 200, marginTop: 20, marginHorizontal: 10 }}>
                                <NoDataFound />
                            </View>
                        </ScrollView>

                    </React.Fragment>
                    :
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={{ marginHorizontal: 10 }}>
                            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => this.onRefresh()}
                                    />
                                }
                            >
                                {this.state.offerCard.map((item, key) => (
                                    <View key={key}>
                                        <DynamicOfferCard
                                            data={item}
                                        />
                                    </View>
                                ))}
                            </ScrollView>

                            {this.state.recentOffer.length > 0 ?
                                <>
                                    <View style={{ marginTop: 25 }}>
                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Recently get</Text>
                                    </View>
                                    <View style={{ marginTop: 8 }}>
                                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                            {this.state.recentOffer.map((item, key) => (
                                                <View key={key}>
                                                    <DynamicRecentlyCard
                                                        data={item}
                                                    />
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </>
                                :
                                null
                            }


                            {/* <View style={{ marginTop: 20 }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Upcoming Catalogue</Text>
                        </View>
                        {this.listSec()} */}
                        </View>
                    </ScrollView>
                }

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
        stateAllCountries,
        stateCheckForNetwork,
        stateUserInformation,
        userSelectedBeatRouteData
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SchemePage);