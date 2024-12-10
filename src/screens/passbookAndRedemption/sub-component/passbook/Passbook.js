import React, { Component } from 'react'
import { Animated, FlatList, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import styles from './Style'
import { PassbookTab, PassbookTransactionDetailModal } from '../../../../pageShared'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../../../enums'
import SvgComponent from '../../../../assets/svg'
import { BigTextButton, DropdownInputBox, Loader, NoDataFound, TextInputBox } from '../../../../shared'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { MiddlewareCheck } from '../../../../services/middleware'
import { formatYearRange, modifyFinancialYearDropdownData, modifyListData } from './Function'
import { ErrorCode } from '../../../../services/constant'
import { DateConvert, StorageDataModification } from '../../../../services/common-view-function'


export default class Passbook extends Component {
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
            scrollY: new Animated.Value(0),
            headerHeight: new Animated.Value(50),
            userData: {},
            propData: this.props.route.params.propData ? this.props.route.params.propData : {},
            selectedFinancialYearObj: {},
            financialYearArr: [],
        }
    }

    // this is a initial function which is call first
    componentDidMount = async () => {
        this._load();
    }

    // this is the first function where set the state data
    _load = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        this.setState({ userData: userInfo })
        await this.setFinancialYear()
        await this._apiCallRes();
    }

    _apiCallRes = async () => {
        this.setState({ refreshing: false, });
        let reqData = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
            "forFinancialYearId": this.state.selectedFinancialYearObj.id,

        }
        await this.getPassbookList(reqData);
    }

    setFinancialYear = async () => {
        let responseData = await MiddlewareCheck("getFinYear", {}, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.selectedFinancialYearObj = await this.modSelectedFinYear(responseData.response)
                this.setState({
                    financialYearArr: modifyFinancialYearDropdownData(responseData.response),
                    selectedFinancialYearObj: this.state.selectedFinancialYearObj
                })
            }
        }

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

    getPassbookList = async (reqData) => {
        let responseData = await MiddlewareCheck("getPassbookList", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modListData = modifyListData(responseData)
                if (modListData.list.length == 0) {
                    this.state.isApiCall = false;
                    this.setState(this.state)
                }
                this.setState({
                    listData: [...this.state.listData, ...modListData.list],
                    // listData: modListData.list,

                });
            }
        }

        this.setState({
            pageLoader: false,
            listLoader: false,
        })
    }

    renderList = (item, key) => {
        return (
            <View >
                <View style={{ flex: 1, marginHorizontal: '2%' }}>
                    {this.listSec(item, key)}
                </View>
            </View>
        );
    };

    showHide = () => {
    }

    listSec = (item, key) => {
        return (
            <View style={styles.activeBoxshadowColor} key={key}>
                <TouchableOpacity style={{ padding: 14 }} activeOpacity={0.9} onPress={() => this.showHide(item, key)}>
                    <View style={{ marginHorizontal: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#efefef', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 90 }}>
                            {/* <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getDDthMonthNameYYYYformat(item.createdAt).day}</Text> */}
                            {/* <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getDayName(item.createdAt)}</Text> */}
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>Lifted</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>for</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.salesDate.length > 0 ? DateConvert.getDDthMonthNameYYYYformat(item.salesDate).month : "N/A"}</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.salesDate.length > 0 ? DateConvert.getDDthMonthNameYYYYformat(item.salesDate).year : "N/A"}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: '5%' }}>
                            {/* <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Reference</Text> */}
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.pointCategoryName}</Text>

                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.type == 2 ? item.item : "Lifted From : " + item.liftFrom}</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.type == 2 ? "Redeemed on : " + DateConvert.formatDDMMYYYY(item.createdAt) : "Lifting marked on : " + DateConvert.formatDDMMYYYY(item.createdAt)}</Text>

                        </View>
                        {item.type == 1 || item.type == 3 ?
                            <SvgComponent svgName={"greenDownArrow"} strokeColor={"#61C234"} height={14} width={14} />
                            :
                            <SvgComponent svgName={"redUpArrow"} strokeColor={"#F13748"} height={14} width={14} />
                        }
                        {item.isLockPointConverted == 0 ?
                            <SvgComponent svgName={"blueLock"} strokeColor={"#000"} height={18} width={18} />
                            :
                            <SvgComponent svgName={"unlock"} strokeColor={"#000"} height={18} width={18} />
                        }
                        <View style={{ width: 8 }} />
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.point}</Text>
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
            <View style={{ marginBottom: 300 }}>
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 300 }} />
        );
    };


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
                        placeholder={"Search by Name "}
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
                    <SvgComponent svgName={"lmsCalender"} strokeColor={"#000"} height={17} width={17} />
                    <View style={{ flex: 0.25 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 15, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5 }}>March 23</Text>
                    </View>
                    <View style={{ flex: 0.6 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5 }}>Description</Text>
                    </View>
                    <View style={{ flex: 0.15 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.INTER.MEDIUM, marginLeft: 5, textAlign: "right" }}>Points</Text>
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

    financialYearSec = () => {
        const onChangeFinancialYear = async (val) => {
            this.setState({ selectedFinancialYearObj: val })
            await this.setInitialStateData()
            await this._apiCallRes()
        }
        return (
            <>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 0.7 }} />

                    <View style={{ flex: 0.3 }}>
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
            </>
        )
    }

    modalSec = () => {
        return (
            <>
                <PassbookTransactionDetailModal isVisible={this.state.isVisibleDetailsModal} onCloseModal={() => this.showHide()} />
            </>
        )
    }

    filterSec = () => {
        return (
            <>
            </>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.modalSec()}
                <View>
                    {this.financialYearSec()}
                    {this.filterSec()}
                </View>

                {/* {this.searchSec()} */}
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
                                <View style={{ marginTop: 10, height: Dimension.height }}>
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
