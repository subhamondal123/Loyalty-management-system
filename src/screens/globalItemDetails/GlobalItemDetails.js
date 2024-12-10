import React, { Component } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import styles from './Style'
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums'
import { ActivePointAndLocationSelectionTab, CatalogueItem, ConfirmsalesSuccessfulModal, GiftClaimModal, ProfileSec } from '../../pageShared'
import Header from './../header/Header'
import SvgComponent from '../../assets/svg'
import { MiddlewareCheck } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";
import { Toaster } from '../../services/common-view-function'
import { CheckBox, Modal, TextInputBox } from '../../shared'
import { modDeliveryAddress } from './Function'



class GlobalItemDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            detailsObj: {},
            pageLoader: false,
            sugesstedItemsArr: [],
            claimGiftsArr: [],
            addressLoader: false,
            defaultAddressCheck: true,
            addNewAddressCheck: false,
            deliveryAddress: [],
            selectedAddressObj: {},
            newAddress: "",
            itemData: this.props.route.params.data,
            isVisibleClaimItem: false,
            claimLoader: false,
            propData: this.props.route.params.propData,
            isVisibleAddressModal: false
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                this.load();
            })
    }

    load = async () => {

    }


    productItemImageSec = () => {
        return (
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <View>
                    <Image source={{ uri: this.state.itemData.image }} style={{ height: 325, resizeMode: "contain", borderRadius: 20 }} />
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
        // {:
        let reqData = {
            "refUserGroup": Object.keys(this.state.propData).length == 0 ? this.props.Sales360Redux.loginData.loginType == "customer" ? 1 : 2 : 1,
            "refUserId": Object.keys(this.state.propData).length == 0 ? null : this.state.propData.id.toString()
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

    pointClaimSec = () => {

        const onClaim = async () => {
            this.setState({ isVisibleAddressModal: true, addressLoader: true })
            await this.getDeliveryAddress()
        }
        return (
            <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SvgComponent svgName={"nineDot"} strokeColor={"#F13748"} height={16} width={16} />
                        <Text style={{ color: "#172834", fontSize: 30, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, marginLeft: 10 }}>{this.state.itemData.amount}</Text>
                        <Image source={ImageName.YELLOW_STAR} style={{ height: 18, width: 18, resizeMode: "contain", marginLeft: 10 }} />
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => onClaim()} disabled={this.state.claimLoader}>
                        {/* <TouchableOpacity > */}
                        <View style={{ borderRadius: 20, borderWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, paddingVertical: 8, backgroundColor: Color.COLOR.RED.AMARANTH }}>
                            {this.state.claimLoader ?
                                <ActivityIndicator size={"small"} color={"#fff"} />
                                :
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD, fontSize: 16 }}>Claim Now</Text>
                            }
                        </View>
                    </TouchableOpacity>
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
                "refUserId": Object.keys(this.state.propData).length == 0 ? null : this.state.propData.id.toString(),
                "refUserGroup": Object.keys(this.state.propData).length == 0 ? this.props.Sales360Redux.loginData.loginType == "customer" ? 1 : 2 : 1,
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
                "refUserId": Object.keys(this.state.propData).length == 0 ? null : this.state.propData.id.toString(),
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


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <GiftClaimModal isVisible={this.state.isVisibleClaimItem} onCloseModal={() => this.setState({ isVisibleClaimItem: false })} />
                <Header {...this.props} onRefresh={() => console.log("")} onApplyFilter={() => console.log("")} onResetFilter={() => console.log("")} onPressNotification={() => this.onNotification()} />
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    {Object.keys(this.state.propData).length == 0 ? null :
                        <ProfileSec props={this.props} />
                    }

                    {this.productItemImageSec()}
                    {this.productItemDescriptionSec()}
                    {this.pointClaimSec()}

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

export default connect(mapStateToProps, mapDispatchToProps)(GlobalItemDetails);