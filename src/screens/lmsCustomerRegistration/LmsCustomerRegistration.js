import React from "react";
import { SafeAreaView, Image, View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { connect } from "react-redux";
import { Color, Dimension, FontFamily, FontSize, ImageName } from "../../enums";
import styles from "./Style";
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { bindActionCreators } from "redux";
import { BottomModal, CustomCamera, DropdownInputBox, ImageUploadModal, TextInputBox } from "../../shared";
import Header from "../header/Header";
import SvgComponent from "../../assets/svg";
import { LmsLocationMapping, ProfileSec } from "../../pageShared";
import { ScrollView } from "react-native";
import { DataValidator } from "../../validators";
import { MiddlewareCheck, MiddlewareFileCheck } from "../../services/middleware";
import { modDocTypeData, modifyCustomerTypeArr, modifyLocationMappedData, validateData } from "./Function";
import { ErrorCode } from "../../services/constant";
import { FileUpload, StorageDataModification, Toaster } from "../../services/common-view-function";
import { App_uri } from "../../services/config";
import CountryPicker from "react-native-country-picker-modal";


// pan card,aadhar card,voter Id card,GST Reg. cert

const documentArr = [
    {
        id: 1,
        name: "Pan Card"
    },
    {
        id: 2,
        name: "Aadhar Card"
    },
    {
        id: 3,
        name: "Voter ID Card"
    },
    {
        id: 4,
        name: "GST Reg. Cert."
    },
]

class InfluencerNewCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.scrollViewRef = React.createRef();
        this.state = {
            superTraderist: [],
            selectedItem: {},
            phoneNumber: "",
            customerName: "",
            businessName: "",
            mailId: "",
            customerTypeArr: [],
            selectedCustomerObj: {},
            visibleProfileImgUploadModal: false,
            locationArr: [],
            locationObj: [],
            profileImg: "",
            profileRaw: "",
            imageLoader: false,
            profileImgLoader: false,
            cameraVisible: false,
            // propData: this.props.route.params.propData,
            locationLoader: false,
            submitLoader: false,
            documentTypeArr: [],
            selectedDocumentTypeObj: {},
            isVisibleUploadFileModal: false,
            documentNumber: "",
            docImgLoader: false,
            docImg: "",
            docType: "",
            docName: "",
            documentArr: [],
            isPhoneExists: false,
            checkPhoneLoader: false,
            erpCode: "",
            countryCode: "IN",
            countryNumber: "91",
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
        await this.getDocTypeApiCall();
        await this.onFetchCustomerType()
        await this._getHierarchyTypesSlNo();
    }

    getDocTypeApiCall = async () => {
        let responseData = await MiddlewareCheck("getDocumentsType", {}, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.documentTypeArr = modDocTypeData(responseData.response.data);
                this.setState({ documentTypeArr: this.state.documentTypeArr });
            } else {
                // this.setState({ alertMessage: responseData.message });
            }
        }
    }

    // for get the get Hierarchy Types With Sl No for country
    _getHierarchyTypesSlNo = async () => {
        this.setState({ locationLoader: true })
        let mappedLoaction = await StorageDataModification.mappedLocationData({}, "get")
        if ((await StorageDataModification.locationMappedData({}, "get")) === null) {
            let responseData = await MiddlewareCheck("getHierarchyTypesSlNo", { "typeOfItem": "1" });
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    await StorageDataModification.locationMappedData(modifyLocationMappedData(responseData.response, mappedLoaction), "store");
                } else {
                    // this.setState({ alertMessage: responseData.message });
                }
            }
        }
        this.setState({ locationLoader: false })

        return true;
    }

    onFetchCustomerType = async () => {
        let responseData = await MiddlewareCheck("getContactTypes_v2", { "isProject": "0" }, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.customerTypeArr = modifyCustomerTypeArr(responseData.response)
                this.setState({
                    customerTypeArr: this.state.customerTypeArr
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ tabLoader: false })
    }


    profileSec = () => {
        return (
            <ProfileSec props={this.props} />
        )
    }

    checkMobileNoExistOrNot = async (txt) => {
        let reqData = {
            "phoneNumber": txt,
            "isProject": "0"
        }
        this.setState({ checkPhoneLoader: true })
        let responseData = await MiddlewareCheck("phoneNumberExist_customer", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                Toaster.ShortCenterToaster(responseData.message)
                this.setState({ isPhoneExists: true })
                // this.clearExistsData()
            } else {
                Toaster.ShortCenterToaster(responseData.message)
                this.setState({ isPhoneExists: false })

            }
        }
        this.setState({ checkPhoneLoader: false })
    }

    handleCountryChange = (country) => {
        this.setState({ countryCode: country.cca2, countryNumber: country.callingCode[0] });
    };

    _onChangePhoneNumber = (val) => {
        let newText = DataValidator.inputEntryValidate(val, "number")
        this.setState({ phoneNumber: newText })
        if (val.length > 9) {
            this.checkMobileNoExistOrNot(val);
        }
    }

    _onChangeCustomerName = (val) => {
        let newText = DataValidator.inputEntryValidate(val, "nameSpace")
        this.setState({ customerName: newText })
    }

    _onChangeErpCode = (val) => {
        this.setState({ erpCode: val })
    }

    _onChangeCustomerBusinessName = (val) => {
        let newText = DataValidator.inputEntryValidate(val, "nameSpace")
        this.setState({ businessName: newText })
    }


    _onChangeCustomerType = (val) => {
        this.setState({ selectedCustomerObj: val })
    }

    _onChangeMail = (val) => {
        this.setState({ mailId: val })
    }

    onSelectLocationData = (value) => {
        this.state.locationArr = value.totalData;
        this.state.locationObj = value.value;
        this.setState({
            locationArr: this.state.locationArr,
            locationObj: this.state.locationObj
        })
    }

    _onChangeDocumentType = (value) => {
        this.setState({ selectedDocumentTypeObj: value })
    }

    _onChangeDocumentNumber = (value) => {
        this.setState({ documentNumber: value })

    }

    // for profile image upload visible
    _onProfilePicModalVisible = async (type) => {
        this.setState({
            visibleProfileImgUploadModal: type
        })
    }

    ImageUploadApiCall = async (uploadData) => {
        this.setState({ profileImgLoader: true })
        let imgData = await MiddlewareFileCheck("crmImageupload", uploadData, this.props);
        if (imgData) {
            if (imgData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.profileImg = imgData.response.fileName;
                this.state.profileRaw = uploadData.uri;
                this.setState(this.state)
            }
        }
        this.setState({ profileImgLoader: false })
    }

    DocUploadApiCall = async (uploadData) => {
        this.setState({ docImgLoader: true })
        let imgData = await MiddlewareFileCheck("crmImageupload", uploadData, this.props);
        if (imgData) {
            if (imgData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let type = imgData.response.fileName.split('.').pop()
                this.setState({ docType: type })
                this.setState({ docImg: imgData.response.fileName, docName: imgData.response.orgfilename })
            }
        }
        this.setState({ docImgLoader: false })
    }

    onSelectFile = async (type) => {
        let uploadData = await FileUpload.uploadPdfAndImage();
        await this.DocUploadApiCall(uploadData);
    }

    modalSec = () => {
        const OnChooseGallery = async () => {
            this._onProfilePicModalVisible(false)
            let uploadData = await FileUpload.uploadImg();
            await this.ImageUploadApiCall(uploadData);
        }
        const OnChooseCamera = async () => {
            this.setState({ cameraVisible: true });
        }

        const onCloseUploadFileModal = () => {
            this.setState({ isVisibleUploadFileModal: false, docImg: "", docName: "", docType: "", documentNumber: "", selectedDocumentTypeObj: {} });
        }

        const onUploadFile = () => {
            if (this.state.docName.length == 0) {
                Toaster.ShortCenterToaster("Please add Document !")
            } else if (this.state.documentNumber.length == 0) {
                Toaster.ShortCenterToaster("Please add Document Number !")
            } else {
                let docData = {
                    "docName": this.state.docName,
                    "docType": this.state.docType,
                    "docImg": this.state.docImg,
                    "fileType": this.state.selectedDocumentTypeObj.name,
                    "docTypeId": this.state.selectedDocumentTypeObj.id,
                    "docFileName": this.state.docImg
                }
                this.state.documentArr.push(docData)
                onCloseUploadFileModal()
                this.scrollToBottom()
            }
        }
        return (
            <>
                <ImageUploadModal
                    isVisible={this.state.visibleProfileImgUploadModal}
                    onGallerySelect={(value) => OnChooseGallery(value)}
                    onCameraSelect={(value) => OnChooseCamera(value)}
                    onCloseModal={() => this._onProfilePicModalVisible(false)}
                />

                <BottomModal
                    isVisible={this.state.isVisibleUploadFileModal}
                    children={
                        <View style={styles.modalview}>
                            <View style={{ flexDirection: 'row', marginVertical: 15, alignItems: "center" }}>
                                <View style={{ flex: 1, marginLeft: 15 }} >
                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Upload Files</Text>
                                </View>
                                <TouchableOpacity style={styles.dropdownSec} onPress={() => onCloseUploadFileModal()} >
                                    <SvgComponent svgName={"cross"} strokeColor={"#fff"} height={15} width={15} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: "center", paddingHorizontal: 20 }}>
                                <TouchableOpacity onPress={() => this.onSelectFile(true)} style={{ borderStyle: "dashed", borderWidth: 1, justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
                                    {this.state.docImgLoader ?
                                        <View style={{ height: 200, justifyContent: "center", alignItems: "center" }}>
                                            <ActivityIndicator />
                                        </View>
                                        :
                                        <React.Fragment>
                                            {this.state.docImg.length > 0 ?
                                                <>
                                                    <Image source={this.state.docType == "pdf" ? ImageName.PDF_ICON :
                                                        // this.state.docType == "xlsx" || this.state.docType == "xls" ? ImageName.XLS_ICON :
                                                        //     this.state.docType == "docX" ? ImageName.DOC_ICON :
                                                        { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + this.state.docImg }} style={{ height: 250, width: 150, resizeMode: "contain" }} />
                                                    <View style={{ marginHorizontal: 20 }}>
                                                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{this.state.docName}</Text>
                                                    </View>
                                                </>
                                                :
                                                <View style={{ padding: 100 }}>
                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>Select File</Text>
                                                </View>
                                            }
                                        </React.Fragment>
                                    }
                                </TouchableOpacity>
                                <View style={{ marginTop: 15 }}>
                                    <TextInputBox
                                        value={this.state.documentNumber}
                                        onChangeText={(value) => this._onChangeDocumentNumber(value)}
                                        keyboardType={"default"}
                                        placeholder={"Write the Number"}
                                        placeholderTextColor={"#5F5F5F"}
                                        height={45}
                                        borderRadius={25}
                                        additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                    />
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => onUploadFile()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                                        <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Upload</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: 50 }} />
                        </View>
                    }
                />
            </>

        )
    }
    // for custom camera open
    onSelectPic = async (value) => {
        await this._onProfilePicModalVisible(false);
        await this.ImageUploadApiCall(value);
    }

    _onSubmit = async () => {
        let reqData = {
            "customerTypeId": this.state.selectedCustomerObj.id ? this.state.selectedCustomerObj.id.toString() : "",
            "custBusinessName": this.state.businessName.toString(),
            "firstName": this.state.customerName.toString(),
            "lastName": "",
            "gender": "",
            "dob": "",
            "phoneNumber": [this.state.phoneNumber],
            "phone": this.state.phoneNumber.toString(),
            "email": [this.state.mailId],
            "title": "",
            "custAddress": "",
            "residentAddress": "",
            "market": "",
            "pinCode": "",
            "profilePic": this.state.profileImg ? this.state.profileImg.toString() : "",
            "locationObj": this.state.locationObj,
            "locationData": [
                {
                    "hierarchyDataId": this.state.locationObj.hierarchyDataId,
                    "hierarchyTypeId": this.state.locationObj.hierarchyTypeId
                }
            ],
            "godownCapacity": "",
            "godownCapacityUnit": "",
            "isProject": "0",

            "contactType": "",
            "visitDate": "",
            "customerDescription": "",
            "erpCode": this.state.erpCode ? this.state.erpCode : "",
            "geoLocation": "",
            "landmark": "",
            "hierarchyDataId": "",
            "hierarchyTypeId": "",
            "phoneArr": [],
            "emailArr": [],
            "yearOfEstd": "",
            "godownCapacity": "",
            "godownLocation": "",
            "advanced": "",
            "appliedCreditLimit": "",
            "primaryItemId": "",
            "firsmStatus": "",
            "tradeLicenceDoc": "",
            "GSTcertificateDoc": "",
            "panCardDoc": "",
            "aadharCardDoc": "",
            "cancelChequeDoc": "",
            "custDocArray": this.state.documentArr,
            "countryCode": this.state.countryNumber ? this.state.countryNumber : "91",
            "isUser": "0"

        }
        let validData = validateData(reqData)

        if (validData) {
            this.setState({ submitLoader: true, locationLoader: true })
            let responseData = await MiddlewareCheck("addNewRegCustomer", reqData, this.props);
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    Toaster.ShortCenterToaster("Added Successfully!It will not appear in contact/list until it's verified.")
                    this.props.navigation.goBack()
                } else {
                    Toaster.ShortCenterToaster(responseData.message)
                }
            }
            this.setState({ submitLoader: false, locationLoader: false })
        }
    }

    onAttachPress = () => {
        if (this.state.selectedDocumentTypeObj.id == undefined || this.state.selectedDocumentTypeObj.id == null) {
            Toaster.ShortCenterToaster("Please select the Document Type !")
        } else {
            this.setState({ isVisibleUploadFileModal: true })
        }
    }
    scrollToBottom = () => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    onRemoveDoc = (index) => {
        let arr = this.state.documentArr;
        arr.splice(index, 1)
        this.setState({ documentArr: arr })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {this.state.cameraVisible ?
                        <CustomCamera isVisible={this.state.cameraVisible} onCloseCamera={(value) => this.setState({ cameraVisible: value })} picData={(value) => this.onSelectPic(value)} />
                        :
                        null
                    }
                    <Header {...this.props} onRefresh={() => console.log("")} />
                    {/* {this.profileSec()} */}
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"} ref={this.scrollViewRef}>
                        <View style={{ marginTop: 10, marginHorizontal: 5, marginBottom: 100 }}>
                            {/* <TouchableOpacity style={{ backgroundColor: '#ffffff', height: 60, borderTopLeftRadius: 14, borderTopRightRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{}}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>N E W   C U S T O M E R</Text>
                            </View>
                        </TouchableOpacity> */}
                            {/* <View style={{ backgroundColor: '#ffffff', height: Dimension.height }}> */}
                            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }} >
                                <React.Fragment>
                                    {this.state.profileImgLoader ?
                                        <View style={{ height: 60, width: 60, borderRadius: 100, borderColor: "#000", borderWidth: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicator size="small" color={Color.COLOR.BLUE.VIOLET_BLUE} />
                                        </View> :
                                        <TouchableOpacity onPress={() => this._onProfilePicModalVisible(true)} activeOpacity={0.9}>
                                            {this.state.profileImg.length == 0 ?
                                                <TouchableOpacity onPress={() => this._onProfilePicModalVisible(true)} style={{ height: 60, width: 60, borderRadius: 100, borderColor: "#000", borderWidth: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                                    <SvgComponent svgName={"camera"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={25} width={25} />
                                                </TouchableOpacity>
                                                :
                                                <Image source={{ uri: App_uri.AWS_S3_IMAGE_VIEW_URI + this.state.profileImg }} style={{ height: 60, width: 60, resizeMode: 'cover', borderRadius: 100 }} />
                                            }
                                        </TouchableOpacity>
                                    }
                                </React.Fragment>
                                <Text style={{ color: "#747C90", fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.ITALIC, marginTop: 10, }}>Upload Customer Image</Text>
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 10 }}>
                                <DropdownInputBox
                                    selectedValue={this.state.selectedCustomerObj.id ? this.state.selectedCustomerObj.id.toString() : "0"}
                                    data={this.state.customerTypeArr}
                                    onSelect={(value) => this._onChangeCustomerType(value)}
                                    headerText={"User Type"}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                    isBackButtonPressRequired={true}
                                    isBackdropPressRequired={true}
                                    unSelectedTextColor={"#5F5F5F"}
                                    selectedTextColor={"#1F2B4D"}
                                    fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                    borderRadius={25}
                                    isSearchable={true}
                                    mandatoryField={true}
                                />
                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>Customer Type</Text>
                                </View> */}
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 5, flexDirection: 'row' }}>
                                <View style={styles.countryCodeLine}>
                                    <CountryPicker
                                        countryCode={
                                            this.state.countryCode
                                                ? this.state.countryCode
                                                : "IN"
                                        }
                                        withFilter
                                        withFlag
                                        // withFlagButton={false}
                                        withAlphaFilter
                                        withCallingCodeButton
                                        withCallingCode
                                        preferredCountries={["IN", "US", "GB"]}
                                        onSelect={(country) => this.handleCountryChange(country)}
                                        visible={false}
                                        style={styles.countryCode}
                                    />
                                </View>
                                <View style={{ flex: 0.7 }}>
                                    <TextInputBox
                                        value={this.state.phoneNumber}
                                        onChangeText={(value) => this._onChangePhoneNumber(value)}
                                        keyboardType={"number-pad"}
                                        placeholder={"Phone No."}
                                        placeholderTextColor={"#5F5F5F"}
                                        height={45}
                                        borderRadius={25}
                                        additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                        maxLength={10}
                                        isRightIcon={true}
                                        rightIcon={ImageName.PHONE}
                                        isActivityLoader={this.state.checkPhoneLoader ? true : false}
                                        rightIconStyle={{ height: 15, width: 15 }}
                                        mandatoryField={true}
                                    />
                                </View>
                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>2 8 2 8 2 9 7 3 5 3</Text>
                                </View> */}
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 5 }}>
                                <TextInputBox
                                    value={this.state.customerName}
                                    onChangeText={(value) => this._onChangeCustomerName(value)}
                                    keyboardType={"default"}
                                    placeholder={"Customer Name"}
                                    placeholderTextColor={"#5F5F5F"}
                                    height={45}
                                    borderRadius={25}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                    mandatoryField={true}
                                />
                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>Customer Name</Text>
                                </View> */}
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 5 }}>
                                <TextInputBox
                                    value={this.state.mailId}
                                    onChangeText={(value) => this._onChangeMail(value)}
                                    keyboardType={"default"}
                                    placeholder={"Mail ID"}
                                    placeholderTextColor={"#5F5F5F"}
                                    height={45}
                                    borderRadius={25}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                />
                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>Customer Name</Text>
                                </View> */}
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 5 }}>
                                <TextInputBox
                                    value={this.state.businessName}
                                    onChangeText={(value) => this._onChangeCustomerBusinessName(value)}
                                    keyboardType={"default"}
                                    placeholder={"Customer Business Name"}
                                    placeholderTextColor={"#5F5F5F"}
                                    height={45}
                                    borderRadius={25}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                />
                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>Customer Name</Text>
                                </View> */}
                            </View>
                            {/* {this.state.selectedCustomerObj.id == 104 && this.state.selectedCustomerObj.name == "Dealer" ? */}
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 5 }}>
                                <TextInputBox
                                    value={this.state.erpCode}
                                    onChangeText={(value) => this._onChangeErpCode(value)}
                                    keyboardType={"default"}
                                    placeholder={"ERP Code"}
                                    placeholderTextColor={"#5F5F5F"}
                                    height={45}
                                    borderRadius={25}
                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                />
                                {/* <View style={styles.numberViewSec}>
                                <Text style={styles.textNumber}>Customer Name</Text>
                            </View> */}
                            </View>
                            {/* : null
                            } */}
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                                <Text style={{ color: "#747C90", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.ITALIC, marginTop: 10, }}> <Text style={{ color: "red", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.ITALIC, marginTop: 10, }}>*</Text> Location Information</Text>
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 10 }}>

                                {this.state.locationLoader ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <ActivityIndicator color={Color.COLOR.BLACK.PURE_BLACK} />
                                    </View>
                                    :
                                    <LmsLocationMapping
                                        // type={"lastHierarcyField"}
                                        viewType={"add"}
                                        screenName={"registrationFrom"}
                                        isLabelVisible={false}
                                        gap={0}
                                        onApiCallData={(value) => this.onSelectLocationData(value)} />
                                }
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                                <Text style={{ color: "#747C90", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.ITALIC, marginTop: 10, }}>Other Information</Text>
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <DropdownInputBox
                                        selectedValue={this.state.selectedDocumentTypeObj.id ? this.state.selectedDocumentTypeObj.id.toString() : "0"}
                                        data={this.state.documentTypeArr}
                                        onSelect={(value) => this._onChangeDocumentType(value)}
                                        headerText={"Document Type"}
                                        additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                        isBackButtonPressRequired={true}
                                        isBackdropPressRequired={true}
                                        unSelectedTextColor={"#5F5F5F"}
                                        selectedTextColor={"#1F2B4D"}
                                        fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                        borderRadius={25}
                                        isSearchable={true}
                                    />
                                </View>

                                {/* <View style={styles.numberViewSec}>
                                    <Text style={styles.textNumber}>Customer Type</Text>
                                </View> */}
                                <TouchableOpacity onPress={() => this.onAttachPress()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center" }}>
                                    <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Attach</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{ marginHorizontal: 15, flexDirection: "row", flexWrap: "wrap" }}>
                                {this.state.documentArr.map((item, key) => (
                                    <View key={key}>

                                        <View style={{ marginHorizontal: 5, width: Dimension.width / 3 - 25 }}>
                                            <Image source={item.docType == "pdf" ? ImageName.PDF_ICON :
                                                item.docType == "xlsx" || item.docType == "xls" ? ImageName.XLS_ICON :
                                                    item.docType == "docX" ? ImageName.DOC_ICON : { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + item.docImg }} style={{ height: 160, width: 100, resizeMode: "contain" }} />
                                            <Text style={{ fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: "center" }}>{item.fileType}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.onRemoveDoc(key)} style={{ position: "absolute", right: 0, backgroundColor: Color.COLOR.GRAY.LIGHT_GRAY_COLOR, height: 25, width: 25, borderRadius: 20, padding: 10, alignItems: "center", justifyContent: "center" }}>
                                            <Image source={ImageName.CROSS_IMG} style={{ height: 12, width: 12, resizeMode: "contain" }} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View style={{ width: Dimension.width, justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                                {this.state.submitLoader ?
                                    <ActivityIndicator size={"small"} />
                                    :
                                    <>
                                        {this.state.isPhoneExists ?
                                            null :
                                            <TouchableOpacity onPress={() => this._onSubmit()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 10 }}>
                                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Add New Customer</Text>
                                            </TouchableOpacity>
                                        }
                                    </>
                                }

                            </View>
                            {/* </View> */}
                        </View>
                    </ScrollView>
                    {/* <View style={{ position: "absolute", bottom: 80, width: Dimension.width, justifyContent: "center", alignItems: "center" }}>
                        {this.state.submitLoader ?
                            <ActivityIndicator size={"small"} />
                            :
                            <>
                                {this.state.isPhoneExists ?
                                    null :
                                    <TouchableOpacity onPress={() => this._onSubmit()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 10 }}>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Add New Customer</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }

                    </View> */}
                    {this.modalSec()}
                    {/* <View style={{ marginBottom: 100 }} /> */}
                </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfluencerNewCustomer);