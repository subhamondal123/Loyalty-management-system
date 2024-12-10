import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react'
import styles from './style';
import { View, Image, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../../enums';
import SvgComponent from '../../../assets/svg';
import ActivePointAndLocationSelectionTab from '../activePointAndLocationSelectionTab';
import { FileUpload, StorageDataModification, Toaster } from '../../../services/common-view-function';
import { App_uri } from '../../../services/config';
import { BottomModal, DropdownInputBox, TextInputBox } from '../../../shared';
import { MiddlewareCheck, MiddlewareFileCheck } from '../../../services/middleware';
import { ErrorCode } from '../../../services/constant';
import { modCustDoc, modDocArr, modDocTypeData, validateData } from './function';

function ProfileSec({
    type,
    data,
    isHidden,
    props,
    isRefresh,
    onSelectLocation,
    isLocationVisible

}) {
    if (isHidden) return null;

    const propData = props.route.params.propData;
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [documentTypeArr, setDocumentTypeArr] = useState([]);
    const [selectedDocumentTypeObj, setSelectedDocumentTypeObj] = useState({});
    const [documentArr, setDocumentArr] = useState([]);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [isVisibleUploadFileModal, setIsVisibleUploadFileModal] = useState(false);
    const [documentNumber, setDocumentNumber] = useState("");
    const [docType, setDocType] = useState("");
    const [docImg, setDocImg] = useState("");
    const [docName, setDocName] = useState("");
    const [docImgLoader, setDocImgLoader] = useState(false);
    const [docLoader, setDocLoader] = useState(false);
    const [docTypeLoader, setDoctypeLoader] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // await getDocTypeApiCall();
            // await getCustomerDocumentsApiCall()
        };
        fetchData();
    }, [])

    useEffect(() => {
        // Define a separate async function to handle asynchronous code inside useEffect
        const updateDocumentType = async () => {
            await getModifiedDocumentType();
        };

        updateDocumentType();
    }, [documentArr]); // Depend on documentArr

    const getDocTypeApiCall = async () => {
        setDoctypeLoader(true)
        let responseData = await MiddlewareCheck("getDocumentsType", {}, props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let documentTypeArrData = modDocTypeData(responseData.response.data);
                setDocumentTypeArr(documentTypeArrData)
            } else {
                // this.setState({ alertMessage: responseData.message });
            }
        }
        setDoctypeLoader(false)
    }

    const getCustomerDocumentsApiCall = async () => {
        let reqData = {
            selectedCustomerId: propData.id,
        }
        let responseData = await MiddlewareCheck("getCustomerDocuments", reqData, this.props);
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let custDocArr = modCustDoc(responseData.response);
                setDocumentArr(custDocArr)
                // await getModifiedDocumentType(responseData.response)
            }
        }
    }

    const getModifiedDocumentType = async () => {
        let arr = documentTypeArr;
        let data = documentArr;
        let mainArr = [];
        if (data) {
            if (data.length > 0) {
                mainArr = arr.filter(item => {
                    // Check if there is no match for docTypeId in dataArr
                    return !data.some(dataItem => dataItem.docTypeId === item.id);
                });
            }
        }
        setDocumentTypeArr(mainArr)
    }

    // on set document type
    const onChangeDocumentType = (value) => {
        setSelectedDocumentTypeObj(value);
    }

    const onSelectLocationData = async (val) => {
        onSelectLocation(val)
    }
    const onPressEditProfile = async () => {
        // props.navigation.navigate("ProfilePage");

        await getDocTypeApiCall();
        await getCustomerDocumentsApiCall()
        // await getModifiedDocumentType()
        setIsVisibleModal(true)
    }

    // on attach button press
    const onAttachPress = () => {
        if (selectedDocumentTypeObj.id == undefined || selectedDocumentTypeObj.id == null) {
            Toaster.ShortCenterToaster("Please select the Document Type !")
        } else {
            setIsVisibleUploadFileModal(true)
        }
    }

    const onCloseUploadFileModal = async () => {
        await setInitialState()
        // await getDocTypeApiCall();
        setIsVisibleModal(false)
    }

    const setInitialState = async () => {
        setDocumentArr([])
        setDocumentTypeArr([])
    }

    // on set document number
    const onChangeDocumentNumber = (value) => {
        setDocumentNumber(value)
    }

    // on select file
    const onSelectFile = async (type) => {
        let uploadData = await FileUpload.uploadDocumentAndImage();
        await docUploadApiCall(uploadData);
    }
    // document upload api call
    const docUploadApiCall = async (uploadData) => {
        setDocImgLoader(true);
        let imgData = await MiddlewareFileCheck("crmImageupload", uploadData, this.props);
        if (imgData) {
            if (imgData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let type = imgData.response.fileName.split('.').pop();
                setDocType(type);
                setDocImg(imgData.response.fileName)
                setDocName(imgData.response.orgfilename)
            }
        }
        setDocImgLoader(false);
    }

    const clearUploadedFileData = () => {
        setDocImg("");
        setDocName("");
        setDocType("");
        setDocumentNumber("");
        setSelectedDocumentTypeObj({})
    }

    const onUploadFile = async () => {
        if (docName.length == 0) {
            Toaster.ShortCenterToaster("Please add Document !")
        } else if (documentNumber.length == 0) {
            Toaster.ShortCenterToaster("Please add Document Number !")
        } else {
            let docData = {
                docName: docName,
                docType: docType,
                docImg: docImg,
                fileType: selectedDocumentTypeObj.name,
                "docTypeId": selectedDocumentTypeObj.id,
                "docFileName": docImg,
                "documentNumber": documentNumber
            }
            documentArr.push(docData)
            setIsVisibleUploadFileModal(false);
            clearUploadedFileData()
            // this.scrollToBottom()
            await getModifiedDocumentType()

        }
    }

    const onUploadDoc = async () => {
        let reqData = {
            "selectedCustomerId": propData.id,
            "custDocArray": await modDocArr(documentArr),
        }
        let validData = validateData(reqData)

        if (validData) {
            setSubmitLoader(true);
            let responseData = await MiddlewareCheck("addCustomerDocuments", reqData, this.props);
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    Toaster.ShortCenterToaster(responseData.message)
                    setIsVisibleModal(false)
                    // this.props.navigation.goBack()
                } else {
                    Toaster.ShortCenterToaster(responseData.message)
                }
            }
            setSubmitLoader(false);
        }
        setSubmitLoader(false);
    }

    // on remove button press
    const onRemoveDoc = async (index) => {
        await getDocTypeApiCall();
        let arr = documentArr
        setDocLoader(true)
        // Create a new array without the item at the specified index
        const newDocumentArr = arr.filter((_, i) => i !== index);
        setDocumentArr(newDocumentArr);
        setDocLoader(false)
    }

    const modalSec = () => {
        return (
            <>
                {isVisibleModal ?
                    <BottomModal
                        isVisible={isVisibleModal}
                        children={
                            <View style={styles.modalview}>
                                <View style={{ flexDirection: 'row', marginVertical: 15, alignItems: "center" }}>
                                    <View style={{ flex: 1 }} />
                                    <View>
                                        <Text style={{ fontSize: FontSize.LG, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, color: Color.COLOR.BLUE.LOTUS_BLUE, }}>Upload Document</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                                        <TouchableOpacity style={styles.dropdownSec} onPress={() => onCloseUploadFileModal()} >
                                            <SvgComponent svgName={"cross"} strokeColor={"#fff"} height={15} width={15} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 15, marginVertical: 8, marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        {docTypeLoader ? <ActivityIndicator /> :
                                            <DropdownInputBox
                                                selectedValue={selectedDocumentTypeObj.id ? selectedDocumentTypeObj.id.toString() : "0"}
                                                data={documentTypeArr}
                                                onSelect={(value) => onChangeDocumentType(value)}
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
                                        }
                                    </View>

                                    <TouchableOpacity onPress={() => onAttachPress()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center" }}>
                                        <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                                        <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Attach</Text>
                                    </TouchableOpacity>
                                </View>
                                {docLoader ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size="small" color={Color.COLOR.BLACK.PURE_BLACK} />
                                    </View> :
                                    <View style={{ marginHorizontal: 15, flexDirection: "row", flexWrap: "wrap" }}>
                                        {documentArr.map((item, key) => (
                                            <View key={key}>
                                                <View style={{ marginHorizontal: 5, width: Dimension.width / 3 - 35 }}>
                                                    <Image source={item.docType == "pdf" ? ImageName.PDF_ICON :
                                                        item.docType == "xlsx" || item.docType == "xls" ? ImageName.XLS_ICON :
                                                            item.docType == "docX" ? ImageName.DOC_ICON : { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + item.docImg }} style={{ height: 160, width: 100, resizeMode: "contain" }} />
                                                    <Text style={{ fontSize: 11, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.BLUE.LOTUS_BLUE, textAlign: "center" }}>{item.fileType}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => onRemoveDoc(key)} style={{ position: "absolute", right: 0, backgroundColor: Color.COLOR.GRAY.LIGHT_GRAY_COLOR, height: 25, width: 25, borderRadius: 20, padding: 10, alignItems: "center", justifyContent: "center" }}>
                                                    <Image source={ImageName.CROSS_IMG} style={{ height: 12, width: 12, resizeMode: "contain" }} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                }
                                <View style={{ flex: 1 }} />
                                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                                    {submitLoader ?
                                        <ActivityIndicator size={"small"} />
                                        :
                                        <TouchableOpacity onPress={() => onUploadDoc()} activeOpacity={0.9} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, marginTop: 10 }}>
                                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Upload Document</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        }
                    />
                    : null}

                {/* -----------upload file modal--------------- */}
                {isVisibleUploadFileModal ?
                    <BottomModal
                        isVisible={isVisibleModal}
                        children={
                            <View style={styles.modalview}>
                                <View style={{ flexDirection: 'row', marginVertical: 15, alignItems: "center" }}>
                                    <View style={{ flex: 1 }} />
                                    <View>
                                        <Text style={{ fontSize: FontSize.LG, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, color: Color.COLOR.BLUE.LOTUS_BLUE, }}>Upload Document</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                                        <TouchableOpacity style={styles.dropdownSec} onPress={() => setIsVisibleUploadFileModal(false)} >
                                            <SvgComponent svgName={"cross"} strokeColor={"#fff"} height={15} width={15} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ justifyContent: "center", paddingHorizontal: 20 }}>
                                    <TouchableOpacity onPress={() => onSelectFile(true)} style={{ borderStyle: "dashed", borderWidth: 1, justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
                                        {docImgLoader ?
                                            <View style={{ height: 200, justifyContent: "center", alignItems: "center" }}>
                                                <ActivityIndicator />
                                            </View>
                                            :
                                            <React.Fragment>
                                                {docImg.length > 0 ?
                                                    <>
                                                        <Image source={docType == "pdf" ? ImageName.PDF_ICON :
                                                            docType == "xlsx" || docType == "xls" ? ImageName.XLS_ICON :
                                                                docType == "docX" ? ImageName.DOC_ICON :
                                                                    { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + docImg }} style={{ height: 250, width: 150, resizeMode: "contain" }} />
                                                        <View style={{ paddingHorizontal: 10 }}>
                                                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{docName}</Text>
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
                                    <View style={{ marginVertical: 15 }}>
                                        <TextInputBox
                                            value={documentNumber}
                                            onChangeText={(value) => onChangeDocumentNumber(value)}
                                            keyboardType={"default"}
                                            placeholder={"Write the Document Number"}
                                            placeholderTextColor={"#5F5F5F"}
                                            height={45}
                                            borderRadius={25}
                                            additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                        />
                                    </View>
                                    <View style={{ marginVertical: 15 }}>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => onUploadFile()} style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Image source={ImageName.UPLOAD_LOGO} style={{ height: 18, width: 18, resizeMode: "contain" }} />
                                            <Text style={{ fontSize: 14, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: Color.COLOR.WHITE.PURE_WHITE, marginLeft: 10 }}>Upload</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                    : null}

            </>
        )
    }

    return (
        <View>
            <React.Fragment>
                <View style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, height: 150 }}>
                    <View style={{ marginHorizontal: 10, marginVertical: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ borderRadius: 100, borderColor: Color.COLOR.WHITE.PURE_WHITE, borderWidth: 1, height: 62, width: 62, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={propData.profilePic && propData.profilePic.length > 0 ? { uri: App_uri.AWS_S3_IMAGE_VIEW_URI + propData.profilePic } : ImageName.USER_IMG} style={{ height: 60, width: 60, resizeMode: 'contain', borderRadius: 100 }} />
                            </View>
                            <View style={{ flex: 1, marginLeft: '5%' }}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>For</Text>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{propData.custBusinessName.length > 0 ? propData.custBusinessName : propData.customerName.length > 0 ? propData.customerName : propData.ownerName}</Text>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{propData.contactTypeName}</Text>
                            </View>
                            <View>
                                {/* <View style={{ alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={{ backgroundColor: Color.COLOR.WHITE.PURE_WHITE, borderRadius: 18, height: 38, width: 38, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => onPressEditProfile()} activeOpacity={0.9}>
                                        <SvgComponent svgName={"upload"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={22} width={22} />
                                    </TouchableOpacity>
                                </View> */}
                                {/* <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Sales As</Text>
                                    <View style={{ width: 15 }} />
                                    <View style={{ backgroundColor: Color.COLOR.RED.AMARANTH, height: 22, width: 22, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>3</Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>
                        {/* {isRefresh ? null : */}
                        <ActivePointAndLocationSelectionTab {...props} selectedLocation={(value) => onSelectLocationData(value)} screen={"profile"} isVisibleLocation={isLocationVisible} />
                        {/* } */}
                        {/* {activePointSec()} */}
                        {modalSec()}
                    </View>
                </View>
            </React.Fragment >
        </View >
    );

}

ProfileSec.defaultProps = {
    isHidden: false,
    data: {},
    type: "",
    isRefresh: false,
    onSelectLocation: () => { },
    isLocationVisible: false
};

ProfileSec.propTypes = {
    data: PropTypes.instanceOf(Object),
    isHidden: PropTypes.bool,
    type: PropTypes.string,
    isRefresh: PropTypes.bool,
    onSelectLocation: PropTypes.func,
    isLocationVisible: PropTypes.bool,

};


export default ProfileSec;