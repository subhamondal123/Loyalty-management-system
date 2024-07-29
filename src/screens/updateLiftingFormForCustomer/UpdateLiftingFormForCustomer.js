import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { Component } from 'react'
import { CustomCamera, DropdownInputBox, ImageUploadModal, TextInputBox } from '../../shared';
import Header from '../header/Header';
import { DynamicProductMapping, ProfileSec } from '../../pageShared';
import { bindActionCreators } from 'redux';
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from '../../redux/Sales360Action';
import { connect } from 'react-redux';
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums';
import { DateConvert, FileUpload, StorageDataModification, Toaster } from '../../services/common-view-function';
import DatePicker from 'react-native-date-picker';
import { MiddlewareCheck, MiddlewareFileCheck } from '../../services/middleware';
import { ErrorCode } from '../../services/constant';
import { decimalUpto, modAttributeData, modDocumentArr, modUnitArr, modifyLocationMappedData, validateData } from './Function';
import styles from './Style';
import { App_uri, Regex } from '../../services/config';
import { Buffer } from 'buffer'

class UpdateLiftingFormForCustomer extends Component {
    constructor(props) {
        super(props)
        this.scrollViewRef = React.createRef();
        this.state = {
            name: "",
            searchText: "",
            locationLoader: false,
            locationObj: {},
            locationArr: [],
            quantity: "",
            quantityActive: false,
            unitArr: [],
            selectedUnit: {},
            fromDatePicker: false,
            fromDateObj: { rawDate: new Date(), fromDate: "" },
            isVisibleDocUploadModal: false,
            cameraVisible: false,
            docImg: "",
            docRaw: "",
            documentArr: [],
            updateLiftingLoader: false

        }
    }

    componentDidMount = async () => {
        // console.log("this.props.route.params.propData", this.props.route.params.propData)
        // console.log("this.props.route.params.data", this.props.route.params.data)
        await this.setInitialState()
        await this._load();
    }

    setInitialState = async () => {
        this.setState({

        })
    }

