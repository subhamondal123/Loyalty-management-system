import React, { Component } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import styles from './Style'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums'
import { ActivePointAndLocationSelectionTab, CatalogueItem, ConfirmsalesSuccessfulModal, GiftClaimModal, ProfileSec } from '../../pageShared'
import Header from './../header/Header'
import SvgComponent from '../../assets/svg'
import { MiddlewareCheck, StoreUserOtherInformations } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import { modDeliveryAddress, modifyDetailsData, modifySuggestedItemData } from './Function'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { StorageDataModification, Toaster } from '../../services/common-view-function'
import { CheckBox, Modal, TextInputBox } from '../../shared'

const deliveryAddressArr = [
    {
        "address": "S-45,Behala,Bhupen Roy Road,kolkata,700034,W.B",
        "isDefault": 1,
        "check": true
    },
    {
        "address": "S-42,Joka,Bipin Roy Road,kolkata,700104,W.B",
        "isDefault": 0,
        "check": false
    }
]

class CatalogueItemDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            detailsObj: {},
            pageLoader: false,
            userData: {},
            sugesstedItemsArr: [],
            claimGiftsArr: [],
            // deliveryAddress: deliveryAddressArr,
            addressLoader: false,
            defaultAddressCheck: true,
            addNewAddressCheck: false,
            deliveryAddress: [],
            selectedAddressObj: {},
            newAddress: "",
            itemData: this.props.route.params.data,
            isVisibleClaimItem: false,
            claimLoader: false,
            isVisibleAddressModal: false,
            cartData: {
                count: 0
            },
            cartLoader: false,
            countLoader: false,
            activePoint: 0,
            propData: this.props.route.params.propData ? this.props.route.params.propData : {}
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                this.load();
            })
    }

    load = async () => {
        let activePointData = await StorageDataModification.activePointData({}, "get");
        let userInfo = await StorageDataModification.userCredential({}, "get")
        this.setState({ activePoint: activePointData, userData: userInfo })
        await this.getCartCount();
        await this.getSuggestedItems("lt")
        await this.getClaimedItems("gt")
        StoreUserOtherInformations("", {}, this.props);
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
        if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            this.state.cartData.count = responseData.response.total
        }
        this.setState({ countLoader: false })

    }

    getSuggestedItems = async (type) => {
        let reqData = {
            "catalogueId": this.state.itemData.catalogueId,
            "redeemPoints": this.state.itemData.amount,
            "itemId": this.state.itemData.id,
            "limit": 10,
            "offset": "0",
            "type": type
        }
        this.setState({ pageLoader: true })
        let responseData = await MiddlewareCheck("suggestionFromCatalogue", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ sugesstedItemsArr: modifySuggestedItemData(responseData.response) })
            }
        }
        this.setState({ pageLoader: false })

    }

    getClaimedItems = async (type) => {
        let reqData = {
            "catalogueId": this.state.itemData.catalogueId,
            "redeemPoints": this.state.itemData.amount,
            "itemId": this.state.itemData.id,
            "limit": 10,
            "offset": "0",
            "type": type
        }
        this.setState({ pageLoader: true })
        let responseData = await MiddlewareCheck("suggestionFromCatalogue", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ claimGiftsArr: modifySuggestedItemData(responseData.response) })
            }
        }
        this.setState({ pageLoader: false })
    }

    productItemImageSec = () => {
        return (
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <View>
                    <Image source={{ uri: this.state.itemData.src }} style={{ height: 325, resizeMode: "contain", borderRadius: 20 }} />
                </View>
            </View>
        )
    }
    productItemDescriptionSec = () => {
        return (
            <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                <Text style={{ color: "#172834", fontSize: FontSize.MD, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, }}>{this.state.itemData.label}</Text>
            </View>
        )
    }

    getDeliveryAddress = async () => {
        let reqData = {
            "refUserGroup": this.props.Sales360Redux.loginData.loginType == "customer" ? 1 : 2,
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

    onAddToCart = async () => {
        // this.setState({ isVisibleAddressModal: true, addressLoader: true })
        // await this.getDeliveryAddress()
        this.setState({ cartLoader: true })
        let reqData = {
            targetId: Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.customerId,
            groupTypeId: 1, //for customer/2 for employee
            cart: [{
                catalogueId: this.state.itemData.catalogueId,
                categoryId: this.state.itemData.categoryId,
                groupId: this.state.itemData.groupId,
                itemId: this.state.itemData.id,
            }]
        }
        let responseData = await MiddlewareCheck("addCatalogueCart", reqData, this.props)
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                Toaster.ShortCenterToaster(responseData.message)
                this.getCartCount()
            }
        }
        this.setState({ cartLoader: false })
    }

    getCartDetails = async () => {
        let reqData = {
            "limit": 100,
            "offset": "0",
            "catalogueId": this.state.itemData.catalogueId,
            "targetId": Object.keys(this.state.propData).length > 0 ? this.state.propData.id : this.state.userData.userId,
            "groupTypeId": 1
        }
        let responseData = await MiddlewareCheck("getCatalogueCartByTargetId", reqData, this.props)

    }

    pointClaimSec = () => {
        // const onClaim = async () => {
        //     this.setState({ isVisibleAddressModal: true, addressLoader: true })
        //     await this.getDeliveryAddress()
        // }
        return (
            <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SvgComponent svgName={"nineDot"} strokeColor={"#F13748"} height={16} width={16} />
                        <Text style={{ color: "#172834", fontSize: 30, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, marginLeft: 10 }}>{this.state.itemData.amount}</Text>
                        <Image source={ImageName.YELLOW_STAR} style={{ height: 18, width: 18, resizeMode: "contain", marginLeft: 10 }} />
                    </View>
                    <View style={{ flex: 1 }} />
                    {(this.props.route.params.dataFrom == "RequestRedemtionCategory") ?
                        <TouchableOpacity onPress={() => this.onAddToCart()} >
                            <View style={{ borderRadius: 20, borderWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, paddingVertical: 8, backgroundColor: Color.COLOR.RED.AMARANTH }}>
                                {this.state.cartLoader ?
                                    <ActivityIndicator size={"small"} color={"#fff"} />
                                    :
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 16 }}>Add to Cart</Text>
                                }
                            </View>
                        </TouchableOpacity>
                        : null}
                </View>
                {/* <View>
                    <View style={{ marginTop: 5, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, paddingVertical: 3, alignSelf: "flex-start", borderColor: "#817D7A" }}>
                        <Text style={{ color: "#817D7A", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12 }}>Remain points after claim :
                            <Text style={{ color: "#00AB1B", fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 12 }}> 200</Text>
                        </Text>

                    </View>
                </View> */}
            </View>
        )
    }


    skelitonPlaceHolder = () => {
        return (
            <SkeletonPlaceholder>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                    <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                    <View style={{ height: 140, width: Dimension.width / 3 - 15, borderRadius: 20, marginRight: 10 }} />
                </View>
            </SkeletonPlaceholder>
        )
    }

    suggestedProductSec = () => {
        const onViewOffers = () => {
            this.props.navigation.navigate("CatalogueSchemes")
        }
        const onSelectItem = (item) => {
            let propItem = Object.assign(item, { catalogueId: this.state.itemData.catalogueId })
            this.props.navigation.navigate("GlobalCatalogueItemDetails", { data: propItem, propData: {} })

        }
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "#fff" }}>
                <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
                    <View>
                        <Text style={{ color: "#000", fontSize: 16, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, marginLeft: 5 }}>Suggested for You</Text>
                    </View>
                </View>
                {this.state.pageLoader ? this.skelitonPlaceHolder()
                    :
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        {this.state.sugesstedItemsArr.map((item, key) => (
                            <View style={{ marginHorizontal: 5, borderRadius: 20 }} key={key}>
                                <CatalogueItem data={item} onPress={() => onSelectItem(item)} />
                            </View>
                        ))}
                    </ScrollView>
                }

            </View>

        )
    }

    earnMoreProductSec = () => {
        const onSelectItem = (item) => {
            let propItem = Object.assign(item, { catalogueId: this.state.itemData.catalogueId })
            this.props.navigation.navigate("GlobalCatalogueItemDetails", { data: propItem, propData: {} })

        }
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "#fff" }}>
                <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: "#000", fontSize: 16, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, marginLeft: 5 }}>Earn more Points {"\n"}and claim better gift</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
                {this.state.pageLoader ? this.skelitonPlaceHolder()
                    :
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        {this.state.claimGiftsArr.map((item, key) => (
                            <View style={{ marginHorizontal: 5, borderRadius: 20 }} key={key}>
                                <CatalogueItem data={item} onPress={() => onSelectItem(item)} />
                            </View>
                        ))}
                    </ScrollView>
                }
            </View>
        )
    }

    onNotification = () => {
    }

    modalSec = () => {

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
            let reqData = {
                "refUserGroup": this.props.Sales360Redux.loginData.loginType == "customer" ? 1 : 2,
                "address": this.state.newAddress,
                "isDefault": this.state.defaultAddressCheck ? "1" : "0",
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
            const objectWithCheckTrue = this.state.deliveryAddress.find(item => item.check === true);

            this.setState({ claimLoader: true })
            let reqData = {
                "locationId": this.props.Sales360Redux.routeData.hierarchyDataId,
                "locationTypeId": this.props.Sales360Redux.routeData.hierarchyTypeId,
                "point": this.state.itemData.amount,
                "catalogueId": this.state.itemData.catalogueId,
                "itemId": this.state.itemData.id,
                "addressId": objectWithCheckTrue.id
            }
            let responseData = await MiddlewareCheck("claimNow", reqData, this.props)
            if (responseData) {
                if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    Toaster.ShortCenterToaster(responseData.message)
                    onRequestCloseModal()
                    this.props.navigation.goBack()
                }
            }
            this.setState({ claimLoader: false })
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

    _onBack = () => {
        this.props.navigation.goBack();
    }

    // for navigation to cart
    onCart = () => {
        this.props.navigation.replace("OrderCartDetails", { propData: this.props.route.params.propData, data: this.props.route.params.data, cartData: this.state.cartData,selectedFinancialYearObj:this.props.route.params.selectedFinancialYearObj })
    }


    //header section
    headerSec = () => {
        return (
            <View style={styles.headerSec}>
                <TouchableOpacity style={{ flex: 0.1 }} activeOpacity={0.9} onPress={() => this._onBack()}>
                    <Image source={ImageName.BACK_IMG} style={styles.backImg} />
                </TouchableOpacity>
                <View style={styles.profileTab}>
                    <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={styles.titleTxt} numberOfLines={1}>Item Details</Text>
                    </View>
                </View>
                {/* <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <TouchableOpacity activeOpacity={0.9} >
                        <Image source={ImageName.SEARCH_LOGO_WITH_BLUE_BORDER} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <TouchableOpacity activeOpacity={0.9} >
                        <Image source={ImageName.FILTER_WITH_BLUE_BORDER} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View> */}
                {/* <View style={{flex:1}}/> */}
                {(this.props.route.params.dataFrom == "RequestRedemtionCategory") ?
                    <TouchableOpacity activeOpacity={0.9} style={styles.cardTab} onPress={() => this.onCart()}>
                        <View>
                            <Image source={ImageName.SHOPING_ORDER_BOX} style={styles.shoppingImg} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View>
                            <Text style={styles.cartCountTxt}>{this.state.cartData.count}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    null}
            </View>
        )
    };

    productItemTitleSec = () => {
        return (
            <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                <Text style={{ color: "#172834", fontSize: FontSize.LG, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, }}>{this.state.itemData.label}</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {/* <GiftClaimModal isVisible={this.state.isVisibleClaimItem} onCloseModal={() => this.setState({ isVisibleClaimItem: false })} />
                <Header {...this.props} onRefresh={() => console.log("")} onApplyFilter={() => console.log("")} onResetFilter={() => console.log("")} onPressNotification={() => this.onNotification()} /> */}
                {this.headerSec()}
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <ActivePointAndLocationSelectionTab {...this.props} isVisibleLocation={false} />
                    {this.productItemTitleSec()}
                    {this.productItemImageSec()}
                    {this.productItemDescriptionSec()}
                    {this.pointClaimSec()}
                    {/* {this.state.sugesstedItemsArr.length > 0 ? this.suggestedProductSec() : null}
                    {this.state.claimGiftsArr.length > 0 ? this.earnMoreProductSec() : null} */}
                    <View style={{ height: 50 }} />
                </ScrollView>
                {this.modalSec()}
            </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueItemDetails);