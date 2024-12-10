import React from "react";
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums';
import styles from './Style';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,

} from 'react-native';
import {
    stateCheckForNetwork,
    stateUserInformation
} from '../../redux/Sales360Action';
import { ErrorCode } from '../../services/constant';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BottomModal, CustomCamera, DropdownInputBox, ImageUploadModal, TextInputBox } from "../../shared";
import { DateConvert, FileUpload, StorageDataModification, Toaster } from "../../services/common-view-function";
import { MiddlewareCheck, MiddlewareFileCheck } from "../../services/middleware";
import { App_uri } from "../../services/config";
import { ActivePointCard, DistZoneStateViewModal } from "../../pageShared";
import { modCustDoc, modDocArr, modDocTypeData, modifyResData, validateData } from "./Function";
import SvgComponent from "../../assets/svg";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const bar = {
    activeStrokeWidth: 5,
    inActiveStrokeWidth: 5,
    inActiveStrokeOpacity: 0.2
};

let optionsArr = [
    {
        id: 1,
        name: "Profile",
        icon: "barGraphWithStar",
        check: true
    },
    // {
    //     id: 2,
    //     name: "Upload",
    //     icon: "upload",
    //     check: false
    // },

    // {
    //     id: 6,
    //     name: "Loyalty",
    //     icon: "grievance",
    //     check: false
    // },

]

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.scrollViewRef = React.createRef();
        this.state = {
            visiblePhotoModal: false,
            profileImgLoader: false,
            imageUrl: "",
            userInfoData: {},
            imageName: "",
            pageLoader: true,

            zoneDistDetailsModal: false,
            modalDataType: "state",
            cameraVisible: false,
            showHideArea: false,
            userData: {},
            optionsArrData: optionsArr,
            isEditable: "",
            selectedTab: "Profile",
            chartData: {},
            chartLoader: true,
            documentTypeArr: [],
            selectedDocumentTypeObj: {},
            isVisibleUploadFileModal: false,
            documentNumber: "",
            docImgLoader: false,
            docImg: "",
            docType: "",
            docName: "",
            documentArr: [],
            locationLoader: false,
            submitLoader: false,
            docLoader: true
        }
    }

    componentDidMount() {
        this.resetSelection();
        this.setState(this.state);
        this._load();
    }

    resetSelection = () => {
        const updatedOptionsArrData = this.state.optionsArrData.map(item => {
            if (item.id === 1) {
                item.check = true;
            } else {
                item.check = false;
            }
            return item;
        });
        this.setState({ optionsArrData: updatedOptionsArrData });
    }

    _detailsModal = () => {
        this.setState({
            detailsModal: !this.state.detailsModal
        })
    }

    getChartData = async () => {
        let responseData = await MiddlewareCheck("dashboardChart", {}, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ chartData: responseData.response })
            }
        }
        await this.setChartLoader(false)
    }

    setChartLoader = async (type) => {
        this.setState({ chartLoader: type })
    }

    _onBack = () => {
        this.props.navigation.goBack()
    }
    _getUserInfoFromApi = async () => {
        let responseData = await MiddlewareCheck("getGeneralData", {}, this.props);
        if (responseData) {
            if (responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({
                    userInfoData: modifyResData(responseData.data.details)
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }

    // for get the customer info
    _getCustomerInfoFromApi = async () => {
        this.setState({ attendanceLoader: true });
        let reqData = {
            moduleType: "LMS"
        }
        let responseData = await MiddlewareCheck("getCustomerGeneralData", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({
                    userInfoData: modifyResData(responseData.response.details)
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ attendanceLoader: false });
    }

    getCustomerDocumentsApiCall = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        let reqData = {
            selectedCustomerId: userInfo.userId,
        }
        let responseData = await MiddlewareCheck("getCustomerDocuments", reqData, this.props);
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let custDocArr = modCustDoc(responseData.response);
                this.setState({ documentArr: custDocArr, docLoader: false })
            }
        }
    }

    _load = async () => {
        let userData = await StorageDataModification.userCredential({}, "get")
        this.setState({ userData: userData })
        if (this.props.Sales360Redux.loginData.loginType == "employee") {
            await this._getUserInfoFromApi();
        } else {
            await this._getCustomerInfoFromApi()
        }
        this.setState({
            imageName: this.state.userInfoData.profileImgUrl ? this.state.userInfoData.profileImgUrl : "",
            pageLoader: false
        })
    }

    // get document type api call
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

    _onDistZoneDetailsModal = (value) => {
        this.setState({
            zoneDistDetailsModal: !this.state.zoneDistDetailsModal
        })

        if (value !== undefined || value !== null) {
            this.state.modalDataType = value;
            this.setState({
                modalDataType: this.state.modalDataType
            })
        }
    }

    modalSection = () => {
        return (
            <>
                <ImageUploadModal
                    isVisible={this.state.visiblePhotoModal}
                    onGallerySelect={(value) => this._onChooseGallery(value)}
                    onCameraSelect={(value) => this._onChooseCamera(value)}
                    onCloseModal={(value) => this._onTakePhoto(value)}
                />
                {this.state.zoneDistDetailsModal ?
                    <DistZoneStateViewModal
                        isVisible={this.state.zoneDistDetailsModal}
                        data={this.state.modalDataType == 'state' ? this.state.userInfoData.hmUpperNodes.State : this.state.modalDataType == 'district' ? this.state.userInfoData.hmUpperNodes.District : this.state.modalDataType == 'zone' ? this.state.userInfoData.hmUpperNodes.Zone : ""}
                        headerText={this.state.modalDataType == 'state' ? 'All States' : this.state.modalDataType == 'district' ? 'All Districts' : this.state.modalDataType == 'zone' ? 'All Zones' : ''}
                        onCloseModal={() => this._onDistZoneDetailsModal()}
                    />
                    :
                    null
                }
            </>
        )
    }

    // get photo from Gallery
    _onChooseGallery = async () => {
        await this._onTakePhoto();
        let uploadData = await FileUpload.uploadImg();
        await this._onImageUpload(uploadData);
    }

    // get photo from camera
    _onChooseCamera = async () => {
        await this._onTakePhoto();
        // let uploadData = await FileUpload.uploadCameraImg();
        // await this._onImageUpload(uploadData);
        this.setState({ cameraVisible: true });
    }

    _onImageUpload = async (uploadData) => {
        this.setState({
            visiblePhotoModal: false,
            profileImgLoader: true,
            pageLoader: true,
        })

        let responseData = await MiddlewareFileCheck("crmImageupload", uploadData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                // if (this.props.Sales360Redux.loginData.loginType == "employee") {
                await this._onSaveProfilePic(responseData);
                // }
                // else {
                //     await this._onSaveCustomerProfilePic(responseData);
                // }
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }

        this.setState({ profileImgLoader: false, pageLoader: false })
    }

    _onSaveProfilePic = async (imageUploadData) => {
        let responseData = await MiddlewareCheck("profilePicUpdate", { "profilePic": imageUploadData.response.fileName }, this.props);
        if (responseData) {
            if (responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let userInfo = this.props.Sales360Redux.userInfo;
                userInfo.details.profileImgUrl = imageUploadData.response.fileName;
                this.props.stateUserInformation(userInfo);
                this.setState({
                    imageName: imageUploadData.response.fileName,
                })
                Toaster.ShortCenterToaster(responseData.message);
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }

    }

    _onSaveCustomerProfilePic = async (imageUploadData) => {
        let responseData = await MiddlewareCheck("customerProfilePicUpdate", { "imageName": imageUploadData.response.fileName }, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let userInfo = this.props.Sales360Redux.userInfo;
                userInfo.details.profileImgUrl = imageUploadData.response.fileName;
                this.props.stateUserInformation(userInfo);
                this.setState({
                    imageName: imageUploadData.response.fileName,
                })
                Toaster.ShortCenterToaster(responseData.message);
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }

    }

    // on update document api call
    onUploadDoc = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get");
        let reqData = {
            "selectedCustomerId": userInfo.userId,
            "custDocArray": await modDocArr(this.state.documentArr),
        }
        let validData = validateData(reqData)

        if (validData) {
            this.setState({ submitLoader: true, locationLoader: true })
            let responseData = await MiddlewareCheck("addCustomerDocuments", reqData, this.props);
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    // Toaster.ShortCenterToaster(responseData.message)
                    Toaster.ShortCenterToaster(responseData.message)
                    // this.props.navigation.goBack()
                } else {
                    Toaster.ShortCenterToaster(responseData.message)
                }
            }
            this.setState({ submitLoader: false, locationLoader: false })
        }
    }

    // for custom camera open
    onSelectPic = async (value) => {
        await this._onTakePhoto(false);
        await this._onImageUpload(value);
    }

    _onTakePhoto = async () => {
        this.state.visiblePhotoModal = !this.state.visiblePhotoModal;
        this.setState({
            visiblePhotoModal: this.state.visiblePhotoModal
        })
    }

    onSelectWorkingArea = () => {
        this.setState({
            showHideArea: !this.state.showHideArea
        })
        this.scrollViewRef.current.scrollTo({ y: 500, animated: true });
    }

    getModifiedDocumentType = async () => {
        let arr = this.state.documentTypeArr;
        let data = this.state.documentArr;
        let mainArr = [];
        if (data) {
            if (data.length > 0) {
                mainArr = arr.filter(item => {
                    // Check if there is no match for docTypeId in dataArr
                    return !data.some(dataItem => dataItem.docTypeId === item.id);
                });
            }
        }
        this.setState({ documentTypeArr: mainArr })
    }

    selectOption = async (item, key) => {
        let arr = this.state.optionsArrData
        for (let i = 0; i < arr.length; i++) {
            if (i == key) {
                arr[i].check = true
                if (item.name == "Activity") {
                    this.props.navigation.navigate("MyActivity")
                } else if (item.name == "Upload") {
                    await this.getDocTypeApiCall();
                    await this.getCustomerDocumentsApiCall();
                    await this.getModifiedDocumentType();
                }
            } else {
                arr[i].check = false
            }
        }
        this.state.optionsArrData = arr;
        // optionsArr
        this.setState({ optionsArrData: this.state.optionsArrData, selectedTab: item.name })
        // if (item.name == "Loyalty") {
        //     await this.setChartLoader(true)
        //     await this.getChartData()
        // }
        // for (let i = 0; i < arr.length; i++) {
        //     if (i == key) {
        //         arr[i].check = true
        //         if (item.name == "Upload") {
        //             await this.getDocTypeApiCall();
        //             await this.getCustomerDocumentsApiCall()
        //         }
        //     } else {
        //         arr[i].check = false
        //     }
        // }
    }

    onPressChangePassword = () => {
        this.props.navigation.navigate("ChangePassword");
    }

    //profile tab section

    profileSec = () => {
        return (
            <>
                {this.state.pageLoader ?
                    <SkeletonPlaceholder>
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />
                        <View style={{ height: 80, marginVertical: 5, marginHorizontal: 10 }} />

                    </SkeletonPlaceholder>
                    :
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} ref={this.scrollViewRef}>
                        <TouchableOpacity style={styles.textInputView} activeOpacity={0.9} onPress={() => this.onPressChangePassword()}>
                            <View style={styles.detailsMainView}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"profileWithBorder"} strokeColor={"#292D32"} height={35} width={35} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>Change Password</Text>
                                    <Text style={styles.subTextName}>Change your Password</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </TouchableOpacity>
                        <View style={styles.textInputView}>
                            <View style={styles.detailsMainView}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"phone"} strokeColor={"#292D32"} height={38} width={38} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>{this.state.userInfoData.phone}</Text>
                                    <Text style={styles.subTextName}>Personal Contact Number</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </View>
                        <View style={styles.textInputView}>
                            <View style={styles.detailsMainView}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"mail"} strokeColor={"#292D32"} height={35} width={35} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>{this.state.userInfoData.email}</Text>
                                    <Text style={styles.subTextName}>Contact mail ID</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </View>
                        <View style={styles.textInputView}>
                            <View style={styles.detailsMainView}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"designation"} strokeColor={"#292D32"} height={35} width={35} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>{this.state.userInfoData.designationName}</Text>
                                    <Text style={styles.subTextName}>Designation</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </View>
                        {this.state.userInfoData.roleName.length == 0 ? null :
                            <View style={styles.textInputView}>
                                <View style={styles.detailsMainView}>
                                    <View style={{ marginRight: 20 }}>
                                        <SvgComponent svgName={"profileWithBorder"} strokeColor={"#292D32"} height={38} width={38} />
                                    </View>
                                    <View>
                                        <Text style={styles.headerText}>{this.state.userInfoData.roleName}</Text>
                                        <Text style={styles.subTextName}>Role Name</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                            </View>
                        }

                        {/* <View style={styles.textInputView}>
                            <View style={styles.detailsMainView}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"locationWithCircle"} strokeColor={"#292D32"} height={35} width={35} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>{this.state.userInfoData.address}</Text>
                                    <Text style={styles.subTextName}>Address</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </View> */}
                        {this.state.userInfoData.erpCode == "N/A" ? null :
                            <View style={styles.textInputView}>
                                <View style={styles.detailsMainView}>
                                    <View style={{ marginRight: 20 }}>
                                        <SvgComponent svgName={"contactId"} strokeColor={"#292D32"} height={35} width={35} />
                                    </View>
                                    <View>
                                        <Text style={styles.headerText}>{this.state.userInfoData.erpCode}</Text>
                                        <Text style={styles.subTextName}>Registered : {DateConvert.viewDateFormat(this.state.userInfoData.createdAt)}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                            </View>
                        }

                        <View style={styles.textInputView}>
                            <TouchableOpacity style={styles.detailsMainView} onPress={() => this.onSelectWorkingArea()}>
                                <View style={{ marginRight: 20 }}>
                                    <SvgComponent svgName={"location"} strokeColor={"#292D32"} height={35} width={35} />
                                </View>
                                <View>
                                    <Text style={styles.headerText}>Working Area</Text>
                                    <Text style={styles.subTextName}>Assign to working area</Text>
                                </View>
                                <View style={{ flex: 1 }} />
                                {this.state.showHideArea ?
                                    <View>
                                        <Image source={ImageName.UP_ARROW} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                                    </View>
                                    :
                                    <View>
                                        <Image source={ImageName.DOWN_ARROW} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                                    </View>
                                }

                            </TouchableOpacity>
                            <View style={{ marginTop: 5, borderWidth: 0.4, borderColor: Color.COLOR.GRAY.PHILIPPINE_GRAY }} />
                        </View>
                        <View style={{ maxHeight: 200, marginHorizontal: 15 }}>
                            {this.state.showHideArea ?
                                <>
                                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                                        {this.state.userInfoData.hmName.map((item, key) => (
                                            <View style={{ justifyContent: "flex-start", flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 }} key={key}>
                                                <View style={{ height: 20, width: 20, borderRadius: 100, backgroundColor: Color.COLOR.RED.AMARANTH, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 11, top: 1 }}>{key + 1}</Text>
                                                </View>
                                                <Text style={styles.locationTxt}>{item}</Text>
                                            </View>
                                        ))
                                        }
                                    </ScrollView>
                                </>
                                :
                                null
                            }
                        </View>
                    </ScrollView>
                }
            </>
        )
    }

    // document upload api call
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

    // on select file
    onSelectFile = async (type) => {
        let uploadData = await FileUpload.uploadDocumentAndImage();
        await this.DocUploadApiCall(uploadData);
    }

    // image upload api call
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

    // for custom camera open
    onSelectPic = async (value) => {
        await this._onProfilePicModalVisible(false);
        await this.ImageUploadApiCall(value);
    }

    // on set document number
    _onChangeDocumentNumber = (value) => {
        this.setState({ documentNumber: value })

    }

    // scroll to bottom section
    scrollToBottom = () => {
        if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    // modal section
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

        const onUploadFile = async () => {
            if (this.state.docName.length == 0) {
                Toaster.ShortCenterToaster("Please add Document !")
            } else if (this.state.documentNumber.length == 0) {
                Toaster.ShortCenterToaster("Please add Document Number !")
            } else {
                let docData = {
                    docName: this.state.docName,
                    docType: this.state.docType,
                    docImg: this.state.docImg,
                    fileType: this.state.selectedDocumentTypeObj.name,
                    "docTypeId": this.state.selectedDocumentTypeObj.id,
                    "docFileName": this.state.docImg,
                    "documentNumber": this.state.documentNumber
                }
                this.state.documentArr.push(docData)
                this.setState({ documentArr: this.state.documentArr })
                onCloseUploadFileModal()
                this.scrollToBottom()
                await this.getModifiedDocumentType()
            }
        }
        return (
            <>
                {/* <ImageUploadModal
                    isVisible={this.state.visibleProfileImgUploadModal}
                    onGallerySelect={(value) => OnChooseGallery(value)}
                    onCameraSelect={(value) => OnChooseCamera(value)}
                    onCloseModal={() => this._onProfilePicModalVisible(false)}
                /> */}

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
                                                        this.state.docType == "xlsx" || this.state.docType == "xls" ? ImageName.XLS_ICON :
                                                            this.state.docType == "docX" ? ImageName.DOC_ICON :
                                                                { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + this.state.docImg }} style={{ height: 250, width: 150, resizeMode: "contain" }} />
                                                    <View style={{ paddingHorizontal: 20 }}>
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

    // on set document type
    _onChangeDocumentType = (value) => {
        this.setState({ selectedDocumentTypeObj: value })
    }

    // on attach button press
    onAttachPress = () => {
        if (this.state.selectedDocumentTypeObj.id == undefined || this.state.selectedDocumentTypeObj.id == null) {
            Toaster.ShortCenterToaster("Please select the Document Type !")
        } else {
            this.setState({ isVisibleUploadFileModal: true })
        }
    }

    // on remove button press
    onRemoveDoc = async (index) => {
        await this.getDocTypeApiCall();
        let arr = this.state.documentArr;
        // arr.splice(index, 1)
        const newDocumentArr = arr.filter((_, i) => i !== index);

        this.setState({ documentArr: newDocumentArr })
        await this.getModifiedDocumentType()
    }

    UploadSec = () => {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
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

                        <TouchableOpacity onPress={() => this.onAttachPress()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center" }}>
                            <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                            <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Attach</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.docLoader ?
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="small" color={Color.COLOR.BLACK.PURE_BLACK} />
                        </View> :
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
                    }

                    <View style={{ flex: 1 }} />

                    <View style={{ width: Dimension.width, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                        {this.state.submitLoader ?
                            <ActivityIndicator size={"small"} />
                            :
                            <TouchableOpacity onPress={() => this.onUploadDoc()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginLeft: 10 }}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Upload Document</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }

    loyaltySec = () => {
        const onSelect = (type) => {
            this.props.navigation.navigate(type)
        }
        return (
            <ScrollView>
                <ActivePointCard {...this.props} onPress={() => onSelect()} data={this.state.chartData} />
                {/* <View style={{ marginTop: 12 }} />
                <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginHorizontal: 20, alignItems: 'center', padding: 5, backgroundColor: '#F0F4F7', borderRadius: 35 }}>
                    <SvgComponent svgName={"plusWithCircle"} height={17} width={17} strokeColor={"#1F2B4D"} />
                    <Text style={{ flex: 1, padding: 10, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Add Invoice</Text>
                    <TouchableOpacity style={{ marginLeft: 10, backgroundColor: '#F13748', borderRadius: 30, width: '30%' }}>
                        <Text style={{ padding: 10, color: Color.COLOR.WHITE.PURE_WHITE, alignSelf: 'center', fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>+ Add</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{ marginTop: 12 }} />
                {/* <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginHorizontal: 20, alignItems: 'center', padding: 5, backgroundColor: '#F0F4F7', borderRadius: 35 }}>
                    <SvgComponent svgName={"fourDot"} height={17} width={17} strokeColor={"#1F2B4D"} />
                    <Text style={{ flex: 1, padding: 10, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Check Catalogue</Text>
                    <TouchableOpacity style={{ marginLeft: 10, backgroundColor: '#F13748', borderRadius: 30, width: '30%' }} onPress={() => onSelect("Catalogue")}>
                        <Text style={{ padding: 10, color: Color.COLOR.WHITE.PURE_WHITE, alignSelf: 'center', fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Check</Text>
                    </TouchableOpacity>
                </View>
               
                <View style={{ marginTop: 12 }} />
                <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginHorizontal: 20, alignItems: 'center', padding: 5, backgroundColor: '#F0F4F7', borderRadius: 35 }}>
                    <SvgComponent svgName={"footerCurve"} height={17} width={17} strokeColor={"#1F2B4D"} />
                    <Text style={{ flex: 1, padding: 10, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Redemption History</Text>
                    <TouchableOpacity style={{ marginLeft: 10, backgroundColor: '#F13748', borderRadius: 30, width: '35%' }} onPress={() => onSelect("PassbookAndRedemption")}>
                        <Text style={{ padding: 10, color: Color.COLOR.WHITE.PURE_WHITE, alignSelf: 'center', fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Check</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 12 }} />
                <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginHorizontal: 20, alignItems: 'center', padding: 5, backgroundColor: '#F0F4F7', borderRadius: 35 }}>
                    <SvgComponent svgName={"suggested"} height={17} width={17} strokeColor={"#1F2B4D"} />
                    <Text style={{ flex: 1, padding: 10, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Loyalty Passbook</Text>
                    <TouchableOpacity style={{ marginLeft: 10, backgroundColor: '#F13748', borderRadius: 30, width: '35%' }} onPress={() => onSelect("PassbookAndRedemption")}>
                        <Text style={{ padding: 10, color: Color.COLOR.WHITE.PURE_WHITE, alignSelf: 'center', fontFamily: FontFamily.FONTS.POPPINS.REGULAR, fontSize: FontSize.XS }}>Check</Text>
                    </TouchableOpacity>
                </View> */}

                <View style={{ marginBottom: 30 }}></View>

            </ScrollView>
        )
    }

    render() {
        const filteredOptionsArrData = this.state.optionsArrData.filter(item => {
            if (item.name === "Upload") {
                return this.props.Sales360Redux.loginData.loginType === "customer";
            }
            return true;
        });
        if (this.state.cameraVisible) {
            return <CustomCamera isVisible={this.state.cameraVisible} onCloseCamera={(value) => this.setState({ cameraVisible: value })} picData={(value) => this.onSelectPic(value)} />
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    {this.modalSection()}
                    <View style={styles.profileHead}>
                        <View style={{ flex: 0.55 }}>
                            {this.state.profileImgLoader ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <ActivityIndicator size="small" color={Color.COLOR.BLUE.VIOLET_BLUE} />
                                </View> :
                                <React.Fragment>
                                    <Image source={{ uri: App_uri.AWS_S3_IMAGE_VIEW_URI + this.state.imageName }} style={{ flex: 1, resizeMode: "cover" }} />
                                    <TouchableOpacity style={{ top: 10, right: 5, position: "absolute", }} onPress={() => this._onTakePhoto()} >
                                        <Image source={ImageName.PROFILE_EDIT} style={{ height: 40, width: 40, resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                </React.Fragment>
                            }
                        </View>
                        <View style={{ flex: 0.45, backgroundColor: Color.COLOR.RED.AMARANTH, padding: 10 }}>
                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 17, fontFamily: FontFamily.FONTS.POPPINS.BOLD }}>{this.state.userData.firstName}</Text>
                            {this.props.Sales360Redux.loginData.loginType == "employee" ? null :
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD }}>{this.state.userInfoData.custBusinessName}</Text>
                            }

                            {this.state.pageLoader ?
                                <SkeletonPlaceholder>
                                    <View style={{ height: 8, borderRadius: 10, width: "80%", marginBottom: 10 }} />
                                    <View style={{ height: 8, borderRadius: 10, width: "60%" }} />
                                </SkeletonPlaceholder>
                                :
                                <>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{this.state.userInfoData.roleName}</Text>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }} numberOfLines={2}>{this.state.userInfoData.address}</Text>
                                </>
                            }
                            <View style={{ flexDirection: "row", height: Dimension.height - (Dimension.height - 100) }}>
                                {/* <View style={{ flex: 0.7 }}>
                                        <View style={{ flexDirection: "row", borderRadius: 25, borderWidth: 1, borderColor: Color.COLOR.WHITE.PURE_WHITE, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start", alignItems: "center", marginTop: 10 }}>
                                            <Image source={ImageName.YELLOW_STAR_ICON} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.BOLD, marginLeft: 10 }}>{this.state.userInfoData.levelName}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", borderRadius: 25, borderWidth: 1, borderColor: Color.COLOR.WHITE.PURE_WHITE, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start", alignItems: "center", marginTop: 10 }}>
                                            <Image source={ImageName.YELLOW_COIN_ICON} style={{ height: 20, width: 20, resizeMode: "contain" }} />
                                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.BOLD, marginLeft: 10 }}>{this.state.userInfoData.pointsEarned}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.3, alignItems: "center", alignSelf: "flex-end" }}>
                                        <CircularProgressBase
                                            {...bar}
                                            value={75}
                                            radius={20}
                                            rotation={90}
                                            activeStrokeColor={'#fff'}
                                            inActiveStrokeColor={'#D1D1D1'}
                                            clockwise={false}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.BOLD, top: 2 }}>{75}%</Text>
                                            </View>
                                        </CircularProgressBase>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 10, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>Profile</Text>

                                    </View> */}
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{ borderColor: Color.COLOR.GRAY.DARK_GRAY_COLOR, borderTopWidth: 0.5, marginTop: 5 }} />
                        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                            <View style={{ flexDirection: "row", paddingVertical: 5, height: 75 }}>
                                {/* {this.state.optionsArrData.map((item, key) => (
                                        <TouchableOpacity style={{ width: 90, borderRightWidth: 1, borderRightColor: Color.COLOR.GRAY.GRAY_COLOR, paddingVertical: 5, alignItems: "center", justifyContent: "center", backgroundColor: item.check ? "#F0F4F7" : "#fff" }} onPress={() => this.selectOption(item, key)} key={key}>
                                            <SvgComponent svgName={item.icon} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={30} width={30} />
                                            <Text style={{ color: "#747C90", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginTop: 10 }}>{item.name}</Text>
                                            <View style={{ position: "absolute", top: 0, right: 10 }}>
                                                <View style={{ height: 5, width: 5, backgroundColor: 'red', borderRadius: 50, }} />
                                            </View>
                                        </TouchableOpacity>
                                    ))} */}
                                {filteredOptionsArrData.map((item, key) => (
                                    <TouchableOpacity style={{ width: 90, borderRightWidth: 1, borderRightColor: Color.COLOR.GRAY.GRAY_COLOR, paddingVertical: 5, alignItems: "center", justifyContent: "center", backgroundColor: item.check ? "#F0F4F7" : "#fff" }} onPress={() => this.selectOption(item, key)} key={key}>
                                        <SvgComponent svgName={item.icon} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={30} width={30} />
                                        <Text style={{ color: "#747C90", fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, marginTop: 10 }}>
                                            {item.name}
                                        </Text>
                                        <View style={{ position: "absolute", top: 0, right: 10 }}>
                                            <View style={{ height: 5, width: 5, backgroundColor: 'red', borderRadius: 50 }} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        <View style={{ borderColor: Color.COLOR.GRAY.DARK_GRAY_COLOR, borderBottomWidth: 0.5, }} />
                    </View>
                    {this.state.selectedTab == "Profile" ?
                        this.profileSec()
                        :
                        null
                    }
                    {this.state.selectedTab == "Loyalty" ?
                        this.loyaltySec()
                        :
                        null
                    }
                    {this.state.selectedTab == "Upload" ?
                        this.UploadSec()
                        :
                        null
                    }

                    {this.modalSec()}

                </SafeAreaView>
            )
        }
    };
};

const mapStateToProps = (state) => {
    const { Sales360Redux } = state
    return { Sales360Redux }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        stateCheckForNetwork,
        stateUserInformation
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);