    _load = async () => {
        await this._getProductHierarchyTypesSlNo()
        await this.getUnitData()
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

    // unit
    getUnitData = async () => {
        let responseData = await MiddlewareCheck("getAllMasterUnitList", {}, this.props);
        if (responseData) {
            if (responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.unitArr = modUnitArr(responseData.data);
                this.setState({ unitArr: this.state.unitArr });
            }
            else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    headerSec = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 5 }}>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Lifted By</Text>
                </View>
            </View>
        )
    }

    getLastLevelAttributeAPiCall = async (data) => {
        let reqData = {
            "hierarchyTypeId": data.hierarchyTypeId,
            "hierarchyDataId": data.hierarchyDataId,
            "attrType": "Unit",
        }
        let responseData = await MiddlewareCheck("getLastLevelAttributes", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.unitArr = modAttributeData(responseData.response);
                this.setState({ unitArr: this.state.unitArr });
            }
            else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    onSelectLocationData = (value) => {
        this.state.locationArr = value.totalData;
        this.state.locationObj = value.value;
        this.setState(this.state)
        // this.getLastLevelAttributeAPiCall(this.state.locationObj);
    }

    productSec = () => {

        return (
            <View style={{ marginTop: 10 }}>
                {
                    this.state.locationLoader ?
                        null :
                        <DynamicProductMapping
                            flexDirection={"column"}
                            viewType={"add"}
                            marginBottom={5}
                            onApiCallData={(value) => this.onSelectLocationData(value)}
                        />
                }
            </View>
        )
    }

    _onChangeQuantity = (val) => {
        // if (Regex.UPTO_TWO_DECIMAL_REGEX.test(val) || val === '') {
        //     this.setState({ quantity: val });
        // }
        if (decimalUpto(val, 2)) {
            this.setState({ quantity: val });
        }
    }

    _onChangeUnit = (val) => {
        this.setState({ selectedUnit: val })
    }

    quantitySec = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <View style={{ flex: 0.5 }}>
                    <TextInputBox
                        placeholder={"Quantity"}
                        placeholderTextColor={Color.COLOR.GRAY.GRAY_TINTS}
                        value={this.state.quantity}
                        height={45}
                        fontSize={12}
                        borderRadius={25}
                        returnKeyType="done"
                        keyboardType={"number-pad"}
                        maxLength={15}
                        isActive={this.state.quantityActive}
                        onFocus={() => { this.setState({ quantityActive: true }) }}
                        onBlur={() => { this.setState({ quantityActive: false }) }}
                        inactiveTextColor={Color.COLOR.GRAY.GRAY_TINTS}
                        activeTextColor={Color.COLOR.BLUE.LOTUS_BLUE}
                        additionalBoxStyle={{ borderColor: "#747C90", borderWidth: 0.5, backgroundColor: "#fff" }}
                        onChangeText={(value) => this._onChangeQuantity(value)}
                    />
                </View>
                <View style={{ width: 10 }} />
                <View style={{ flex: 0.5 }}>
                    <DropdownInputBox
                        selectedValue={this.state.selectedUnit.id ? this.state.selectedUnit.id.toString() : "0"}
                        data={this.state.unitArr}
                        onSelect={(value) => this._onChangeUnit(value)}
                        headerText={"Unit"}
                        isBackButtonPressRequired={true}
                        isBackdropPressRequired={true}
                        unSelectedTextColor={Color.COLOR.GRAY.GRAY_TINTS}
                        additionalBoxStyle={{ borderColor: Color.COLOR.GRAY.GRAY_TINTS, borderWidth: 1, backgroundColor: "#fff" }}
                        fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                        borderRadius={25}
                        fontSize={12}
                    />
                </View>

            </View>
        )
    }

    onOpenAndClosedatePicker = (type) => {
        this.setState({
            fromDatePicker: type
        })
    }

    _onSelectDate = async (date) => {
        this.state.fromDateObj.rawDate = date.date;
        this.state.fromDateObj.fromDate = DateConvert.getDayMonthYearName(date.date);
        this.setState({
            fromDateObj: this.state.fromDateObj,
        });
        this.onOpenAndClosedatePicker(false)
        await this.checkLiftingDateApiCall(date);
    }

    checkLiftingDateApiCall = async (date) => {
        let responseData = await MiddlewareCheck("checkLiftingDate", { "salesDate": DateConvert.formatYYYYMMDD(date.date) }, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ isDateCheck: responseData.response });
                if (responseData.response == false) {
                    Toaster.ShortCenterToaster(responseData.message);
                }
            }
            else {
                Toaster.ShortCenterToaster(responseData.message);
            }
        }
    }


    dateSec = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const prevDate = date.toISOString();
        return (
            <>
                <View style={{ borderStyle: "dashed", borderWidth: 1, borderColor: "#91ABBD", marginTop: 20 }} />
                <TouchableOpacity style={styles.inputBoxStyle} onPress={() => this.onOpenAndClosedatePicker(true)} activeOpacity={0.9}>
                    <View style={{ flex: 1 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 15 }} source={ImageName.CALENDER_LOGO} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.inputBoxText, this.state.fromDateObj.fromDate.length === 0 ? { color: Color.COLOR.GRAY.GRAY_COLOR } : { color: Color.COLOR.BLUE.LOTUS_BLUE }]}>
                            {this.state.fromDateObj.fromDate.length === 0 ? "DD/MM/YYYY" : this.state.fromDateObj.fromDate}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                </TouchableOpacity>
                <DatePicker
                    modal
                    open={this.state.fromDatePicker}
                    date={new Date(DateConvert.formatYYYYMMDD(this.state.fromDateObj.rawDate))}
                    mode={"date"}
                    onConfirm={(date) => {
                        this._onSelectDate({ date })
                    }}
                    onCancel={() => {
                        this.onOpenAndClosedatePicker(false)
                    }}
                    maximumDate={new Date(DateConvert.formatYYYYMMDD(prevDate))}
                />
            </>
        )
    }

    onRemoveDoc = (index) => {
        let arr = this.state.documentArr;
        arr.splice(index, 1)
        this.setState({ documentArr: arr })
    }

    uploadSec = () => {
        return (
            <>
                <TouchableOpacity onPress={() => this._onDocModalVisible(true)} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "center" }} disabled={this.state.documentArr.length > 0 ? true : false}>
                    <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                    <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Upload Supporting Doc</Text>
                </TouchableOpacity>
                {this.state.docImgLoader ?
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={Color.COLOR.BLACK.PURE_BLACK} />
                    </View>
                    :
                    <View style={{ marginHorizontal: 5, flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
                        {this.state.documentArr.map((item, key) => (
                            <View key={key} style={{ marginHorizontal: 5, marginTop: 10, width: Dimension.width / 3 - 25 }}>
                                <View style={{}}>
                                    <Image source={item.docType == "pdf" ? ImageName.PDF_ICON :
                                        item.docType == "xlsx" || item.docType == "xls" ? ImageName.XLS_ICON :
                                            item.docType == "docX" ? ImageName.DOC_ICON : { uri: item.docImg }} style={{ height: 160, width: 100, resizeMode: "contain" }} />
                                </View>
                                <TouchableOpacity onPress={() => this.onRemoveDoc(key)} style={{ position: "absolute", top: -10, right: -10, backgroundColor: Color.COLOR.GRAY.LIGHT_GRAY_COLOR, height: 25, width: 25, borderRadius: 20, padding: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Image source={ImageName.CROSS_IMG} style={{ height: 12, width: 12, resizeMode: "contain" }} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                }

            </>
        )
    }
    scrollToBottom = () => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    ImageUploadApiCall = async (uploadData) => {
        this.setState({ docImgLoader: true })
        let imgData = await MiddlewareFileCheck("lmsFileUpload", uploadData, this.props);
        if (imgData) {
            if (imgData.success) {
                let req = {
                    fileName: imgData.fileName
                }
                let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req, this.props);
                if (fileDownload.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    try {
                        const base = Buffer.from(fileDownload.response.Body.data, 'binary').toString('base64')
                        let docData = {
                            docName: uploadData.name,
                            docImg: 'data:image/jpg;base64,' + base,
                            docType: imgData.fileName.split('.').pop()
                        }
                        this.state.documentArr.push(docData)
                        this.scrollToBottom()
                        this.setState(this.state)
                    } catch (error) {
                        console.error("Error processing image data:", error);
                        this.setState({ docImgLoader: false });
                    }
                }
            }
        }
        this.setState({ docImgLoader: false })
    }

    // for custom camera open
    onSelectPic = async (value) => {
        await this._onDocModalVisible(false);
        await this.ImageUploadApiCall(value);
    }

    _onDocModalVisible = (type) => {
        this.setState({ isVisibleDocUploadModal: type })
    }

    modalSec = () => {
        const OnChooseGallery = async () => {
            this._onDocModalVisible(false)
            let uploadData = await FileUpload.uploadImg();
            await this.ImageUploadApiCall(uploadData);
        }
        const OnChooseCamera = async () => {
            this.setState({ cameraVisible: true });
        }
        return (
            <>
                {this.state.isVisibleDocUploadModal ?
                    <ImageUploadModal
                        isVisible={this.state.isVisibleDocUploadModal}
                        onGallerySelect={(value) => OnChooseGallery(value)}
                        onCameraSelect={(value) => OnChooseCamera(value)}
                        onCloseModal={() => this._onDocModalVisible(false)}
                    />
                    :
                    null}
            </>
        )
    }

    clearFormData = async () => {
        await this.setLocationLoader(true);
        this.setState({ quantity: "", selectedUnit: {}, documentArr: [], fromDateObj: { rawDate: new Date(), fromDate: "" } });
        await this.setLocationLoader(false);
    }

    setLocationLoader = async (type) => {
        this.setState({ locationLoader: type });
    }

    liftingFromSec = () => {
        return (
            <View
                style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 15, borderWidth: 0.5, borderColor: "#CBCBCB" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                        <Image source={ImageName.USER_IMG} style={{ height: 50, width: 50, resizeMode: "contain", borderRadius: 30 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
                        <View>
                            <Text style={{ color: "#1F2B4D", fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: FontSize.XS }} numberOfLines={2}>{this.props.route.params.data.custBusinessName}</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#5F5F5F", fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>{this.props.route.params.data.address}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}>Recent</Text>
                            <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: Color.COLOR.RED.AMARANTH, alignItems: "center", justifyContent: "center", marginLeft: 5 }}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 10 }}>{this.props.route.params.data.count}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: 11 }}><Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 11 }}>{this.props.route.params.data.lastDate}</Text></Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _onSubmit = async () => {
        let validateFormData = validateData(this.state);
        if (validateFormData) {
            let reqData = {
                "liftFromUserId": this.props.route.params.propData.id.toString(),
                "liftFromUserTypeId": this.props.route.params.propData.contactTypeId.toString(),
                "refUserId": this.props.route.params.data.id.toString(),
                "refUserTypeId": this.props.route.params.data.contactTypeId.toString(),
                "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                "userGroup": "2",
                "sales": modDocumentArr(this.state.documentArr, this.state.quantity, this.state.selectedUnit.id, this.state.fromDateObj.rawDate, this.state.locationObj)
            }
            this.setState({ updateLiftingLoader: true });
            let responseData = await MiddlewareCheck("saveSecondarySales", reqData, this.props);
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    this.props.navigation.goBack();
                    Toaster.ShortCenterToaster(responseData.message);
                    this.clearFormData();
                }
                else {
                    Toaster.ShortCenterToaster(responseData.message)
                }
            }
            this.setState({ updateLiftingLoader: false });
        }
    }

    _onReset = async () => {
        await this.clearFormData();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.cameraVisible ?
                    <CustomCamera isVisible={this.state.cameraVisible} onCloseCamera={(value) => this.setState({ cameraVisible: value })} picData={(value) => this.onSelectPic(value)} />
                    :
                    null
                }
                <Header {...this.props} onRefresh={() => console.log("")} />
                <ProfileSec props={this.props} />
                <ScrollView style={{ bottom: 10 }}>
                    <View style={{ marginHorizontal: 15 }}>
                        {this.headerSec()}
                        {this.liftingFromSec()}
                        <View style={{}}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : -50} // Adjust this value as needed
                            >
                                <ScrollView keyboardShouldPersistTaps={"handled"} ref={this.scrollViewRef} style={{ flex: 1, height: Dimension.height / 1.8 }}>
                                    <View>
                                        {this.productSec()}
                                        {this.quantitySec()}
                                        {this.dateSec()}
                                        {this.uploadSec()}
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                    <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", width: Dimension.width, bottom: 0 }}>
                        {this.state.submitLoader ?
                            <ActivityIndicator size={"small"} />
                            :
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 20 }}>
                                <TouchableOpacity onPress={() => this._onReset()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.WHITE.PURE_WHITE, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Color.COLOR.RED.AMARANTH }}>
                                    <Text style={{ color: Color.COLOR.RED.AMARANTH, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Reset</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }} />
                                {this.state.updateLiftingLoader ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator />
                                    </View>
                                    :
                                    <>
                                        {this.state.isDateCheck ?
                                            <TouchableOpacity onPress={() => this._onSubmit()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
                                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Update Lifting</Text>
                                            </TouchableOpacity>
                                            : null
                                        }
                                    </>
                                }
                            </View>
                        }
                    </View>
                </ScrollView>
                {this.modalSec()}
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
        stateCheckForNetwork,
        stateUserInformation,
        userSelectedBeatRouteData
    }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(UpdateLiftingFormForCustomer);