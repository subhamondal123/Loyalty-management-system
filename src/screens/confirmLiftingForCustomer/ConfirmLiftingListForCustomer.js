import { Animated, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import Header from '../header/Header';
import { ProfileSec } from '../../pageShared';
import { NoDataFound, TextInputBox } from '../../shared';
import { Color, FontFamily, FontSize, ImageName } from '../../enums';
import { MiddlewareCheck } from '../../services/middleware';
import { Toaster } from '../../services/common-view-function';
import { customerModifyData } from './Function';
import styles from './Style';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from '../../redux/Sales360Action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ErrorCode } from '../../services/constant';

class ConfirmLiftingListForCustomer extends Component {
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
            isApiCall: true
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
        this.setState({ refreshing: false });
        let dataReq = {
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "limit": this.state.limit.toString(),
            "contactTypeName": this.state.searchText
        }
        await this.fetchCustomerListData(dataReq);
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
            isApiCall: true
        })
    }

    fetchCustomerListData = async (dataReq) => {
        let responseData = await MiddlewareCheck("fetchInfluencerDetails", dataReq, this.props);
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
        this.setState({
            pageLoader: false,
            listLoader: false,
        })
    }

    onUpdateForm = (item) => {
        this.props.navigation.navigate("UpdateLiftingFormForCustomer", { propData: this.props.route.params.propData, data: item })
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
            await this.onRefresh()
        }
        return (
            // <Animated.View style={{ marginTop: 10, alignItems: 'center', opacity: headerOpacity, height: headerHeight }}>
            <View style={{ marginTop: 10 }}>
                <TextInputBox
                    placeholder={"Search by Name or Number"}
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
            </View>
            // </Animated.View>
        )
    }

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

    headerSec = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 5 }}>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Lifted By</Text>
                </View>
                <View style={{ flex: 1 }} />
                {/* <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.9} onPress={() => this.onFilter()}>
                    <Image source={ImageName.FILTER_WITH_SEARCH} style={{ height: 24, width: 24, resizeMode: "contain" }} />
                </TouchableOpacity> */}
            </View>
        )
    }

    onFilter = () => {

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
                                <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }} numberOfLines={2}>{item.custBusinessName}</Text>
                            </View>
                            <View>
                                <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{item.address}</Text>
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                <ProfileSec props={this.props} />
                <View style={{ marginHorizontal: 15 }}>
                    {this.headerSec()}
                    {this.searchSec()}
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
                                < React.Fragment>
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
                                <React.Fragment>
                                    <View style={{ marginTop: 20, height: Dimension.height }}>
                                        <NoDataFound />
                                    </View>
                                </React.Fragment>
                            }
                        </React.Fragment>
                    }

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


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmLiftingListForCustomer);