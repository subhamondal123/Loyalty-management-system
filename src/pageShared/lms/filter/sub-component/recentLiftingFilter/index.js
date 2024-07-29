import React, { Component } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { Color, FontFamily, FontSize, ImageName } from '../../../../../enums'
import { BigTextButton, DropdownInputBox } from '../../../../../shared'
import styles from './style'
import DatePicker from 'react-native-date-picker'
import { DateConvert, StorageDataModification } from '../../../../../services/common-view-function'
import { MiddlewareCheck } from '../../../../../services/middleware'
import { modifyCustomerData, modifyLocationMappedData } from './function'
import { ErrorCode } from '../../../../../services/constant'
import DynamicProductMapping from '../../../../dynamicProductMapping'

const statusData = [
    {
        id: "1",
        name: "approved"
    },
    {
        id: "0",
        name: "pending"
    },
    {
        id: "2",
        name: "rejected"
    }
]

export default class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            actLiftingDate: {
                toDatePicker: false,
                toDateObj: { rawDate: new Date(), toDate: "" },
                fromDatePicker: false,
                fromDateObj: { rawDate: new Date(), toDate: "" }
            },
            createdDate: {
                toDatePicker: false,
                toDateObj: { rawDate: new Date(), toDate: "" },
                fromDatePicker: false,
                fromDateObj: { rawDate: new Date(), toDate: "" }
            },
            limit: 10,
            pageNum: 0,
            searchText: "",
            customerListArr: [],
            selectedCustomerObj: {},
            customerListLoader: true,
            statusDataArr: statusData,
            selectedStatusDataObj: {},
            locationObj: {},
            locationArr: [],
        }
    }

    componentDidMount() {
        this._load();
    }

    _load = async () => {
        await this._getProductHierarchyTypesSlNo();
        await this.customerListApiCall();
    }

    // for get the get Hierarchy Types With Sl No for Products
    _getProductHierarchyTypesSlNo = async () => {
        this.setState({ locationLoader: true })
        let mappedData = await StorageDataModification.mappedProductData({}, "get");
        if ((await StorageDataModification.locationMappedDataProduct({}, "get")) === null) {
            let responseData = await MiddlewareCheck("getHierarchyTypesSlNo", { "typeOfItem": "2" });
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    await StorageDataModification.locationMappedDataProduct(modifyLocationMappedData(responseData.response, mappedData), "store");
                }
            }
        }
        this.setState({ locationLoader: false })
        return true;
    }

    customerListApiCall = async () => {
        let dataReq = {
            "limit": "",
            "offset": "",
            "searchName": "",
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
            "contactTypeId": "",
            "contactTypeIdArr": [],
            "isDownload": "0",
            "approvalList": "0",
            "customerAccessType": "",
            // "hierarchyDataIdArr": []
            "hierarchyDataIdArr": [{ "hierarchyTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId, "hierarchyDataId": this.props.Sales360Redux.routeData.hierarchyDataId }],
        }
        let responseData = await MiddlewareCheck("registrationList", dataReq, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let listData = modifyCustomerData(responseData.response.data);
                // if (listData.list.length == 0) {
                //     this.state.isApiCall = false;
                // }
                this.setState({
                    customerListArr: listData,
                });
            }
        }
        this.setState({ customerListLoader: false })
    }

    onApply = () => {
        let filterData = {};
        filterData["actLiftingDate"] = this.state.actLiftingDate;
        filterData["createdDate"] = this.state.createdDate;
        filterData["customerObj"] = this.state.selectedCustomerObj;
        // filterData["statusObj"] = this.state.selectedStatusDataObj;
        filterData["statusObj"] = {};
        filterData["productObj"] = this.state.locationObj;

        // onCloseModal();
        this.props.onFilter(filterData);
    }

    onReset = () => {
        this.setState({
            actLiftingDate: {
                toDatePicker: false,
                toDateObj: { rawDate: new Date(), toDate: "" },
                fromDatePicker: false,
                fromDateObj: { rawDate: new Date(), toDate: "" }
            },
            createdDate: {
                toDatePicker: false,
                toDateObj: { rawDate: new Date(), toDate: "" },
                fromDatePicker: false,
                fromDateObj: { rawDate: new Date(), toDate: "" }
            },
            limit: 10,
            pageNum: 0,
            searchText: "",
            customerListArr: [],
            selectedCustomerObj: {},
            customerListLoader: false,
            statusDataArr: statusData,
            selectedStatusDataObj: {}
        });
        this.props.onResetFilterModal();
    }

    // for button design implement here
    footerSec = () => {
        return (
            <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                <BigTextButton
                    text={"Reset"}
                    fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                    fontSize={FontSize.SM}
                    fontColor={"#000"}
                    borderRadius={30}
                    isLinearGradient={true}
                    gradientColors={["#fff", "#dfdfdf"]}
                    additionalStyles={{ borderColor: "#000", borderWidth: 0.8 }}
                    onPress={() => this.onReset()}
                />
                <View style={{ width: 55 }} />
                <BigTextButton
                    isLinearGradient={true}
                    gradientColors={["#C5C91E", "#3AB500"]}
                    text={"Search"}
                    fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                    fontSize={FontSize.SM}
                    borderRadius={30}
                    start={{ x: 1, y: 0.3 }}
                    end={{ x: 0.5, y: 1 }}
                    onPress={() => this.onApply()}
                />
            </View>
        )
    }

    actLiftingDateSec = () => {
        // for from date
        const openCloseFromDate = (type) => {
            this.state.actLiftingDate.fromDatePicker = type;
            this.setState({ actLiftingDate: this.state.actLiftingDate })
        }
        const onSelectFromDate = (date) => {
            this.state.actLiftingDate.fromDateObj.toDate = DateConvert.viewDateFormat(date);
            this.state.actLiftingDate.fromDateObj.rawDate = date;
            this.setState({ actLiftingDate: this.state.actLiftingDate })
            openCloseFromDate(false);
        }

        // for to date
        const openCloseToDate = (type) => {
            this.state.actLiftingDate.toDatePicker = type;
            this.setState({ actLiftingDate: this.state.actLiftingDate })
        }
        const onselectToDate = (date) => {
            this.state.actLiftingDate.toDateObj.toDate = DateConvert.viewDateFormat(date);
            this.state.actLiftingDate.toDateObj.rawDate = date;
            this.setState({ actLiftingDate: this.state.actLiftingDate })
            openCloseToDate(false);
        }

        return (
            <View>
                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 20, marginTop: 10 }}>Actual Lifting Date</Text>
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    <View style={{ flex: 0.5, marginLeft: 10, marginRight: 5 }}>
                        <TouchableOpacity style={styles.inputBoxStyle} onPress={() => openCloseFromDate(true)} activeOpacity={0.9}>
                            <Text style={[styles.inputBoxText, this.state.actLiftingDate.fromDateObj.toDate.length == 0 ? { color: Color.COLOR.GRAY.GRAY_COLOR } : { color: Color.COLOR.BLACK.PURE_BLACK }]}>{this.state.actLiftingDate.fromDateObj && this.state.actLiftingDate.fromDateObj.toDate.length == 0 ? "From" : this.state.actLiftingDate.fromDateObj.toDate}</Text>
                            <View style={{ marginRight: 21, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={ImageName.CALENDER_LOGO} />
                            </View>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={this.state.actLiftingDate.fromDatePicker}
                            date={this.state.actLiftingDate.fromDateObj.rawDate}
                            mode={"date"}
                            // minimumDate={new Date()}
                            onConfirm={(date) => {
                                onSelectFromDate(date)
                            }}
                            onCancel={() => {
                                openCloseFromDate(false)
                            }}

                        />
                    </View>
                    <View style={{ flex: 0.5, marginRight: 10 }}>
                        <TouchableOpacity style={styles.inputBoxStyle} onPress={() => openCloseToDate(true)} activeOpacity={0.9}>
                            <Text style={[styles.inputBoxText, this.state.actLiftingDate.toDateObj.toDate.length == 0 ? { color: Color.COLOR.GRAY.GRAY_COLOR } : { color: Color.COLOR.BLACK.PURE_BLACK }]}>{this.state.actLiftingDate.toDateObj && this.state.actLiftingDate.toDateObj.toDate.length == 0 ? "To" : this.state.actLiftingDate.toDateObj.toDate}</Text>
                            <View style={{ marginRight: 21, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={ImageName.CALENDER_LOGO} />
                            </View>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={this.state.actLiftingDate.toDatePicker}
                            date={this.state.actLiftingDate.toDateObj.rawDate}
                            mode={"date"}
                            // minimumDate={new Date()}
                            onConfirm={(date) => {
                                onselectToDate(date)
                            }}
                            onCancel={() => {
                                openCloseToDate(false)
                            }}

                        />
                    </View>
                </View>
            </View>
        )
    }

    createdDateSec = () => {
        // for from date
        const openCloseFromDate = (type) => {
            this.state.createdDate.fromDatePicker = type;
            this.setState({ createdDate: this.state.createdDate })
        }
        const onSelectFromDate = (date) => {
            this.state.createdDate.fromDateObj.toDate = DateConvert.viewDateFormat(date);
            this.state.createdDate.fromDateObj.rawDate = date;
            this.setState({ createdDate: this.state.createdDate })
            openCloseFromDate(false);
        }

        // for to date
        const openCloseToDate = (type) => {
            this.state.createdDate.toDatePicker = type;
            this.setState({ createdDate: this.state.createdDate })
        }
        const onselectToDate = (date) => {
            this.state.createdDate.toDateObj.toDate = DateConvert.viewDateFormat(date);
            this.state.createdDate.toDateObj.rawDate = date;
            this.setState({ createdDate: this.state.createdDate })
            openCloseToDate(false);
        }

        return (
            <View>
                <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 20, marginTop: 10 }}>Created Date</Text>
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    <View style={{ flex: 0.5, marginLeft: 10, marginRight: 5 }}>
                        <TouchableOpacity style={styles.inputBoxStyle} onPress={() => openCloseFromDate(true)} activeOpacity={0.9}>
                            <Text style={[styles.inputBoxText, this.state.createdDate.fromDateObj.toDate.length == 0 ? { color: Color.COLOR.GRAY.GRAY_COLOR } : { color: Color.COLOR.BLACK.PURE_BLACK }]}>{this.state.createdDate.fromDateObj && this.state.createdDate.fromDateObj.toDate.length == 0 ? "From" : this.state.createdDate.fromDateObj.toDate}</Text>
                            <View style={{ marginRight: 21, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={ImageName.CALENDER_LOGO} />
                            </View>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={this.state.createdDate.fromDatePicker}
                            date={this.state.createdDate.fromDateObj.rawDate}
                            mode={"date"}
                            // minimumDate={new Date()}
                            onConfirm={(date) => {
                                onSelectFromDate(date)
                            }}
                            onCancel={() => {
                                openCloseFromDate(false)
                            }}

                        />
                    </View>
                    <View style={{ flex: 0.5, marginRight: 10 }}>
                        <TouchableOpacity style={styles.inputBoxStyle} onPress={() => openCloseToDate(true)} activeOpacity={0.9}>
                            <Text style={[styles.inputBoxText, this.state.createdDate.toDateObj.toDate.length == 0 ? { color: Color.COLOR.GRAY.GRAY_COLOR } : { color: Color.COLOR.BLACK.PURE_BLACK }]}>{this.state.createdDate.toDateObj && this.state.createdDate.toDateObj.toDate.length == 0 ? "To" : this.state.createdDate.toDateObj.toDate}</Text>
                            <View style={{ marginRight: 21, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={ImageName.CALENDER_LOGO} />
                            </View>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={this.state.createdDate.toDatePicker}
                            date={this.state.createdDate.toDateObj.rawDate}
                            mode={"date"}
                            // minimumDate={new Date()}
                            onConfirm={(date) => {
                                onselectToDate(date)
                            }}
                            onCancel={() => {
                                openCloseToDate(false)
                            }}

                        />
                    </View>
                </View>
            </View>
        )
    }

    onSelectCustomer = (value) => {
        this.setState({ selectedCustomerObj: value });
    }

    onSelectStatus = (value) => {
        this.setState({ selectedStatusDataObj: value })
    }

    onSelectLocationData = (value) => {
        this.state.locationArr = value.totalData;
        this.state.locationObj = value.value;
        this.setState(this.state)
        // this.getLastLevelAttributeAPiCall(this.state.locationObj);
    }

    dropdownSec = () => {
        return (
            <View>
                <View style={{ margin: 10 }}>
                    {this.state.customerListLoader ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator color={Color.COLOR.BLACK.PURE_BLACK} />
                        </View>
                        :
                        <View style={{ marginRight: 5 }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 10, marginTop: 10 }}>Select Brand</Text>
                            {/* <DropdownInputBox
                                selectedValue={this.state.selectedCustomerObj.id ? this.state.selectedCustomerObj.id.toString() : "0"}
                                data={this.state.customerListArr}
                                onSelect={(value) => this.onSelectCustomer(value)}
                                headerText={"Select Option"}
                                additionalBoxStyle={{ backgroundColor: Color.COLOR.WHITE.WHITE_SMOKE, borderRadius: 10 }}
                                isBackButtonPressRequired={true}
                                isBackdropPressRequired={true}
                                unSelectedTextColor={"#5F5F5F"}
                                selectedTextColor={"#1F2B4D"}
                                fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                borderRadius={25}
                                isSearchable={true}
                            /> */}
                            <DynamicProductMapping
                                flexDirection={"column"}
                                viewType={"add"}
                                marginBottom={5}
                                onApiCallData={(value) => this.onSelectLocationData(value)}
                            />
                        </View>
                    }
                    {/* <View style={{ marginHorizontal: 5 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 10, marginTop: 10 }}>Select Status</Text>
                        <DropdownInputBox
                            selectedValue={this.state.selectedStatusDataObj.id ? this.state.selectedStatusDataObj.id.toString() : ""}
                            data={this.state.statusDataArr}
                            onSelect={(value) => this.onSelectStatus(value)}
                            headerText={"Select Option"}
                            additionalBoxStyle={{ borderColor: Color.COLOR.GRAY.GRAY_TINTS, borderWidth: 1, backgroundColor: "#fff" }}
                            isBackButtonPressRequired={true}
                            isBackdropPressRequired={true}
                            unSelectedTextColor={Color.COLOR.GRAY.GRAY_TINTS}
                            selectedTextColor={Color.COLOR.BLUE.LOTUS_BLUE}
                            fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                            borderRadius={25}
                            fontSize={12}
                            isSearchable={true}
                        />
                    </View> */}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{ marginTop: 10 }}>
                {/* {this.actLiftingDateSec()} */}
                {/* {this.createdDateSec()} */}
                {this.dropdownSec()}
                {this.footerSec()}
            </View>
        )
    }
}
