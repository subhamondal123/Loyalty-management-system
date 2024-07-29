import React, { Component, forwardRef } from 'react'
import { ActivityIndicator, Animated, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { MiddlewareCheck } from '../../../services/middleware';
import { modifyData } from './function';
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../../enums';
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../../redux/Sales360Action";
import { App_uri } from '../../../services/config';
import { connect } from 'react-redux';
import { ErrorCode } from '../../../services/constant';
import { Loader, NoDataFound, TextInputBox } from '../../../shared';
import { bindActionCreators } from 'redux';
import SvgComponent from '../../../assets/svg';
import DynamicCategoryTab from '../dynamicCategoryTab/DynamicCategoryTab';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LmsLocationMapping from '../lmsLocationMapping';
import { StorageDataModification } from '../../../services/common-view-function';


class AllCustomerList extends Component {

    // Define default props using static defaultProps
    // static defaultProps = {
    //     requestData: {},
    //     onRefreshList: () => { }
    // };

    //constructor
    constructor(props) {
        super(props)

        this.state = {
            limit: 12,
            pageNum: 0,
            refreshing: true,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            customerList: [],
            customerIdArr: [],
            searchText: ""
        }
    }

    componentDidMount = () => {
        this.load()
    }

    load = async () => {
        let lastLevelLocation = await StorageDataModification.routeData({}, "get");
        console.log("lastLevelLOcation-----::::", JSON.stringify(lastLevelLocation));
        await this._apiCallRes()
    }

    _apiCallRes = async () => {
        this.setState({ refreshing: false, });
        if (this.props.Sales360Redux.routeData.hierarchyTypeId && this.props.Sales360Redux.routeData.hierarchyDataId) {
            let dataReq = {
                "limit": this.state.limit.toString(),
                "offset": (this.state.pageNum * this.state.limit).toString(),
                "searchText": this.props.requestData.searchText,
                "searchTextCustName": "",
                "searchTextCustType": "",
                "searchTextCustPhone": "",
                "searchTextCustBusinessName": "",
                "searchCustPartyCode": "",
                "searchCustVisitDate": "",
                "searchFrom": "",
                "searchTo": "",
                "status": "",
                "contactType": "",
                "phoneNo": "",
                "isProject": "0",
                "contactTypeId": this.props.requestData.selectedCustomerType.id == undefined || this.props.requestData.selectedCustomerType.id == null ? "" : this.props.requestData.selectedCustomerType.id,
                "contactTypeIdArr": [],
                "isDownload": "0",
                "approvalList": "0",
                "customerAccessType": "",
                "hierarchyDataIdArr": [{ "hierarchyTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId, "hierarchyDataId": this.props.Sales360Redux.routeData.hierarchyDataId }],
            }
            await this.fetchListData(dataReq);
        }
    }

    fetchListData = async (dataReq) => {
        console.log("datareqq-----", dataReq)
        let responseData = await MiddlewareCheck("registrationList", dataReq, this.props);
        console.log("registrationList:::Res------", JSON.stringify(responseData));
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let listData = modifyData(responseData);
                if (listData.list.length == 0) {
                    this.state.isApiCall = false;
                }
                this.setState({
                    customerList: [...this.state.customerList, ...listData.list],
                });
            }
        }
        this.setState({
            pageLoader: false,
            listLoader: false,
        })
    }

    onRefresh = async () => {
        await this.setInitialStateData()
        await this._apiCallRes()
    }

    setInitialStateData = async () => {
        this.setState({
            limit: 12,
            pageNum: 0,
            refreshing: true,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            customerList: [],
            customerIdArr: [],
            searchText: ""
        })
    }

    onSelectItem = (item) => {
        this.props.onSelect(item)
    }

    renderList = (item, key) => {
        return (
            <View >
                <View style={{ flex: 1, marginHorizontal: '2%', marginBottom: 10 }}>
                    {this.listSec(item, key)}
                </View>
            </View>
        );
    };

    listSec = (item, key) => {
        return (
            <View style={{}} key={key}>
                <TouchableOpacity
                    onPress={() => this.onSelectItem(item)}
                    style={{ alignItems: 'center', marginHorizontal: 5, justifyContent: "center", width: Dimension.width / 4 - 30 }}>
                    <Image source={item.profilePic.length == 0 ? ImageName.USER_IMG : { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + item.profilePic }} style={{ height: 65, width: 65, resizeMode: 'cover', borderRadius: 100, borderWidth: 0.3, borderColor: "#D1D1D1" }} />
                    <View style={{}}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginTop: 8, textAlign: "center" }} numberOfLines={2}>{item.custBusinessName ? item.custBusinessName : item.customerName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

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
                    this._apiCallRes();
                } else {
                    this.setState({ listLoader: false })
                    return null;
                }
            }
        );
        // }
    };
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

    ViewSkeletonPlaceholder = () => {
        return (
            <>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 20 }}>
                        <View style={{ marginLeft: 5, width: Dimension.width / 4 - 30, height: 65, borderRadius: 100 }} />
                        <View style={{ width: 50, height: 15, borderRadius: 10, marginTop: 10 }} />
                    </View>
                </View>
            </>

        )
    }

    activePointSec = () => {
        return (
            <React.Fragment>
                <View style={{ borderWidth: 1, borderRadius: 30, borderColor: "#839CAE", alignSelf: "flex-start", alignItems: "center", flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5 }}>
                    <SvgComponent svgName={"locationWithBGColor"} strokeColor={"#F13748"} height={11} width={11} />
                    <Text style={{ color: "#817D7A", fontSize: 12, fontFamily: FontFamily.FONTS.INTER.REGULAR, marginLeft: 5 }}>Kolkata </Text>
                    <Text style={{ color: "#F13748", fontSize: 11, fontFamily: FontFamily.FONTS.INTER.BOLD, marginRight: 5 }}>Zone 2</Text>
                    <View style={{ flex: 0.7 }} />
                    <SvgComponent svgName={"downArrow"} strokeColor={"#F13748"} height={11} width={11} />
                </View>
            </React.Fragment>

        )
    }

    onSelectLocationData = (val) => {
    }


    render() {
        return (
            // <SafeAreaView>
            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                {this.state.pageLoader ?
                    <View style={{ height: Dimension.height / 2 }}>
                        <SkeletonPlaceholder>
                            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                                {this.ViewSkeletonPlaceholder()}
                            </ScrollView>
                        </SkeletonPlaceholder>
                        {/* <ActivityIndicator color={"blue"} /> */}
                    </View>
                    :
                    <React.Fragment>
                        {this.state.customerList.length > 0 ?
                            <React.Fragment>
                                <FlatList
                                    numColumns={4}
                                    data={this.state.customerList}
                                    renderItem={({ item, index }) => this.renderList(item, index)}
                                    // keyExtractor={(item, key) => key}
                                    onEndReached={this.fetchMore}
                                    onEndReachedThreshold={0.1}
                                    ListFooterComponent={this.renderLoader}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh()}
                                        />
                                    }
                                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.props.scrollY } } }], {
                                        useNativeDriver: false,
                                    })}
                                />
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <View style={{ marginTop: 20, height: Dimension.height }}>
                                    <NoDataFound />
                                </View>
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
            </View>
            //  </SafeAreaView> 
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

export default connect(mapStateToProps, mapDispatchToProps)(AllCustomerList);

