import React from "react";
import { SafeAreaView, Image, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { Color, Dimension, FontFamily, FontSize, ImageName } from "../../enums";
import styles from "./Style";
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from "redux";
import { BigTextButton, CheckBox, CustomCamera, DropdownInputBox, ImageUploadModal, Loader, Modal, NoDataFound, TextInputBox } from "../../shared";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { TextInput } from "react-native";
import Header from "../header/Header";
import SvgComponent from "../../assets/svg";
import { ConfirmsalesSuccessfulModal, DynamicProductMapping, GiftClaimModal, PointRewardModal, ProfileSec } from "../../pageShared";
import { App_uri } from "../../services/config";
import DatePicker from "react-native-date-picker";
import { DateConvert, FileDownload, FileUpload, StorageDataModification, Toaster } from "../../services/common-view-function";
import { MiddlewareCheck, MiddlewareFileCheck } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
import { modInvoiceData, modOfferData, modifyLocationMappedData, modifyProfileData, onCalculateProductRate, validData } from "./Function";


let data = [
    {
        id: 1,
        showHide: true,
        product: [
            {
                id: 1,
                name: "Product Name",
                cbName: "5 CB",
                botName: "10 BOT"
            },
            {
                id: 2,
                name: "Product Name",
                cbName: "8 CB",
                botName: "40 BOT"
            },
            {
                id: 3,
                name: "Product Name",
                cbName: "14 CB",
                botName: "50 BOT"
            },
            {
                id: 4,
                name: "Product Name",
                cbName: "70 CB",
                botName: "5 BOT"
            }
        ]
    },
]


class ConfirmSalesListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.invoiceScrollViewRef = React.createRef();
        this.state = {
            limit: 10,
            pageNum: 0,
            locationLoader: false,
            refreshing: true,
            pageLoader: false,
            listLoader: false,
            isApiCall: true,
            superTraderist: [],
            selectedItem: {},
            offerData: [],
            allUnits: [],
            propData: this.props.route.params.propData,
            isVisibleBulkUpload: false,
            isVisibleRewardPointModal: false,
            fileLoader: false,
            rewardPoint: "",
            fileName: "",
            rawFileName: "",
            invoiceList: [
                {
                    customerName: "",
                    customerProfileImage: "",
                    customerPhoneNo: "",
                    invoiceId: "",
                    invoiceCreationDate: "",
                    selectedOfferObj: {},
                    isVisibleInvoiceIdAndDate: false,
                    invoiceDatePicker: false,
                    locationArr: [],
                    locationObj: {},
                    invoiceDateObj: { rawDate: new Date(), invoiceDate: "", rawinvoiceDate: "" },
                    invoiceImage: "",
                    visibleProfileImgUploadModal: false,
                    profileImg: "",
                    profileRaw: "",
                    imageLoader: false,
                    profileImgLoader: false,
                    cameraVisible: false,
                    selectProductList: [],
                    productArr: [],
                    refferedSalesPersonArr: [
                        {
                            name: "super trader",
                            profilePic: "",
                            customerType: "Dealer",
                            check: false,
                        },
                        {
                            name: "super trader",
                            profilePic: "",
                            customerType: "Dealer",
                            check: false,
                        }
                    ],
                    selectedRefferedBy: {}
                }
            ],
            sendSuccessfulModal: false


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
        // await this.getProfileData();
        await this._getProductHierarchyTypesSlNo();
        await this.getOfferByLocation()
        this._apiCallRes();
        this.getUnitData();
    }

    // unit
    getUnitData = async () => {
        let responseData = await MiddlewareCheck("getAllMasterUnitList", {}, this.props);
        if (responseData) {
            if (responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.allUnits = responseData.data;
                this.setState(this.state);
            }
            else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    getOfferByLocation = async () => {
        let reqData = {
            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
        }
        let responseData = await MiddlewareCheck("fetchOffer", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modOfferData(responseData.response)
                this.setState({ offerData: modData })
            }
        }
    }


    // here list api call
    _apiCallRes = async () => {
        this.setState({
            superTraderist: data
        })
    }
    // for get the get Hierarchy Types With Sl No for Products
    _getProductHierarchyTypesSlNo = async () => {
        this.setState({ locationLoader: true })
        if ((await StorageDataModification.locationMappedDataProduct({}, "get")) === null) {
            let responseData = await MiddlewareCheck("getHierarchyTypesSlNo", { "typeOfItem": "2" });
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    await StorageDataModification.locationMappedDataProduct(modifyLocationMappedData(responseData.response, this.props.Sales360Redux.productMappedUserArr), "store");
                } else {
                    // this.setState({ alertMessage: responseData.message });
                }
            }
        }
        this.setState({ locationLoader: false })
        return true;
    }

    // for get the product data
    _onFetchProductData = async (hierarchyTypeId, hierarchyDataId) => {
        let reqData = {
            limit: this.state.limit.toString(),
            offset: (this.state.pageNum * this.state.limit).toString(),
            hierarchyDataId: hierarchyDataId,
            hierarchyTypeId: hierarchyTypeId
        };
        let responseData = await MiddlewareCheck("getAllProductBrandwiseList", reqData, this.props);

        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let apiRespData = responseData.response;
                if (apiRespData && apiRespData.length > 0) {
                    for (let i = 0; i < apiRespData.length; i++) {
                        apiRespData[i]["quantity"] = 0;
                        apiRespData[i]["totalAmount"] = 0;
                        apiRespData[i]["inputStdUnit"] = "";
                        apiRespData[i]["stdUnitDisableCheck"] = false;
                        apiRespData[i]["inputUnit"] = "";
                        apiRespData[i]["inputRate"] = "";
                        apiRespData[i]["rateCheck"] = false;
                        if (apiRespData[i].productAttributes.StdUnit === undefined || apiRespData[i].productAttributes.StdUnit === null || apiRespData[i].productAttributes.StdUnit.length === 0) {
                            apiRespData[i]["stdUnitDisableCheck"] = true;
                        }
                        if (!(onCalculateProductRate(apiRespData[i], this.state.propData)).validCheck) {
                            apiRespData[i]["rateCheck"] = true;
                        }
                    }

                    let arr = this.state.invoiceList;
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].selectProductList = apiRespData
                    }
                    this.state.invoiceList = arr;

                }
                this.setState(this.state);
            }
        }
        this.state.listLoader = false;
        this.state.refreshing = false;
        // this.state.productMainLoader = false;
        this.setState(this.state);
    };

    // for render the list 
    renderContactList = (item, key) => {
        return (
            <View>
                <View style={{ flex: 1, marginHorizontal: 10, }}>
                    {this.listSec(item, key)}
                </View>
            </View>
        );
    };

    onShowHide = (item) => {
        let allItems = this.state.invoiceList;
        for (let i = 0; i < allItems.length; i++) {
            if (allItems[i].id == item.id) {
                allItems[i].showHide = !(allItems[i].showHide)
            } else {
                allItems[i].showHide = false
            }
        }
        this.state.invoiceList = allItems;
        this.setState({ invoiceList: this.state.invoiceList })
    }

    _onChangeInvoiceId = (item, key, value) => {
        let arrData = this.state.invoiceList;
        arrData[key].invoiceId = value;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onOpenAndCloseFromdatePicker = (item, key, type) => {
        let arrData = this.state.invoiceList;
        arrData[key].invoiceDatePicker = type;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    closeFromdatePicker = (item, key, type) => {
        let arrData = this.state.invoiceList;
        arrData[key].invoiceDatePicker = type;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onSelectFromDate = (item, key, date) => {
        let arrData = this.state.invoiceList;
        arrData[key].invoiceDateObj.invoiceDate = DateConvert.viewDateFormat(date);
        arrData[key].invoiceDateObj.rawinvoiceDate = date;
        arrData[key].invoiceDateObj.rawDate = date;
        this.state.invoiceList = arrData;
        this.setState(this.state)

        this.closeFromdatePicker(item, key, false);
    }

    addInvoiceData = (item, key) => {
        let arrData = this.state.invoiceList;
        if (item.invoiceId.length == 0) {
            Toaster.ShortCenterToaster("Please Add Invoice Id !")
        } else if (item.invoiceDateObj.invoiceDate.length == 0) {
            Toaster.ShortCenterToaster("Please Add Invoice Date !")
        } else {
            arrData[key].isVisibleInvoiceIdAndDate = true
        }
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onEditInvoiceData = (item, key) => {
        let arrData = this.state.invoiceList;
        arrData[key].isVisibleInvoiceIdAndDate = false;
        arrData[key].invoiceDateObj.invoiceDate = "";
        arrData[key].invoiceId = "";
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onSelectLocationData = async (item, key, value) => {
        let arrData = this.state.invoiceList;
        arrData[key].locationArr = value.totalData;
        arrData[key].locationObj = value.value;
        this.state.invoiceList = arrData;
        this.setState(this.state)
        await this._onFetchProductData(value.value.hierarchyTypeId, value.value.hierarchyDataId)
    }

    onRemoveProduct = (item, key, key2) => {
        let arrData = this.state.invoiceList;
        arrData[key].productArr.splice(key2, 1)
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onClickCheck = (item, key, item3, key3) => {
        let arrData = this.state.invoiceList;
        for (let i = 0; i < arrData[key].refferedSalesPersonArr.length; i++) {
            if (i == key3) {
                arrData[key].refferedSalesPersonArr[i].check = true
            } else {
                arrData[key].refferedSalesPersonArr[i].check = false
            }
        }
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    _onChangeRate = async (val, item, key, key1) => {
        let arrData = this.state.invoiceList;
        let tempVal = 0;

        let tempUnit = item.inputUnit ? parseFloat(item.inputUnit) : 0;
        let tempItemAmount = 0;
        if (val.indexOf(".") >= 1) {
            tempVal = val;
            if (/\.(.+)/.test(val)) {
                tempVal = parseFloat(tempVal).toFixed(2);
            }
        } else if (val.indexOf(".") == 0) {
            tempVal = 0
        }
        else {
            tempVal = val;
        }
        if (val && val.length > 0) {
            tempItemAmount = (parseFloat(tempVal));
        } else {
            tempItemAmount = 0;
        }
        item.quantity = tempUnit;
        tempItemAmount = (tempItemAmount * parseFloat(tempUnit));
        item.inputRate = tempVal;
        item.totalAmount = tempItemAmount;
        arrData[key].selectProductList[key1] = item;
        this.setState(this.state);
        // await this._onCheckStoreCartData(item);
    }


    // for get the product std unit
    _onChangeStdUnit = async (val, item, key, key1) => {
        let arrData = this.state.invoiceList;
        let tempVal = 0;
        let tempUnit = item.inputUnit ? parseFloat(item.inputUnit) : 0;
        let tempItemAmount = 0;
        if (val.indexOf(".") >= 1) {
            tempVal = val;
            if (/\.(.+)/.test(val)) {
                tempVal = parseFloat(tempVal).toFixed(2);
            }
        } else if (val.indexOf(".") == 0) {
            tempVal = 0
        }
        else {
            tempVal = val;
        }
        if (val && val.length > 0) {
            tempItemAmount = (parseFloat(tempVal) * parseFloat(item.productAttributes.StdUnitConversionFactor));
        } else {
            tempItemAmount = 0;
        }

        item.quantity = (tempItemAmount + parseFloat(tempUnit));
        tempItemAmount = ((tempItemAmount + parseFloat(tempUnit)) * parseFloat((onCalculateProductRate(item, this.state.propData)).rate)).toFixed(2);
        item.inputStdUnit = tempVal;
        item.totalAmount = tempItemAmount;

        arrData[key].selectProductList[key1] = item;
        this.setState(this.state);
        // await this._onCheckStoreCartData(item);
    }

    // for get the unit
    _onChangeUnit = async (val, item, key, key1) => {
        let arrData = this.state.invoiceList;
        let tempVal = 0;
        let tempStdUnit = item.inputStdUnit ? parseFloat(item.inputStdUnit) : 0;
        let tempRate = item.inputRate ? parseFloat(item.inputRate) : 0;
        let tempItemAmount = 0;
        if (val.indexOf(".") >= 1) {
            tempVal = val;
            if (/\.(.+)/.test(val)) {
                tempVal = parseFloat(tempVal).toFixed(2);
            }
        } else if (val.indexOf(".") == 0) {
            tempVal = 0
        }
        else {
            tempVal = val;
        }
        if (item.rateCheck) {
            tempItemAmount = (parseFloat(tempVal) * parseFloat(tempRate));
            item.quantity = tempItemAmount;
        } else {
            tempItemAmount = (parseFloat(tempStdUnit) * parseFloat(item.productAttributes.StdUnitConversionFactor));
            if (val && val.length > 0) {
                tempItemAmount = (tempItemAmount + parseFloat(tempVal));
            } else {
                tempItemAmount = (tempItemAmount + 0);
            }
            item.quantity = tempItemAmount;
            tempItemAmount = (tempItemAmount * parseFloat((onCalculateProductRate(item, this.state.propData)).rate)).toFixed(2);
        }
        item.inputUnit = tempVal;
        item.totalAmount = tempItemAmount;
        arrData[key].selectProductList[key1] = item;
        this.setState(this.state);
    }


    // for profile image upload visible
    _onProfilePicModalVisible = async (item, key, type) => {
        let arrData = this.state.invoiceList;
        arrData[key].visibleProfileImgUploadModal = type;
        this.state.invoiceList = arrData
        this.setState(this.state);
    }

    ImageUploadApiCall = async (item, key, uploadData) => {
        let arrData = this.state.invoiceList;
        arrData[key].profileImgLoader = true;
        this.state.invoiceList = arrData;
        this.setState(this.state)
        // this.setState({ profileImgLoader: true })
        let imgData = await MiddlewareFileCheck("lmsFileUpload", uploadData, this.props);
        if (imgData) {
            if (imgData) {
                arrData[key].profileImg = imgData.fileName
                arrData[key].profileRaw = imgData.orgfilename
                this.state.invoiceList = arrData
                this.setState(this.state)
            }
        }
        arrData[key].profileImgLoader = false;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    cameraModalSec = (item, key) => {
        const OnChooseGallery = async (item, key) => {
            this._onProfilePicModalVisible(item, key, false)
            let uploadData = await FileUpload.uploadDocumentAndImage();
            await this.ImageUploadApiCall(item, key, uploadData);
        }
        const OnChooseCamera = async (item, key) => {
            let arrData = this.state.invoiceList;
            arrData[key].cameraVisible = true;
            this.state.invoiceList = arrData;
            this.setState(this.state)
        }
        return (
            <>
                <ImageUploadModal
                    isVisible={item.visibleProfileImgUploadModal}
                    onGallerySelect={(value) => OnChooseGallery(item, key, value)}
                    onCameraSelect={(value) => OnChooseCamera(item, key, value)}
                    onCloseModal={() => this._onProfilePicModalVisible(item, key, false)}
                />
            </>

        )
    }

    // for custom camera open
    onSelectPic = async (item, key, value) => {
        await this._onProfilePicModalVisible(item, key, false);
        await this.ImageUploadApiCall(item, key, value);
    }

    onCloseCamera = (item, key) => {
        let arrData = this.state.invoiceList;
        arrData[key].cameraVisible = false;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    onAddProduct = async (item, key) => {
        let productArrData = item.productArr;
        let arrData = this.state.invoiceList;
        if (item.selectProductList.length == 0) {
            Toaster.ShortCenterToaster("Please Select Product !")
        } else if (item.selectProductList[0].totalAmount == 0) {
            Toaster.ShortCenterToaster("Please Add Quantity !")
        } else {
            productArrData.push(item.selectProductList[0])
            arrData[key].selectProductList = []
            this.state.invoiceList = arrData;
            this.setState(this.state)
            await this.setLocationLoader(true)
        }
        await this.setLocationLoader(false)

    }

    setLocationLoader = async (type) => {
        this.setState({ locationLoader: type })
    }


    _onChangeOffer = (item, key, value) => {
        let arrData = this.state.invoiceList;
        arrData[key].selectedOfferObj = value;
        this.state.invoiceList = arrData;
        this.setState(this.state)
    }

    // for list design implement here
    listSec = (item, key) => {
        let productRate = "0",
            productUnit = "",
            mrp = "0";
        // for product rate (customerType == "Primary" then PTD but retailer PTR)
        if (item.selectProductList.length > 0) {
            if (item.selectProductList[0].productAttributes.PTR) {
                productRate = (parseFloat(item.selectProductList[0].productAttributes.PTR)).toFixed(2);
            }
            if (this.state.propData.customerAccessTypeName == "Primary") {
                if (item.selectProductList[0].productAttributes.PTD) {
                    productRate = (parseFloat(item.selectProductList[0].productAttributes.PTD)).toFixed(2);
                }
            }
            // for MRP
            if (item.selectProductList[0].productAttributes.MRP) {
                mrp = (parseFloat(item.selectProductList[0].productAttributes.MRP)).toFixed(2);
            }
            if (item.selectProductList[0].productAttributes.Unit) {
                productUnit = item.selectProductList[0].productAttributes.Unit;
            }
        }

        return (
            <View style={{ marginHorizontal: 5 }} key={key}>

                <TouchableOpacity style={{ backgroundColor: '#d2e4ef', }} onPress={() => this.onShowHide(item)} activeOpacity={0.9}>
                    <View style={styles.mainTraderView}>
                        <View style={styles.userImgSec}>
                            <Image source={this.state.propData.profilePic.length > 0 ? { uri: App_uri.CRM_BASE_URI + this.state.propData.profilePic } : ImageName.USER_IMG} style={styles.imgSec} />
                        </View>
                        <Text style={styles.taderText}>{this.state.propData.custBusinessName.length > 0 ? this.state.propData.custBusinessName : this.state.propData.customerName.length > 0 ? this.state.propData.customerName : this.state.propData.ownerName}</Text>
                        {/* <SvgComponent svgName={"downArrow"} strokeColor={"#fff"} height={18} width={18} /> */}
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: '#f0f4f7', paddingBottom: 10 }}>
                    <View style={styles.showHideView}>
                        <View style={styles.numberTextView}>
                            <Text style={styles.textNumber}>{this.state.propData.phone}</Text>
                        </View>
                    </View>
                    {/* invoice id and date section */}
                    <View style={{ marginHorizontal: 6, marginTop: 20, flexDirection: "row", alignItems: "center" }}>
                        {item.isVisibleInvoiceIdAndDate ?
                            <React.Fragment>
                                <Text style={styles.invText}>INV - {item.invoiceId}</Text>
                                <Text style={styles.dateText}>{item.invoiceDateObj.invoiceDate}</Text>
                                <View style={{ width: 8 }} />
                                <TouchableOpacity onPress={() => this.onEditInvoiceData(item, key)}>
                                    <SvgComponent svgName={"pencilWithUnderline"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={24} width={24} />
                                </TouchableOpacity>

                            </React.Fragment>
                            :
                            <React.Fragment>
                                <View style={{ flex: 0.5 }}>
                                    <TextInputBox
                                        placeholder={"Invoice ID"}
                                        placeholderTextColor={Color.COLOR.BLUE.LOTUS_BLUE}
                                        value={item.invoiceId}
                                        height={35}
                                        fontSize={11}
                                        borderRadius={25}
                                        returnKeyType="done"
                                        keyboardType={"default"}
                                        maxLength={15}
                                        additionalBoxStyle={{ borderColor: "#747C90", borderWidth: 0.5, backgroundColor: "#fff" }}
                                        onChangeText={(value) => this._onChangeInvoiceId(item, key, value)}
                                    />
                                </View>
                                <View style={{ width: 10 }} />
                                <View style={{ flex: 0.5 }} >
                                    <TouchableOpacity style={styles.inputBoxStyle} onPress={() => this.onOpenAndCloseFromdatePicker(item, key, true)} activeOpacity={0.9}>
                                        <Text style={styles.inputBoxText}>{item.invoiceDateObj.invoiceDate.length == 0 ? "Invoice Date" : item.invoiceDateObj.invoiceDate}</Text>
                                        <View style={{ marginRight: 21, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={ImageName.CALENDER_LOGO} />
                                        </View>
                                    </TouchableOpacity>
                                    <DatePicker
                                        modal
                                        open={item.invoiceDatePicker}
                                        date={item.invoiceDateObj.rawDate}
                                        mode={"date"}
                                        maximumDate={new Date()}
                                        onConfirm={(date) => {
                                            this.onSelectFromDate(item, key, date)
                                        }}
                                        onCancel={() => {
                                            this.closeFromdatePicker(item, key, false)
                                        }}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.addInvoiceData(item, key)} style={{ height: 26, width: 26, borderRadius: 100, backgroundColor: "green", alignItems: "center", justifyContent: "center", marginLeft: 10 }}>
                                    <Image source={ImageName.TICK_MARK_IMG} style={{ height: 10, width: 10, resizeMode: "contain" }} />
                                </TouchableOpacity>
                            </React.Fragment>
                        }
                    </View>
                    <View style={styles.mainInputSec}>
                        {this.state.locationLoader ?
                            null :
                            <DynamicProductMapping
                                flexDirection={"column"}
                                viewType={"add"}
                                marginBottom={5}
                                onApiCallData={(value) => this.onSelectLocationData(item, key, value)}
                            />
                        }
                    </View>
                    {/* input field sectionnnnn------- */}
                    {item.selectProductList.map((item1, key1) => (
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', marginHorizontal: 10 }} key={key1}>
                            <View style={{ flex: 0.4 }}>
                                {item1.rateCheck ?
                                    <View style={{ width: "65%", justifyContent: "center", alignItems: "center", height: 45, borderWidth: 0.8, borderColor: "#000", borderRadius: 20 }}>
                                        <TextInput
                                            placeholder={"Rate"}
                                            placeholderTextColor={Color.COLOR.GRAY.GRAY_COLOR}
                                            value={item1.inputRate.toString()}
                                            onChangeText={(value) => this._onChangeRate(value, item1, key, key1)}
                                            // maxLength={8}
                                            keyboardType="number-pad"
                                            style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: 'center' }}
                                            maxLength={8}
                                        />
                                    </View> :
                                    <View>
                                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginLeft: '2%' }}>{this.state.propData.customerAccessTypeName == "Primary" ? "PTD" : "PTR"}  <Text style={{ color: Color.COLOR.GRAY.TAPA, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{"₹" + " " + productRate}</Text></Text>
                                        {/* <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginLeft: '2%' }}>{"PTD"}  <Text style={{ color: Color.COLOR.GRAY.TAPA, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{"₹" + " " + productRate}</Text></Text> */}

                                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginLeft: '2%' }}>MRP <Text style={{ color: Color.COLOR.GRAY.TAPA, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{"₹" + " " + mrp}</Text></Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flex: 0.6, flexDirection: 'row' }}>
                                {item.stdUnitDisableCheck ?
                                    <View style={{ width: "47%" }} /> :
                                    <View style={{ width: "47%", justifyContent: "center", alignItems: "center", height: 45, borderWidth: 0.8, borderColor: "#000", borderRadius: 20 }}>
                                        <TextInput
                                            //  editable={!item.stdUnitDisableCheck}
                                            placeholder={item1.productAttributes.StdUnit}
                                            placeholderTextColor={Color.COLOR.GRAY.GRAY_COLOR}
                                            value={item1.inputStdUnit.toString()}
                                            onChangeText={(value) => this._onChangeStdUnit(value, item1, key, key1)}
                                            keyboardType="number-pad"
                                            style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: 'center' }}
                                        />
                                    </View>
                                }
                                {/* {item.unitDisableCheck ?
                                 null : */}
                                <React.Fragment>
                                    <View style={{ width: '6%' }} />
                                    <View style={{ width: "47%", justifyContent: "center", alignItems: "center", height: 45, borderWidth: 0.8, borderColor: "#000", borderRadius: 20 }}>
                                        <TextInput
                                            //  editable={!item.unitDisableCheck}
                                            placeholder={item1.productAttributes.Unit}
                                            placeholderTextColor={Color.COLOR.GRAY.GRAY_COLOR}
                                            value={item1.inputUnit.toString()}
                                            onChangeText={(value) => this._onChangeUnit(value, item1, key, key1)}
                                            maxLength={8}
                                            keyboardType="number-pad"
                                            style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: 'center' }}
                                        />
                                    </View>
                                </React.Fragment>
                                {/* } */}
                            </View>
                        </View>
                    ))}
                    <View style={styles.bottonMainView}>
                        {this.cameraModalSec(item, key)}
                        {item.cameraVisible ?
                            <CustomCamera isVisible={item.cameraVisible} onCloseCamera={(value) => this.onCloseCamera(item, key)} picData={(value) => this.onSelectPic(item, key, value)} />
                            :
                            null
                        }
                        <TouchableOpacity style={styles.cameraView}>
                            {item.profileImgLoader ?
                                <ActivityIndicator size="small" color={Color.COLOR.BLUE.VIOLET_BLUE} />
                                :
                                <TouchableOpacity onPress={() => this._onProfilePicModalVisible(item, key, true)} activeOpacity={0.9}>
                                    {item.profileImg.length == 0 ?
                                        <TouchableOpacity onPress={() => this._onProfilePicModalVisible(item, key, true)} style={{ height: 50, width: 50, borderRadius: 100, borderColor: "#000", borderWidth: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                            <SvgComponent svgName={"camera"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={38} width={38} />
                                        </TouchableOpacity>
                                        :
                                        <Image source={{ uri: App_uri.LMS_IMAGE_VIEW_URI + item.profileImg }} style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 100 }} />
                                    }
                                </TouchableOpacity>

                            }

                        </TouchableOpacity>
                        <View style={{ flex: 0.7, marginLeft: 10 }} >
                            <Text style={{ color: "#747C90", fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.ITALIC }}>Upload Invoice{"\n"}Image</Text>

                        </View>
                        <View style={{ flex: 0.3 }}>
                            <BigTextButton
                                text={"Add"}
                                fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                                fontSize={FontSize.SM}
                                borderRadius={30}
                                height={40}
                                backgroundColor={Color.COLOR.BLUE.LOTUS_BLUE}
                                onPress={() => this.onAddProduct(item, key)}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {item.productArr.length > 0 ?
                            <React.Fragment>
                                <View style={styles.dashUnderline} />
                                {item.productArr.map((item2, key2) => (
                                    <View style={styles.productView} key={key2}>
                                        <View style={{ flex: 0.5 }}>
                                            <Text style={styles.productName} numberOfLines={1}>{item2.hmName}</Text>
                                        </View>
                                        <View style={{ flex: 0.25 }}>
                                            <Text style={styles.productValue}>{item2.quantity + " " + item2.productAttributes.Unit}</Text>
                                        </View>
                                        <View style={{ flex: 0.25 }}>
                                            <Text style={styles.productValue}>{item2.totalAmount}</Text>
                                        </View>
                                        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.onRemoveProduct(item, key, key2)}>
                                            <SvgComponent svgName={"cross"} strokeColor={Color.COLOR.RED.AMARANTH} height={15} width={15} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <View style={styles.dashUnderline} />
                            </React.Fragment>
                            :
                            null
                        }
                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: 15, paddingBottom: 20 }}>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 12 }} numberOfLines={1}>Select Offer</Text>
                        <View style={{ marginTop: 10 }}>
                            <DropdownInputBox
                                selectedValue={item.selectedOfferObj.id ? item.selectedOfferObj.id.toString() : "0"}
                                data={this.state.offerData}
                                onSelect={(value) => this._onChangeOffer(item, key, value)}
                                headerText={"Select Offer"}
                                additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                isBackButtonPressRequired={true}
                                isBackdropPressRequired={true}
                                unSelectedTextColor={"#1F2B4D"}
                                selectedTextColor={"#1F2B4D"}
                                fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                borderRadius={25}
                            />
                        </View>
                    </View>
                    {/* <View style={{ marginTop: 10, marginHorizontal: 15, paddingBottom: 20 }}>
                        <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.salesRefferText}>Sales Referred by</Text>
                            <Text style={styles.putRefferalText}>Put referral phone number here</Text>

                        </View>
                        <View style={{ marginHorizontal: 35, marginVertical: 8 }}>
                            <View style={styles.numberViewSec}>
                                <Text style={styles.textNumber}>2828297353</Text>
                            </View>
                        </View>
                        {item.refferedSalesPersonArr.map((item3, key3) => (
                            <View style={{ marginTop: 10, flexDirection: 'row' }} key={key3}>
                                <Image source={ImageName.USER_IMG} style={styles.imgSec} />
                                <View style={{ flex: 1, marginLeft: '5%' }}>
                                    <Text style={styles.superTraderText}>{item3.name}</Text>
                                    <Text style={styles.subRollText}>{item3.customerType}</Text>
                                </View>
                                <View>
                                    <Text style={styles.verifyText}>Verify</Text>
                                    <CheckBox
                                        type={"tick"}
                                        borderRadius={35}
                                        // borderColor={"#000"}
                                        backgroundColor={"#fff"}
                                        data={item3.check}
                                        onClickValue={() => this.onClickCheck(item, key, item3, key3)}
                                    />
                                </View>

                            </View>
                        ))}

                    </View> */}
                </View>
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
            <View style={{ marginBottom: 200 }}>
                <Loader type={"normal"} />
            </View>
        ) : (
            <View style={{ marginBottom: 200 }} />
        );
    };

    // for change the state for refrace
    _onSetChangeData = async () => {
        this.setState({
            invoiceList: [],
            pageLoader: true,
            listLoader: true,
            refreshing: true,
            limit: 10,
            pageNum: 0,
        })
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

    onRefresh = async () => {
        await this._onSetChangeData();
        await this._apiCallRes()
    }

    onDownload = () => {
        console.log("download")
    }

    profileSec = () => {
        return (
            <ProfileSec props={this.props} />
        )
    }

    searchSec = () => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 18, marginHorizontal: 10, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <TextInputBox
                        placeholder={"Search by Name or Number"}
                        isRightIcon={true}
                        fontSize={FontSize.XS}
                        rightIcon={ImageName.SEARCH_LOGO}
                        rightIconStyle={{ height: 25, width: 25 }}
                        height={42}
                        borderRadius={22}
                    // additionalBoxStyle={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE }}
                    // value={this.state.searchText}
                    // onChangeText={(value) => onSearch(value)}
                    // onPressRightIcon={() => onPressSearchIcon()}
                    />
                </View>
            </View>
        )
    }

    openRewardPointModal = () => {
        this.setState({ isVisibleRewardPointModal: true, fileName: "", rawFileName: "" })
    }

    modalSec = () => {
        const onRequestCloseModal = () => {
            this.setState({ isVisibleBulkUpload: false })
        }
        const downloadSample = async () => {
            await FileDownload.downloadDocument("http://43.205.54.4:9090/files/SalesUpload.xlsx");
        }
        const onSelectFile = async () => {
            let uploadData = await FileUpload.uploadExcelDocument();
            await onDocUpload(uploadData)
        }



        const closeRewardPointModal = () => {
            this.setState({ isVisibleRewardPointModal: false })
            this.props.navigation.goBack()
        }

        const onDocUpload = async (uploadData) => {
            this.setState({ fileLoader: true })
            let imgData = await MiddlewareFileCheck("lmsFileUpload", uploadData, this.props);
            if (imgData) {
                if (imgData.success) {
                    this.state.rawFileName = imgData.fileName;
                    this.state.fileName = imgData.orgfilename;
                    this.setState({ fileName: this.state.fileName, rawFileName: this.state.rawFileName })
                }
            }
            this.setState({ fileLoader: false })

        }
        const onAddFile = async () => {

            let reqData = {
                "refUserId": this.state.propData.id.toString(),
                "refUserTypeId": this.state.propData.contactTypeId.toString(),
                "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                "filePath": this.state.rawFileName

            }
            let responseData = await MiddlewareCheck("readExcelAndaddSales", reqData, this.props);
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ rewardPoint: responseData.response })
                Toaster.ShortCenterToaster(responseData.message)
                if (responseData.response != 0) {
                    this.openRewardPointModal()
                }
                onRequestCloseModal()
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }

        }
        return (
            <>
                <ConfirmsalesSuccessfulModal isVisible={this.state.sendSuccessfulModal} onCloseModal={() => this.onConfirm()} data={this.state.rewardPoint} />

                {/* import sales data */}
                <Modal
                    isVisible={this.state.isVisibleBulkUpload}
                    onRequestClose={() => onRequestCloseModal()}
                    onBackdropPress={() => onRequestCloseModal()}
                    onBackButtonPress={() => onRequestCloseModal()}
                    children={
                        <View style={styles.modalview}>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity activeOpacity={0.9} onPress={() => onRequestCloseModal()}>
                                    <SvgComponent svgName={"cross"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={20} width={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={ImageName.IMPORTSALES_LOGO} style={styles.sendSuccessfulImage}></Image>
                                <TouchableOpacity style={{ flexDirection: "row", marginTop: 15, borderBottomColor: Color.COLOR.BLUE.LOTUS_BLUE, borderBottomWidth: 1 }} onPress={() => downloadSample()}>
                                    <SvgComponent svgName={"download"} strokeColor={"#F13748"} height={20} width={20} />
                                    <Text style={styles.headerText}>Download Sample File</Text>
                                </TouchableOpacity>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ height: 50, width: Dimension.width - 80, backgroundColor: "#CCD9E3", flexDirection: "row", alignItems: "center", borderRadius: 25 }}>
                                        <TouchableOpacity onPress={() => onSelectFile()} style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }} >
                                            {this.state.fileLoader ?
                                                <ActivityIndicator size={"small"} />
                                                :
                                                <Text style={{ color: "#747C90", fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{this.state.fileName.length > 0 ? this.state.fileName : "Select File"}</Text>
                                            }
                                        </TouchableOpacity >

                                        <TouchableOpacity onPress={() => onAddFile()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 }}>
                                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.LIGHT }}>Add</Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ View>
                    }
                />

                {/* rewardpoint modal */}
                <PointRewardModal props={this.props} isVisible={this.state.isVisibleRewardPointModal} data={this.state.rewardPoint} onCloseModal={() => closeRewardPointModal()} />
            </>

        )
    }

    onConfirm = () => {
        this.setState({
            sendSuccessfulModal: !this.state.sendSuccessfulModal
        })
    }

    addAnotherInv = () => {
        let arrData = this.state.invoiceList;
        let obj = {
            customerName: "",
            customerProfileImage: "",
            customerPhoneNo: "",
            invoiceId: "",
            invoiceCreationDate: "",
            selectedOfferObj: {},
            isVisibleInvoiceIdAndDate: false,
            invoiceDatePicker: false,
            locationArr: [],
            locationObj: {},
            invoiceDateObj: { rawDate: new Date(), invoiceDate: "", rawinvoiceDate: "" },
            invoiceImage: "",
            visibleProfileImgUploadModal: false,
            profileImg: "",
            profileRaw: "",
            imageLoader: false,
            profileImgLoader: false,
            cameraVisible: false,
            selectProductList: [],
            productArr: [],
            refferedSalesPersonArr: [
                {
                    name: "super trader",
                    profilePic: "",
                    customerType: "Dealer",
                    check: false,
                },
                {
                    name: "super trader",
                    profilePic: "",
                    customerType: "Dealer",
                    check: false,
                }
            ],
            selectedRefferedBy: {}
        }

        let validateData = validData(arrData)
        if (validateData) {
            arrData.push(obj)
            this.state.invoiceList = arrData;
            this.setState(this.state)
            this.invoiceScrollViewRef.current.scrollTo({ y: 700, animated: true });
        }
    }

    // for get the seleted unit data
    onSelectUnitData = (selectedUnit) => {
        let resObj = {};
        let unit = this.state.allUnits.find(item => item.unitShort == selectedUnit);
        if (unit) {
            resObj = unit;
        }
        return resObj;
    }

    sendToConfirm = async () => {
        let arrData = this.state.invoiceList;
        let validateData = validData(arrData)
        if (validateData) {

            for (let i = 0; i < arrData.length; i++) {
                let products = [];
                for (let j = 0; j < arrData[i].productArr.length; j++) {

                    let modObj = {};
                    let tempUnitId = "0";
                    let seleltedUnitData = this.onSelectUnitData(arrData[i].productArr[j].productAttributes.Unit);
                    if (Object.keys(seleltedUnitData).length > 0) {
                        tempUnitId = seleltedUnitData.unitId;
                    }
                    modObj["productUnitId"] = tempUnitId
                    modObj["productId"] = arrData[i].productArr[j].hierarchyDataId
                    modObj["productQuantity"] = arrData[i].productArr[j].quantity
                    modObj["productPrice"] = arrData[i].productArr[j].totalAmount

                    modObj["productAttributes"] = arrData[i].productArr[j].productAttributes

                    products.push(modObj)
                }
                arrData[i].productArr = products
            }

            let modRespInvoiceData = modInvoiceData(arrData)
            let reqData = {
                "refUserId": this.state.propData.id.toString(),
                "refUserTypeId": this.state.propData.contactTypeId.toString(),
                "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                "sales": modRespInvoiceData
            }
            let responseData = await MiddlewareCheck("saveSecondarySales", reqData, this.props);

            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    this.setState({ rewardPoint: responseData.response })
                    if (responseData.response == 0) {
                        Toaster.LongTopToaster("You will not get any Reward for this operation !")
                    } else {
                        this.openRewardPointModal()
                    }
                    // this.props.navigation.goBack()
                }
            }

        }
    }


    footerSec = () => {
        return (
            <React.Fragment>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', bottom: 2, position: 'absolute' }}>
                    <TouchableOpacity onPress={() => this.addAnotherInv()} style={{ backgroundColor: "#1F2B4D", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Add Another INV</Text>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={() => this.sendToConfirm()} style={{ backgroundColor: "#F13748", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Send to Confirm</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }} />
            </React.Fragment>
        )
    }

    openBulkUploadModal = () => {
        this.setState({ isVisibleBulkUpload: true })
    }



    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                {this.modalSec()}
                {this.profileSec()}
                {/* {this.searchSec()} */}
                {this.state.pageLoader ?
                    <View>
                        <SkeletonPlaceholder>{this.ViewSkeletonPlaceholder()}</SkeletonPlaceholder>
                    </View> :
                    <React.Fragment>
                        <ScrollView ref={this.invoiceScrollViewRef}>
                            <View>
                                <View style={styles.mainHeadrView}>
                                    <View>
                                        <Text style={{ color: "#fff", fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>INVOICE</Text>
                                    </View>
                                    <View style={{ flex: 1 }} />
                                    <TouchableOpacity style={{ backgroundColor: Color.COLOR.RED.AMARANTH, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20 }} onPress={() => this.openBulkUploadModal()}>
                                        <Text style={{ color: "#fff", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>Bulk Upload</Text>
                                    </TouchableOpacity>
                                </View>
                                {this.state.invoiceList.map((item, key) => (
                                    <View key={key}>
                                        {this.renderContactList(item, key)}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        {/* {this.state.superTraderist.length > 0 ?
                            <React.Fragment>
                                <FlatList
                                    data={this.state.superTraderist}
                                    renderItem={({ item, index }) => this.renderContactList(item, index)}
                                    keyExtractor={(item, key) => key}
                                    onEndReachedThreshold={0.1}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh()}
                                        />
                                    }
                                />
                                {this.footerSec()}
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <View style={{ marginTop: 20, height: Dimension.height }}>
                                    <NoDataFound />
                                </View>
                            </React.Fragment>
                        } */}
                        {this.footerSec()}
                    </React.Fragment>
                }

                <View style={{ marginBottom: 10 }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSalesListDetails);