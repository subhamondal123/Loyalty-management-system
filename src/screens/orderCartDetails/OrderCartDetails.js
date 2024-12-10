import React from "react";
import { Image, SafeAreaView, Text, View, TouchableOpacity, Linking, ScrollView, ActivityIndicator } from "react-native";
import styles from "./Style";
import { Color, Dimension, FontFamily, FontSize, ImageName } from "../../enums";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { StorageDataModification, Toaster } from "../../services/common-view-function";
import { MiddlewareCheck } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
import { getTotalPoint, modCartDataForRequest, modDeliveryAddress, modifyCartData, modPointData } from "./Function";
import { CheckBox, ImagePreview, Modal, NoDataFound, TextInputBox } from "../../shared";
import SvgComponent from "../../assets/svg";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";


class OrderCartDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoader: true,
            listLoader: false,
            refreshing: true,
            pageNum: 0,
            limit: 10,
            finalCartData: [],
            claimLoader: false,
            userData: {},
            isOffline: false,
            isNetActive: false,
            istelephonic: false,
            isTelephonicData: "0",
            itemData: this.props.route.params.data,
            userData: {},
            isVisibleAddressModal: false,
            deliveryAddress: [],
            addressLoader: false,
            defaultAddressCheck: true,
            addNewAddressCheck: false,
            newAddress: "",
            cartCount: this.props.route.params.cartData.count,
            pageLoader: true,
            propData: this.props.route.params.propData ? this.props.route.params.propData : {},
            checkPan: false,
            userPoint: 0,
            totalPoint: 0
        };
    }

    // this is a initial function which is call first
    componentDidMount = async () => {
        let userInfo = await StorageDataModification.userCredential({}, "get")
        this.setState({ userData: userInfo })
        // await this.checkPanAvailable()
        await this.getUserPoints()
        // await this.getCartCount();
        await this.getCartDetails()
        this.getTotalPoint()
    }

    // checkPanAvailable = async () => {
    //     let reqData = {
    //         "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.userId,
    //     }
    //     let responseData = await MiddlewareCheck("checkPanDoc", reqData, this.props)
    //     if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
    //         this.setState({ checkPan: responseData.response })
    //     }
    // }

    getUserPoints = async () => {
        let reqData = {
            "forFinancialYearId": this.props.route.params.selectedFinancialYearObj.id,
            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString()
        }
        this.setState({ pointLoader: true })
        let responseData = await MiddlewareCheck("getTargetUserPoint", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = modPointData(responseData.response)
                this.setState({
                    userPoint: modData.activePoints
                })
            }
        }
        this.setState({ pointLoader: false })
    }

    getTotalPoint = () => {
        let totalPoints = 0;
        if (this.state.finalCartData.length > 0) {
            totalPoints = this.state.finalCartData.reduce((accumulator, current) => {
                return accumulator + current.amount;
            }, 0);
        }
        this.setState({ totalPoint: totalPoints })
    }

    getCartDetails = async () => {
        let reqData = {
            "limit": 100,
            "offset": "0",
            "catalogueId": this.state.itemData.catalogueId,
            "targetId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId,
            "groupTypeId": 1
        }
        let responseData = await MiddlewareCheck("getCatalogueCartByTargetId", reqData, this.props)

        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let modData = await modifyCartData(responseData.response, this.state.checkPan)
                this.setState({ finalCartData: modData.listData })
            }
        }
        this.setState({ pageLoader: false })
    }
    getCartCount = async () => {
        this.setState({ countLoader: true })
        let reqData = {
            "limit": 100,
            "offset": "0",
            "catalogueId": this.state.itemData.catalogueId,
            "targetId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId,
            "groupTypeId": 1
        }
        let responseData = await MiddlewareCheck("getCatalogueCartCountByTargetId", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.state.cartCount = responseData.response.total
            }
        }
        this.setState({ cartCount: this.state.cartCount, countLoader: false })

    }


    // for back action 
    _onBack = () => {
        this.props.navigation.goBack();
        // this.props.route.params.onLoad();
    };

    // for headersection design
    _onHeaderSec = () => {
        return (
            <View style={{ marginHorizontal: '5%', marginTop: 10 }}>
                <View style={{ marginTop: 8, flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => this._onBack()}>
                        <Image source={ImageName.BACK_IMG} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.LG, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, }}>Cart Detail</Text>
                    </View>
                </View>
            </View>
        )
    }

    ViewSkeletonPlaceholder = () => {
        let resData = [];
        for (let i = 0; i < 7; i++) {
            resData.push(
                <View style={[styles.mainBox, { marginVertical: 10, marginHorizontal: 12 }]} key={i}>
                    <View style={styles.blueBox} />
                </View>
            )
        }
        return resData;
    }

    getDeliveryAddress = async () => {
        let userData = await StorageDataModification.userCredential({}, "get")
        let reqData = {
            "refUserGroup": Object.keys(this.state.propData).length == 0 ? userData.loginType == "customer" ? 1 : 2 : 1,
            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
        }
        let responseData = await MiddlewareCheck("getAllDeliveryAddress", reqData, this.props)
        if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            if (responseData.response.length == 0) {
                this.setState({ addNewAddressCheck: true })
            } else {
                this.setState({ addNewAddressCheck: false })
            }
            let modAddress = modDeliveryAddress(responseData.response)
            this.setState({ deliveryAddress: modAddress, addressLoader: false })
        }
    }

    claimNow = async () => {

        this.setState({ isVisibleAddressModal: true, addressLoader: true })
        await this.getDeliveryAddress();
    }

    onRemoveItem = async (item, index) => {
        let arr = this.state.finalCartData;
        arr.splice(index, 1)
        this.setState({ finalCartData: arr })
        let reqData = {
            id: item.id
        }
        let responseData = await MiddlewareCheck("deleteCatalogueCartByTargetId", reqData, this.props)
        if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            Toaster.ShortCenterToaster(responseData.message)
            await this.getCartCount()
            await this.getTotalPoint()
        }
    }

    _onfooterSec = () => {
        return (
            <TouchableOpacity style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 30, alignItems: 'center', justifyContent: 'center', padding: 10, width: 150, alignSelf: 'center', position: 'absolute', bottom: 10 }} activeOpacity={0.9} onPress={() => this.claimNow()}>
                <Text style={{ fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, color: Color.COLOR.WHITE.PURE_WHITE }}>Claim Now</Text>
            </TouchableOpacity>
        )
    }

    addressModalSec = () => {
        const clearAddressData = () => {
            this.setState({ newAddress: "" })
        }

        const onRequestCloseModal = () => {
            this.setState({
                isVisibleAddressModal: false
            })
        }

        const onClickDefaultAddressCheck = () => {
            this.setState({ defaultAddressCheck: !this.state.defaultAddressCheck })
        }

        const onChangeAddress = (val) => {
            this.setState({ newAddress: val })
        }

        const onClickCheck = (item, key) => {
            let arr = this.state.deliveryAddress;
            for (let i = 0; i < arr.length; i++) {
                if (i == key) {
                    arr[i].check = true
                    arr[i].isDefault = "1"
                } else {
                    arr[i].check = false
                    arr[i].isDefault = "0"
                }
            }
            this.state.deliveryAddress = arr;
            this.state.selectedAddressObj = item
            this.setState(this.state)
        }

        const onAddAddress = async () => {
            let userData = await StorageDataModification.userCredential({}, "get")
            let reqData = {
                "refUserGroup": Object.keys(this.state.propData).length == 0 ? userData.loginType == "customer" ? 1 : 2 : 1,

                // "refUserGroup": userData.loginType == "customer" ? 1 : Object.keys(this.state.propData).length > 0 ? 2 : 1,
                "address": this.state.newAddress,
                "isDefault": this.state.defaultAddressCheck ? "1" : "0",
                "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
            }
            if (reqData.address.length == 0) {
                Toaster.ShortCenterToaster("Please enter Address !")
            } else {
                let responseData = await MiddlewareCheck("addDeliveryAddress", reqData, this.props)
                if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    clearAddressData()
                    await this.getDeliveryAddress()
                }
            }
        }

        const onAddNewAddressClick = () => {
            this.setState({ addNewAddressCheck: true })
        }

        const onClaimItem = async () => {
            let finalCartData = this.state.finalCartData;
            let reqData = {
                "forFinancialYearId": this.props.route.params.selectedFinancialYearObj.id,
                "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
                "totalPoint": this.state.totalPoint,
                "catalogueId": this.state.itemData.catalogueId,
            }
            let responseData = await MiddlewareCheck("getTdsForUser", reqData, this.props)
            if (responseData) {
                if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    if (this.state.totalPoint + responseData.response.tds > this.state.userPoint) {
                        Toaster.ShortCenterToaster("You don't have enough points to redeem !")
                    } else {
                        // if (responseData.response.tds > 0) {
                        //     let obj = {
                        //         "amount": responseData.response.tds,
                        //         "id": null,
                        //         "itemId": null,
                        //         "label": null,
                        //         "imagePath": null,
                        //         "tdsId": responseData.response.tdsId

                        //     }
                        //     finalCartData.unshift(obj)
                        // }
                        const objectWithCheckTrue = this.state.deliveryAddress.find(item => item.check === true);
                        this.setState({ claimLoader: true })
                        let reqData = {
                            "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                            "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                            "catalogueId": this.state.itemData.catalogueId,
                            "items": modCartDataForRequest(finalCartData, responseData.response.isPan),
                            "addressId": objectWithCheckTrue.id,
                            "forFinancialYearId": this.props.route.params.selectedFinancialYearObj.id,
                            "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId.toString(),
                            "refUserTypeId": Object.keys(this.state.propData).length > 0 ? this.state.propData.contactTypeId : this.state.userData.contactTypeId.toString()
                        }
                        let responseData_claim = await MiddlewareCheck("claimNow", reqData, this.props)

                        if (responseData_claim) {
                            if (responseData_claim.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                                Toaster.ShortCenterToaster(responseData_claim.message)
                                onRequestCloseModal()
                                this.props.navigation.goBack()
                            }
                        }
                    }
                }
            }



            // if (this.state.totalPoint > this.state.userPoint) {
            //     Toaster.ShortCenterToaster("You don't have enough points to redeem !")
            // } else {
            //     const objectWithCheckTrue = this.state.deliveryAddress.find(item => item.check === true);
            //     this.setState({ claimLoader: true })
            //     let reqData = {
            //         "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
            //         "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
            //         "catalogueId": this.state.itemData.catalogueId,
            //         "items": modCartDataForRequest(this.state.finalCartData),
            //         "addressId": objectWithCheckTrue.id,
            //         "forFinancialYearId": this.props.route.params.selectedFinancialYearObj.id,
            //         "refUserId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.userId
            //     }
            //     console.log("claim Now----", reqData)
            //     let responseData = await MiddlewareCheck("claimNow", reqData, this.props)
            //     if (responseData) {
            //         if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            //             Toaster.ShortCenterToaster(responseData.message)
            //             onRequestCloseModal()
            //             this.props.navigation.goBack()
            //         }
            //     }
            this.setState({ claimLoader: false })
            // }
        }
        return (
            <>
                <Modal
                    isVisible={this.state.isVisibleAddressModal}
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
                            <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.LG, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}> {this.state.addNewAddressCheck ? "Add" : "Select"} a delivery address</Text>
                                </View>
                                {this.state.addressLoader ?
                                    <ActivityIndicator color={Color.COLOR.BLUE.LOTUS_BLUE} />
                                    :
                                    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>

                                        {this.state.addNewAddressCheck ?
                                            <React.Fragment>
                                                <TextInputBox
                                                    value={this.state.newAddress}
                                                    onChangeText={(value) => onChangeAddress(value)}
                                                    keyboardType={"default"}
                                                    placeholder={"Address"}
                                                    placeholderTextColor={"#5F5F5F"}
                                                    height={85}
                                                    borderRadius={15}
                                                    alignItems="flex-start"
                                                    multiline={true}
                                                    additionalBoxStyle={{ borderColor: "#273441", borderWidth: 0.5, backgroundColor: "#fff" }}
                                                />
                                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                                                    <CheckBox
                                                        type={"tick"}
                                                        borderRadius={5}
                                                        borderColor={"#0B4F6C"}
                                                        backgroundColor={"#fff"}
                                                        selectBackgroundColor={"#0B4F6C"}
                                                        data={this.state.defaultAddressCheck}
                                                        onClickValue={() => onClickDefaultAddressCheck()}
                                                    />
                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM_ITALIC, fontSize: 12, marginLeft: 5 }}>Default Address</Text>

                                                </View>

                                                <TouchableOpacity onPress={() => onAddAddress()} style={{ marginTop: 15, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "red", alignSelf: "center" }}>
                                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Add Address</Text>
                                                </TouchableOpacity>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <View style={{ height: 150, }}>

                                                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                                                        {this.state.deliveryAddress.map((item, key) => (
                                                            <TouchableOpacity onPress={() => onClickCheck(item, key)} style={{ flexDirection: "row", marginTop: 10, borderWidth: 0.5, borderColor: item.check ? Color.COLOR.RED.AMARANTH : Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, alignItems: "center" }} key={key}>
                                                                <CheckBox
                                                                    type={"check"}
                                                                    borderRadius={35}
                                                                    borderColor={"#0B4F6C"}
                                                                    backgroundColor={"#fff"}
                                                                    selectBackgroundColor={"#0B4F6C"}
                                                                    data={item.check}
                                                                    onClickValue={() => onClickCheck(item, key)}
                                                                />
                                                                <Text style={{ color: item.check ? Color.COLOR.RED.AMARANTH : Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 12, marginLeft: 10, marginRight: 10 }}>{item.address}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>


                                                </View>
                                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: 16, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM_ITALIC, textAlign: "center", paddingTop: 10 }}>Or</Text>
                                                <TouchableOpacity onPress={() => onAddNewAddressClick()} disabled={this.state.claimLoader} style={{ marginTop: 10 }}>
                                                    {/* <TouchableOpacity > */}
                                                    <View style={{ borderRadius: 10, borderWidth: 1, borderColor: Color.COLOR.RED.AMARANTH, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, paddingVertical: 8, backgroundColor: Color.COLOR.WHITE.PURE_WHITE }}>
                                                        {this.state.claimLoader ?
                                                            <ActivityIndicator size={"small"} color={"#fff"} />
                                                            :
                                                            <Text style={{ color: Color.COLOR.RED.AMARANTH, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 16 }}>Add New Address</Text>
                                                        }
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => onClaimItem()} disabled={this.state.claimLoader} style={{ marginTop: 20 }}>
                                                    {/* <TouchableOpacity > */}
                                                    <View style={{ borderRadius: 20, borderWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, paddingVertical: 8, backgroundColor: Color.COLOR.RED.AMARANTH }}>
                                                        {this.state.claimLoader ?
                                                            <ActivityIndicator size={"small"} color={"#fff"} />
                                                            :
                                                            <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 16 }}>Claim Now</Text>
                                                        }
                                                    </View>
                                                </TouchableOpacity>
                                            </React.Fragment>
                                        }


                                    </View>
                                }

                            </View>
                        </ View>
                    }
                />
            </>
        )
    }

    onClickCreditNoteCheck = (item, key) => {
        this.state.finalCartData[key].check = !this.state.finalCartData[key].check
        // let arr = this.state.finalCartData;
        // for (let i = 0; i < arr.length; i++) {
        //     if (i == key) {
        //         arr[i].check = true
        //         arr[i].isDefault = "1"
        //     } else {
        //         arr[i].check = false
        //         arr[i].isDefault = "0"
        //     }
        // }
        // this.state.deliveryAddress = arr;
        // this.state.selectedAddressObj = item
        this.setState({ finalCartData: this.state.finalCartData })
    }

    render() {

        return (
            <SafeAreaView style={styles.container}>
                {this._onHeaderSec()}
                {/* {this.state.pageLoader ?
                    <SkeletonPlaceholder>
                        {this.ViewSkeletonPlaceholder()}
                    </SkeletonPlaceholder> : */}
                <React.Fragment>
                    {/* {this.state.profileData.cartCount > 0 ? */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ minHeight: 500 }}
                        nestedScrollEnabled={true}>

                        <View style={{ flex: 1, borderColor: "#FFD4D8", borderWidth: 1, marginHorizontal: 20, borderRadius: 20, marginTop: 10, }}>
                            <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#FFD4D8", borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row' }}>
                                <View style={{ flex: 0.6 }}>
                                    <Text style={{ fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: "#AD3636" }}>Total Items</Text>
                                    <Text style={{ fontSize: 12, fontFamily: FontFamily.FONTS.POPPINS.REGULAR, color: "#634E50" }}>{this.state.cartCount + " Items"}</Text>
                                </View>
                                <View style={{ flex: 0.4, justifyContent: "center", alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 13, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, color: Color.COLOR.BLUE.LOTUS_BLUE }}>{"Total Point : " + this.state.totalPoint}</Text>
                                </View>
                            </TouchableOpacity>
                            {this.state.pageLoader ? <View style={{ height: 200, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator />
                            </View>
                                : <React.Fragment>
                                    {this.state.finalCartData.length > 0 ?
                                        <React.Fragment>
                                            {this.state.finalCartData.map((item, key) => (
                                                <View key={key}>
                                                    <View style={{ paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#F0F4F7", marginTop: 5, marginHorizontal: 1, borderRadius: 20, marginHorizontal: 10 }} >
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, flex: 1 }}>{item.label}</Text>
                                                            <TouchableOpacity onPress={() => this.onRemoveItem(item, key)}>
                                                                <Image source={ImageName.GRAY_CIRCEL_CANCEL_LOGO} style={{ height: 26, width: 26, resizeMode: 'contain' }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                                                            <View style={{ flex: 1, }}>
                                                                {/* <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}> {item.quantity + " " + item.unitShort}</Text> */}
                                                                {/* <ImagePreview width={60} height={60} fileName={item.imagePath} additionalStyles={{ borderRadius: 15 }} /> */}
                                                                <Image source={{ uri: item.imagePath }} style={{ height: 60, width: 60, resizeMode: "contain", borderRadius: 15 }} />
                                                            </View>
                                                            <View>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, top: 8, }}>  {"Points" + " " + item.amount}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: "flex-start", flexDirection: "row", marginTop: 20 }}>
                                                            <CheckBox
                                                                type={"tick"}
                                                                borderRadius={5}
                                                                borderColor={"#0B4F6C"}
                                                                backgroundColor={"#fff"}
                                                                selectBackgroundColor={"#0B4F6C"}
                                                                data={item.check}
                                                                onClickValue={() => this.onClickCreditNoteCheck(item, key)}
                                                            />
                                                            <View>
                                                                <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>  {"Credit Note"}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginBottom: 8 }} />
                                                </View>
                                            ))}
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <View style={{ marginTop: 20, height: Dimension.height }}>
                                                <NoDataFound />
                                            </View>
                                        </React.Fragment>
                                    }
                                </React.Fragment>}


                            <View style={{ marginBottom: 8 }} />
                        </View>

                    </ScrollView>
                    {/* :
                            <React.Fragment>
                                <View style={{ marginTop: 20, height: Dimension.height }}>
                                    <NoDataFound />
                                </View>
                            </React.Fragment>
                        } */}
                </React.Fragment>
                {this.state.finalCartData.length > 0 ? this._onfooterSec() : null}
                {/* } */}
                {this.addressModalSec()}
            </SafeAreaView>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderCartDetails);
// export default OrderCartDetails;
