import { ActivityIndicator, Animated, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { modRecentLiftingData, modSalesPermData, validateData } from './Function'
import { Color, FontFamily, FontSize, ImageName } from '../../enums'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { DateConvert, StorageDataModification, Toaster } from '../../services/common-view-function'
import SvgComponent from '../../assets/svg'
import { Loader, Modal, TextInputBox } from '../../shared'
import Header from '../header/Header'
import styles from './Style'
import _debounce from 'lodash/debounce';
import { Regex } from '../../services/config'

class AllRecentLiftingListCustomer extends React.Component {
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
            recentLoader: true,
            pageNum: 0,
            limit: 5,
            isApiCall: true,
            listLoader: true,

            userInfo: {},
            actualLiftingFromDate: "",
            actualLiftingToDate: "",
            createFromDate: "",
            createToDate: "",
            hierarchyDataObj: {
                hierarchyDataId: "",
            },
            statusObj: {
                id: ""
            },
            searchText: "",
            editLiftingLoader: false,
            isEditModalVisible: false,
            selectedLiftingItem: {},
            salesPermissionData: [],
            editPermLoader: true,
            editQuantityValue: ""
        }
    }

    componentDidMount = async () => {
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        //         await this.setInitialState()
        //         await this.load()
        //     })
        let userInfo = await StorageDataModification.userCredential({}, "get");
        this.setState({ userInfo: userInfo })
        await this.load()
    }

    // setInitialState = async () => {
    //     this.setState({
    //         totalMtd: "",
    //         recentLiftingData: [],
    //         recentLoader: false
    //     })
    // }


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
        // await this.fetchRecentSecondarySalesList();
        await this.fetchApiCall();
    }

    fetchApiCall = async () => {
        await this.fetchSaleEditPermissionApiCall();
        await this.fetchRecentSecondarySalesList();
    }

    fetchSaleEditPermissionApiCall = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        let reqData = { "targetTypeId": userInfo.usertypeId, "refCustomerId": userInfo.customerId.toString() };
        let responseData = await MiddlewareCheck("fetchSaleEditPermission", reqData, this.props);
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let salesPermData = modSalesPermData(responseData.response);
                this.setState({ salesPermissionData: salesPermData ? salesPermData : [] });
                // await this.fetchRecentSecondarySalesList(responseData.response[0])
            }
        }
        this.setState({ editPermLoader: false })
    }

    fetchRecentSecondarySalesList = async () => {
        this.setState({ refreshing: false })
        let reqData = {
            "refCustomerId": this.state.userInfo.customerId.toString(),
            searchText: this.state.searchText,
            refUserId: this.state.userInfo.customerId.toString(),
            mstSlNo: this.state.userInfo.mstSlNo.toString(),
            offset: (this.state.pageNum * this.state.limit).toString(),
            limit: this.state.limit.toString(),
            searchFromLiftingDate: this.state.actualLiftingFromDate,
            searchToLiftingDate: this.state.actualLiftingToDate,
            searchFromCreatedDate: this.state.createFromDate,
            searchToCreatedDate: this.state.createToDate,
            status: this.state.statusObj.id ? this.state.statusObj.id : "",
            hierarchyDataId: this.state.hierarchyDataObj.hierarchyDataId
            // isCustomer: this.props.route.params.type == "customer" ? "1" : "0",
        }
        let responseData = await MiddlewareCheck("fetchRecentSecondarySalesList", reqData, this.props);

        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modifyData = modRecentLiftingData(responseData.response, this.state.salesPermissionData);
                if (modifyData.list.length == 0) {
                    this.setState({ isApiCall: false })
                }
                this.setState({ recentLiftingData: [...this.state.recentLiftingData, ...modifyData.list] })
            }
        }
        this.setState({ recentLoader: false, listLoader: false })
    }

    skelitonSec = () => {
        return (
            <>
                <SkeletonPlaceholder>
                    <View style={{ height: 140, borderRadius: 10, marginTop: 15, marginHorizontal: 15 }} />
                    <View style={{ height: 140, borderRadius: 10, margin: 15 }} />
                    <View style={{ height: 140, borderRadius: 10, margin: 15 }} />
                    <View style={{ height: 140, borderRadius: 10, margin: 15 }} />
                </SkeletonPlaceholder>
            </>
        )
    }

    renderList = (item, index) => {
        return (
            <View >
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    {this.recentLiftingSec(item, index)}
                </View>
            </View>
        );
    }

    onRefresh = async () => {
        this.setState({
            limit: 5,
            pageNum: 0,
            recentLoader: true,
            listLoader: true,
            recentLiftingData: [],
            isApiCall: true

        })
        await this.load();
    }

    // for change the state for refrace
    _onSetChangeData = async () => {
        this.setState({
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
            pageNum: 0,
            limit: 5,
            isApiCall: true,
            listLoader: true,

            actualLiftingFromDate: "",
            actualLiftingToDate: "",
            createFromDate: "",
            createToDate: "",
            hierarchyDataObj: {
                hierarchyDataId: "",
            },
            statusObj: {
                id: ""
            }
        })
    }

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
                    this.fetchRecentSecondarySalesList();
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
            <View style={{ marginBottom: 200 }}>
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 200 }} />
        );
    };

    recentLiftingSec = (item, key) => {
        return (
            <React.Fragment>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.COLOR.BLUE.ALICE_BLUE, borderRadius: 10, padding: 10, marginVertical: 5 }} key={key}>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ height: 55, width: 55, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{ uri: item.liftFromUserProfilePic }} style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 25 }} />
                        </View>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? "From" : "To"}</Text>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? (item.liftFromCustName && item.liftFromCustName.length > 0 ? item.liftFromCustName : item.liftFromUserName) : (item.referCustName && item.referCustName.length > 0 ? item.referCustName : item.referUserName)}</Text>
                        <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>{this.state.userInfo.mstSlNo == 4 ? item.liftFromUserTypeName : item.refUserTypeName}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 10 }}>
                                <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Act. Lifting Month</Text>
                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>{DateConvert.getMonthYearName(item.salesDate)}</Text>
                            </View>
                            <View>
                                <Text style={{ color: "#747C90", fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>Create Date</Text>
                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 10 }}>{DateConvert.getDayMonthYearName(item.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: Color.COLOR.GRAY.GRAY_COLOR, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS, marginRight: 10 }}>{item.topLevelProduct}</Text>
                            <Image source={ImageName.RED_BOX} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS, marginRight: 10 }}>{item.leafLevelProduct}</Text>
                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: FontSize.XS }}>{item.productQuantity}{item.unitName}.</Text>
                        </View>
                        <Image source={ImageName.YELLOW_CLOCK} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XXS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Subject to Approval</Text>
                        {item.isEdit ?
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }} />
                                {this.state.editLiftingLoader ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <ActivityIndicator size="small" color={Color.COLOR.BLACK.PURE_BLACK} />
                                    </View>
                                    :
                                    <TouchableOpacity style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.onEditLIfting(true, item)}>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>Edit</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            : null
                        }
                    </View>
                </View>
            </React.Fragment>
        )
    }

    onFilter = async (data) => {
        await this._onSetChangeData();
        this.state.actualLiftingFromDate = data.actLiftingDate.fromDateObj.toDate ? DateConvert.fullDateFormat(data.actLiftingDate.fromDateObj.rawDate) : "";
        this.state.actualLiftingToDate = data.actLiftingDate.toDateObj.toDate ? DateConvert.fullDateFormat(data.actLiftingDate.toDateObj.rawDate) : "";
        this.state.createFromDate = data.createdDate.fromDateObj.toDate ? DateConvert.fullDateFormat(data.createdDate.fromDateObj.rawDate) : "";
        this.state.createToDate = data.createdDate.toDateObj.toDate ? DateConvert.fullDateFormat(data.createdDate.toDateObj.rawDate) : "";
        this.state.statusObj.id = data.statusObj.id;
        this.state.hierarchyDataObj.hierarchyDataId = data.productObj.hierarchyDataId;
        this.setState({
            searchFromLiftingDate: this.state.actualLiftingFromDate,
            searchToLiftingDate: this.state.actualLiftingToDate,
            searchFromCreatedDate: this.state.createFromDate,
            searchToCreatedDate: this.state.createToDate,
            statusObj: this.state.statusObj,
            hierarchyDataObj: this.state.hierarchyDataObj,
            recentLiftingData: [],
            recentLoader: true,
            listLoader: true
        })
        await this.fetchRecentSecondarySalesList();
    }

    onResetModal = async () => {
        await this._onSetChangeData();
        await this.fetchRecentSecondarySalesList();
        this.setState({ refreshing: false })
    }
    debouncedFetchData = _debounce(async () => {
        this.setState({
            limit: 5,
            pageNum: "0",
            recentLoader: true,
            listLoader: true,
            recentLiftingData: [],
            isApiCall: true

        })
        await this.fetchRecentSecondarySalesList();
    }, 400);

    searchSec = () => {
        const onSearch = async (val) => {
            this.setState({ searchText: val })
            await this.debouncedFetchData()
        }
        // const onPressSearchIcon = async () => {
        //     await this.onRefresh()
        // }
        const onPressFilterIcon = () => {
            this.setState({ isVisibleFilter: true })
        }
        return (
            // <Animated.View style={{ marginTop: 10, alignItems: 'center', opacity: headerOpacity, height: headerHeight }}>
            <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <TextInputBox
                    placeholder={"Search"}
                    isRightIcon={false}
                    fontSize={FontSize.XS}
                    rightIcon={ImageName.FILTER_WITH_SEARCH}
                    rightIconStyle={{ height: 28, width: 28, marginRight: 10 }}
                    height={42}
                    borderRadius={22}
                    value={this.state.searchText}
                    onChangeText={(value) => onSearch(value)}
                    onPressRightIcon={() => onPressFilterIcon()}
                />
            </View>
            // </Animated.View>
        )
    }

    checkCappingValue = async () => {
        let reqData = {
            "refCustomerId": this.state.userInfo.customerId.toString(),
            "salesDate": DateConvert.formatYYYYMMDD(this.state.selectedLiftingItem.salesDate),
            "fromContactTypeId": this.state.selectedLiftingItem.liftFromUserTypeId.toString(),
            "toContactTypeId": this.state.selectedLiftingItem.refUserTypeId.toString(),
            "fromContactId": this.state.selectedLiftingItem.liftFromUserId.toString(),
            "quantity": this.state.editQuantityValue
        }
        let responseData = await MiddlewareCheck("fetchCappingValue", reqData, this.props);
        if (responseData.status == 500) {
            Toaster.ShortCenterToaster(responseData.message)
        }
        let boolData = responseData.success
        return boolData
    }

    onEditLIfting = async (type, item) => {
        this.state.editQuantityValue = item.productQuantity.toString();

        this.setState({ isEditModalVisible: type, selectedLiftingItem: item, editQuantityValue: this.state.editQuantityValue });
    }

    onEditApiCall = async (item) => {
        let validateFormData = validateData(this.state.editQuantityValue);
        if (validateFormData) {
            let cappingCheck = await this.checkCappingValue()
            if (cappingCheck) {
                const reqData = {
                    "refCustomerId": this.state.userInfo.customerId.toString(),
                    "referUserId": this.state.selectedLiftingItem.referUserId.toString(),
                    "liftFromUserId": this.state.selectedLiftingItem.liftFromUserId.toString(),
                    "forFinancialYearId": this.state.selectedLiftingItem.financialYearId,
                    "sales": [
                        {
                            "salesId": this.state.selectedLiftingItem.id.toString(),
                            "productId": this.state.selectedLiftingItem.productId,
                            "quantity": this.state.editQuantityValue
                        }
                    ],
                    // "currentDateTime": "2024-06-26 11:44:49",
                    "currentDateTime": DateConvert.fullDateFormat(new Date()),
                    "financialYearId": this.state.selectedLiftingItem.financialYearId
                }
                this.setState({ editLiftingLoader: true });
                let responseData = await MiddlewareCheck("modifyLiftingQuantityMultiple", reqData, this.props);
                if (responseData) {
                    if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                        Toaster.ShortCenterToaster(responseData.message);
                        // await this._onSetChangeData();
                        // await this.fetchRecentSecondarySalesList();
                        this.setLiftingItemQuantity(item);
                    }
                }
                this.setState({ editLiftingLoader: false, isEditModalVisible: false, refreshing: false });
            }
        }
    }

    setLiftingItemQuantity = (item) => {
        let recentLiftingArr = this.state.recentLiftingData;
        for (let i = 0; i < recentLiftingArr.length; i++) {
            if (recentLiftingArr[i] == item) {
                recentLiftingArr[i].productQuantity = this.state.editQuantityValue;
                this.setState({ recentLiftingData: recentLiftingArr });
            }
        }
    }

    _onEditProductQuantity = (value) => {
        let selectedLiftingItemObj = this.state.selectedLiftingItem;
        if (Regex.UPTO_TWO_DECIMAL_REGEX.test(value) || value === '') {
            this.state.editQuantityValue = value;
            this.setState({ editQuantityValue: this.state.editQuantityValue });
        }
    }

    editModalSec = () => {
        return (
            <Modal
                isVisible={this.state.isEditModalVisible}
                onRequestClose={() => this.onEditLIfting(false)}
                onBackdropPress={() => this.onEditLIfting(false)}
                onBackButtonPress={() => this.onEditLIfting(false)}
                children={
                    <View style={styles.modalview}>
                        <View style={{ marginHorizontal: 25, marginVertical: 10, marginTop: 20, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Enter your Quantity</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <TextInputBox
                                    value={this.state.editQuantityValue}
                                    onChangeText={(value) => this._onEditProductQuantity(value)}
                                    keyboardType={"numeric"}
                                    placeholder={"Quantity"}
                                    placeholderTextColor={"#5F5F5F"}
                                    height={40}
                                    borderRadius={15}
                                    alignItems="flex-start"
                                    multiline={true}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                />
                            </View>
                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.LG }}>{this.state.selectedLiftingItem ? this.state.selectedLiftingItem.unitName : ""}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 15, padding: 10, alignItems: 'center', justifyContent: 'center', flex: 0.5, margin: 20 }} activeOpacity={0.9} onPress={() => this.onEditLIfting(false, this.state.selectedLiftingItem)}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Cancel</Text>
                            </TouchableOpacity>
                            {this.state.editLiftingLoader ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                                    <ActivityIndicator size="small" color={Color.COLOR.BLACK.PURE_BLACK} />
                                </View>
                                :
                                <TouchableOpacity style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 15, padding: 10, alignItems: 'center', justifyContent: 'center', flex: 0.5, margin: 20 }} activeOpacity={0.9} onPress={() => this.onEditApiCall(this.state.selectedLiftingItem)}>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Submit</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </ View>
                }
            />
        )
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.COLOR.WHITE.PURE_WHITE, flex: 1 }}>
                <Header onRefresh={() => console.log("")} {...this.props} onFilterData={(data) => this.onFilter(data)} onReset={() => this.onResetModal()} />
                {this.searchSec()}
                {this.state.recentLoader ?
                    <View>
                        {this.skelitonSec()}
                    </View> :
                    <View style={{}}>
                        {this.editModalSec()}
                        {this.state.recentLiftingData.length > 0 ?
                            <FlatList
                                data={this.state.recentLiftingData}
                                renderItem={({ item, index }) => this.renderList(item, index)}
                                keyExtractor={(item, key) => key}
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
                            // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
                            //     useNativeDriver: false,
                            // })}
                            />
                            :
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>No Data Found !</Text>
                            </View>
                        }
                    </View>
                }
            </SafeAreaView>
        )
    }
}

export default AllRecentLiftingListCustomer;