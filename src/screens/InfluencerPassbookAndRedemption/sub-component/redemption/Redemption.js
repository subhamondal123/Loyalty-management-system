import React, { Component } from 'react'
import { Animated, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import styles from './Style'
import { PassbookTransactionDetailModal } from '../../../../pageShared'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../../../enums'
import SvgComponent from '../../../../assets/svg'
import { BigTextButton, Loader, NoDataFound, TextInputBox } from '../../../../shared'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { modifyListData } from './Function'
import { MiddlewareCheck } from '../../../../services/middleware'
import { ErrorCode } from '../../../../services/constant'
import { DateConvert } from '../../../../services/common-view-function'
import { RefreshControl } from 'react-native-gesture-handler'


export default class Redemption extends Component {
    constructor(props) {
        super(props)

        this.state = {
            limit: 10,
            pageNum: 0,
            isVisibleFilter: false,
            searchText: "",
            pageLoader: true,
            refreshing: true,
            listLoader: false,
            isApiCall: true,
            isVisibleDetailsModal: false,
            listData: [],
            selectedItem: {},
            propData: this.props.route.params.propData,

            scrollY: new Animated.Value(0),
            headerHeight: new Animated.Value(50),
        }
    }

    // this is a initial function which is call first
    componentDidMount = async () => {
        this._load();
    }

    // this is the first function where set the state data
    _load = () => {
        this._apiCallRes();
    }

    _apiCallRes = async () => {
        this.setState({ refreshing: false, });
        let reqData = {
            "refUserId": this.state.propData.id.toString(),
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
        }
        await this.getRedeemList(reqData);
    }


    onRefresh = async () => {
        await this.setInitialStateData()
        await this._apiCallRes()
    }

    setInitialStateData = async () => {
        this.setState({
            limit: 10,
            pageNum: 0,
            refreshing: true,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            searchText: "",
            listData: []
        })
    }

    getRedeemList = async (reqData) => {
        let responseData = await MiddlewareCheck("getRedemptionHistory", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modListData = modifyListData(responseData)
                if (modListData.list.length == 0) {
                    this.state.isApiCall = false;
                    this.setState(this.state)
                }
                this.setState({
                    listData: [...this.state.listData, ...modListData.list],
                });
            }
        }

        this.setState({
            pageLoader: false,
            listLoader: false,
        })
    }

    onSelectTab = (item) => {
        this.props.navigation.navigate("RedemptionDetails", { item: item })
    }

    renderList = (item, key) => {
        return (
            <View >
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    {this.listSec(item, key)}
                </View>
            </View>
        );
    };


    listSec = (item, key) => {
        return (
            <TouchableOpacity style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 10, marginTop: 15 }} onPress={() => this.onSelectTab(item)}>
                <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: item.imagePath }} style={{ height: 90, width: 90, resizeMode: 'cover', borderRadius: 12 }} />
                        <View style={{ flex: 1, marginLeft: 10, paddingVertical: 2 }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 13, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>{item.itemName}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 2, alignItems: "center" }}>
                                <SvgComponent svgName={"calender"} strokeColor={"#000"} height={15} width={15} />
                                <Text style={{ color: '#535C63', fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginLeft: 5 }}>{DateConvert.formatDDfullMonthYYYY(item.createdAt)}</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <View style={{ backgroundColor: item.approvedStatus == 0 ? "#E3BE5D" : item.approvedStatus == 1 ? '#9ff7a2' : '#C372CA', paddingVertical: 2, paddingHorizontal: 2, borderRadius: 16, alignSelf: "flex-start", marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    {/* <View style={{ backgroundColor: '#57c95a', height: 20, width: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>L5</Text>
                                    </View> */}

                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 10, marginRight: 10 }}>{item.approvedStatus == 0 ? "Pending" : item.approvedStatus == 1 ? "Approved  by Admin" : "Rejected by Admin"}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{}}>
                            <Text style={{ color: '#FF2E00', fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, textAlign: 'right' }}>-{item.point}</Text>
                            <Text style={{ color: '#535C63', fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, textAlign: 'right' }}>points</Text>
                        </View>

                    </View>

                </View>
            </TouchableOpacity>
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
            <View style={{ marginBottom: 300 }}>
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 300 }} />
        );
    };

    // for change the state for refrace
    _onSetChangeData = async () => {
        this.setState({
            listData: [],
            pageLoader: true,
            listLoader: true,
            refreshing: true,
            limit: 10,
            pageNum: 0,
        })
    }

    filterModal = () => {
        this.setState({ isVisibleFilter: true })
    }

    activePointSec = () => {
        return (
            <View style={{ marginHorizontal: 10, marginTop: 15, flexDirection: "row", alignItems: "center" }}>
                <View style={{ borderWidth: 1, borderRadius: 30, borderColor: "#839CAE", alignSelf: "flex-start", alignItems: "center", flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5 }}>
                    <SvgComponent svgName={"nineDot"} strokeColor={"#00AB1B"} height={11} width={11} />
                    <Text style={{ color: "#817D7A", fontSize: 12, fontFamily: FontFamily.FONTS.INTER.REGULAR, marginLeft: 5 }}>Active Point : </Text>
                    <Text style={{ color: "#00AB1B", fontSize: 12, fontFamily: FontFamily.FONTS.INTER.BOLD, marginLeft: 5 }}>2200</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => this.filterModal()}>
                    <SvgComponent svgName={"filter"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={24} width={24} />
                </TouchableOpacity>
            </View>
        )
    }


    searchSec = () => {
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
        const onSearch = (val) => {
            this.setState({ searchText: val })
        }
        const onPressSearchIcon = () => {

        }
        return (
            <>
                <Animated.View style={{ marginTop: 10, marginHorizontal: 10, opacity: headerOpacity, height: headerHeight }}>
                    <TextInputBox
                        placeholder={"Search by Name"}
                        placeholderTextColor={"#747C90"}
                        isRightIcon={true}
                        rightIcon={ImageName.SEARCH_LOGO}
                        rightIconStyle={{ height: 25, width: 25 }}
                        height={45}
                        borderRadius={22}
                        additionalBoxStyle={{ borderColor: "#747C90", borderWidth: 0.5 }}
                        additionalTextInput={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 12 }}
                        value={this.state.searchText}
                        onChangeText={(value) => onSearch(value)}
                        onPressLeftIcon={() => onPressSearchIcon()}
                    />
                </Animated.View>
            </>
        )
    }

    headingSec = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 10, paddingVertical: 10, alignItems: "center", marginHorizontal: 15 }}>
                    <SvgComponent svgName={"calender"} strokeColor={"#000"} height={15} width={15} />
                    <View style={{ flex: 0.25 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 15, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5 }}>March 23</Text>
                    </View>
                    <View style={{ flex: 0.3 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5 }}>Description</Text>
                    </View>
                    <View style={{ flex: 0.4 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5, textAlign: "right" }}>5 Redemptions</Text>
                    </View>
                </View>
                <View style={{ borderWidth: 0.1, borderColor: Color.COLOR.BLUE.LOTUS_BLUE, marginHorizontal: 10, backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE }} />
            </View>
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

    footerSec = () => {
        return (
            <View style={{ marginHorizontal: 15, flexDirection: 'row', bottom: 2, position: 'absolute' }}>
                <TouchableOpacity onPress={() => this.addAnotherInv()} style={{ backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, flex: 0.5, justifyContent: "center", alignItems: "center", borderWidth: 0.5, borderColor: "#F13748" }}>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Previous</Text>
                </TouchableOpacity>
                <View style={{ width: 100 }} />
                <TouchableOpacity onPress={() => this.sendToConfirm()} style={{ backgroundColor: "#F13748", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }

    modalSec = () => {
        return (
            <>
                <PassbookTransactionDetailModal isVisible={this.state.isVisibleDetailsModal} onCloseModal={() => this.showHide()} />
            </>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.modalSec()}
                {this.searchSec()}
                {/* {this.headingSec()} */}
                {this.state.pageLoader ?
                    <View>
                        <SkeletonPlaceholder>
                            {this.ViewSkeletonPlaceholder()}
                        </SkeletonPlaceholder>
                    </View> :
                    <View>
                        {this.state.listData.length > 0 ?
                            <FlatList
                                data={this.state.listData}
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
                                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                                    useNativeDriver: false,
                                })}
                            />
                            :
                            <React.Fragment>
                                <View style={{ height: Dimension.height, marginTop: 10 }}>
                                    <NoDataFound />
                                </View>
                            </React.Fragment>
                        }

                    </View>
                }
                {/* {this.footerSec()} */}
            </SafeAreaView>
        )
    }
}
