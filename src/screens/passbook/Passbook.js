import React, { Component } from 'react'
import { FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { CustomStyle } from '../style'
import Header from '../header/Header'
import { ActivePointAndLocationSelectionTab } from '../../pageShared'
import { Color, FontFamily, FontSize, ImageName } from '../../enums'
import styles from './Style'
import { DateConvert, StorageDataModification } from '../../services/common-view-function'
import { MiddlewareCheck } from '../../services/middleware'
import { CommonData, ErrorCode } from '../../services/constant'
import { getStartEndDate, modifyListData } from './Function'
import { Loader, NoDataFound } from '../../shared'
import SvgComponent from '../../assets/svg'
import MonthlyCalendar from '../../shared/monthly-calender'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

export default class Passbook extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listData: [],
            limit: 10,
            pageNum: 0,
            pageLoader: true,
            listLoader: false,
            isApiCall: true,
            selectedMonth: DateConvert.getDDthMonthNameYYYYformat(new Date()).month,
            selectedYear: DateConvert.getDDthMonthNameYYYYformat(new Date()).year,
            isCalenderVisible: false,
            firstDate: "",
            lastDate: "",
        }
    }

    componentDidMount = () => {
        this._load();
    }

    _load = async () => {
        const selectedMonthIndex = CommonData.COMMON.MONTHS.indexOf(this.state.selectedMonth);
        let dateObj = getStartEndDate(this.state.selectedYear, selectedMonthIndex);
        this.setState({ firstDate: dateObj.firstDate, lastDate: dateObj.lastDate })
        this.getPassbookList();
    }

    getPassbookList = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        let reqData = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
            "refUserId": userInfo.userId,
            "fromDate": this.state.firstDate ? DateConvert.formatYYYYMMDD(this.state.firstDate) : "",
            "toDate": this.state.lastDate ? DateConvert.formatYYYYMMDD(this.state.lastDate) : ""
        }

        let responseData = await MiddlewareCheck("getPassbookList", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modListData = modifyListData(responseData)
                if (modListData.list.length == 0) {
                    this.state.isApiCall = false;
                    this.setState(this.state)
                }
                const list = [
                    {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 1
                    },
                    {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 1
                    },
                    {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 1
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 2
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 1
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 3
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 3
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 3
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 3
                    }, {
                        createdAt: "2011-08-12T20:17:46.384Z",
                        customerName: "Stock Update",
                        product: "WEVB0876",
                        point: "135",
                        quantity: "25MT",
                        type: 3
                    },
                ]
                this.setState({
                    listData: [...this.state.listData, ...modListData.list],
                    // listData: list
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
                <View style={{ marginHorizontal: 2 }}>
                    {this.listSec(item, key)}
                </View>
            </View>
        );
    };

    showHide = () => {
    }

    onPressMonth = (type) => {
        this.setState({ isCalenderVisible: type });
    }

    onSelectMonth = async (month, year, selectedMonthIndex) => {
        let { firstDate, lastDate } = getStartEndDate(year, selectedMonthIndex)
        this.setState({
            selectedMonth: month,
            selectedYear: year,
            firstDate: firstDate,
            lastDate, lastDate,
            listData: [],
            pageLoader: true,
            listLoader: true,
            limit: 10,
            pageNum: 0,
            pointLoader: true,
            isApiCall: true
        })
        await this.getPassbookList();
    }

    resetToCurrentMonth = async () => {
        let selectedMonth = DateConvert.getDDthMonthNameYYYYformat(new Date()).month;
        let selectedYear = DateConvert.getDDthMonthNameYYYYformat(new Date()).year;
        const selectedMonthIndex = CommonData.COMMON.MONTHS.indexOf(selectedMonth);
        let dateObj = getStartEndDate(selectedYear, selectedMonthIndex);
        this.setState({
            selectedMonth: DateConvert.getDDthMonthNameYYYYformat(new Date()).month,
            selectedYear: DateConvert.getDDthMonthNameYYYYformat(new Date()).year,
            firstDate: dateObj.firstDate,
            lastDate: dateObj.lastDate,
            listData: [],
            pageLoader: true,
            listLoader: true,
            limit: 10,
            pageNum: 0,
            pointLoader: true,
            isApiCall: true
        })
        await this.getPassbookList();
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
        // return <View style={{ marginBottom: 300 }} />
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
                    this.getPassbookList();
                } else {
                    this.setState({ listLoader: false })
                    return null;
                }
            }
        );
        // }
    };

    listSec = (item, key) => {
        return (
            <View style={styles.activeBoxshadowColor} key={key}>
                <View style={{ padding: 14 }}>
                    <View style={{ marginHorizontal: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#efefef', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getDDthMonthNameYYYYformat(item.createdAt).day}</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getDDthMonthNameYYYYformat(item.createdAt).month}</Text>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{DateConvert.getDDthMonthNameYYYYformat(item.createdAt).year}</Text>
                            {/* <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>inf</Text> */}


                        </View>
                        <View style={{ flex: 1, marginLeft: '5%' }}>
                            {/* <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Reference</Text> */}
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.hmName}</Text>
                            <Text style={{ color: Color.COLOR.GRAY.GRAY_TINTS, fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.productQuantity + " " + item.unitShort}</Text>
                        </View>
                        {item.type == 1 || item.type == 3 ?
                            <SvgComponent svgName={"greenDownArrow"} strokeColor={"#61C234"} height={14} width={14} />
                            :
                            <SvgComponent svgName={"redUpArrow"} strokeColor={"#F13748"} height={14} width={14} />
                        }
                        {/* {item.type == 1 ?
                  <SvgComponent svgName={"blueLock"} strokeColor={"#000"} height={18} width={18} />
                  :
                  <SvgComponent svgName={"unlock"} strokeColor={"#000"} height={18} width={18} />
                } */}
                        <View style={{ width: 8 }} />
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{item.point}</Text>
                    </View>
                </View>
            </View>
        )
    }

    skeletonSec = () => {
        return (
            <View style={{ marginTop: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{ height: 100, marginVertical: 10, borderRadius: 8, marginHorizontal: 20 }} />
                    <View style={{ height: 100, marginVertical: 10, borderRadius: 8, marginHorizontal: 20 }} />
                    <View style={{ height: 100, marginVertical: 10, borderRadius: 8, marginHorizontal: 20 }} />
                    <View style={{ height: 100, marginVertical: 10, borderRadius: 8, marginHorizontal: 20 }} />
                    <View style={{ height: 100, marginVertical: 10, borderRadius: 8, marginHorizontal: 20 }} />
                </SkeletonPlaceholder>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={CustomStyle.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                <MonthlyCalendar
                    visible={this.state.isCalenderVisible}
                    onClose={() => this.onPressMonth(false)}
                    month={this.state.selectedMonth}
                    year={this.state.selectedYear}
                    onSelect={(month, year, selectedMonthIndex) => this.onSelectMonth(month, year, selectedMonthIndex)}
                    onBackdropPress={() => this.onPressMonth(false)}
                    onBackButtonPress={() => this.onPressMonth(false)}
                    onReset={() => this.resetToCurrentMonth()}
                    buttonColor={Color.COLOR.RED.AMARANTH}
                    isRightBtnDisabled={false}
                    isLeftBtnDisabled={false}
                />
                <View style={{ flexDirection: "row", alignItems: "center", margin: 20, marginTop: 10 }}>
                    <TouchableOpacity style={{ flexDirection: "row", flex: 1 }} onPress={() => this.onPressMonth(true)}>
                        <Image source={ImageName.CALENDER_LOGO} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                        <Text style={{ marginLeft: 10, color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{this.state.selectedMonth}</Text>
                        <Text style={{ marginLeft: 5, color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{this.state.selectedYear}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>Points</Text>
                    </View>
                </View>
                {this.state.pageLoader ?
                    <>
                        {this.skeletonSec()}
                    </>
                    :
                    <>
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
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={this.state.refreshing}
                            //         onRefresh={() => this.onRefresh()}
                            //     />
                            // }
                            // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                            //     useNativeDriver: false,
                            // })}
                            />
                            :
                            <View style={{ justifyContent: "center", alignItems: "center", height: 500 }}>
                                <NoDataFound />
                            </View>
                        }
                    </>
                }
            </SafeAreaView>
        )
    }
}
