import React, { Component } from 'react'
import { Color, FontFamily, ImageName } from '../../../enums'
import SvgComponent from '../../../assets/svg'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import LmsLocationMapping from '../lmsLocationMapping'
import { MiddlewareCheck } from '../../../services/middleware'
import { ErrorCode } from '../../../services/constant'
import { modPassbookData } from './function'
import { Modal } from '../../../shared'
import styles from './styles'

export default class ActivePointAndLocationSelectionTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chartData: {},
            borderColor: "",
            activeLoader: false,
            userId: "",
            locationObj: this.props.Sales360Redux.loginData.lastLevelLocations ? this.props.Sales360Redux.loginData.lastLevelLocations : {},

            recentLiftingData: [],
            recentLoader: false,
            pageNum: 0,
            limit: 5,
            isApiCall: true,
            listLoader: true,
            passbookArr: [],
            isVisibleModal: false
        }
    }
    onSelectLocationData = (val) => {
        this.props.selectedLocation(val.value)
    }

    componentDidMount = async () => {
        this.setState({
            userId: this.props.route.params.propData ? this.props.route.params.propData.id : null
        })
        this._unsubscribe = this.props.navigation.addListener(
            'focus', async () => {
                this.setState({
                    borderColor: this.props.screen == undefined || this.props.screen == null ? "#839CAE" : this.props.screen == "profile" ? "fff" : "fff",
                })
                await this.getChartData()
                // await this.getLiftingHistory()
            })

    }
    getChartData = async () => {
        this.setState({ activeLoader: false })
        let reqData = {
            // "refUserId": this.props.route.params ? this.props.route.params.propData ? this.props.route.params.propData : null : null
            "refUserId": this.props.route.params.propData ? this.props.route.params.propData.id : null
        }
        let responseData = await MiddlewareCheck("dashboardChart", reqData, this.props)

        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ chartData: responseData.response })
            }
        }
        this.setState({ activeLoader: false })
    }

    getLiftingHistory = async () => {
        let reqData = {
            "limit": 150,
            "offset": "0",
            "refUserId": this.props.route.params.propData ? this.props.route.params.propData.id : null,
            "fromDate": "2023-01-01",
            "toDate": "2028-12-01"
        }
        let responseData = await MiddlewareCheck("getPassbookList", reqData, this.props)
        if (responseData) {
            if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let passbookData = modPassbookData(responseData.response)
                this.setState({ passbookArr: passbookData })
            }
        }

    }

    onOpenModal = (type) => {
        this.setState({ isVisibleModal: type })
    }


    modalSec = () => {
        return (
            <>
                {this.state.isVisibleModal ?
                    <>
                        <Modal
                            isVisible={this.state.isVisibleModal}
                            onRequestClose={() => this.onOpenModal(false)}
                            onBackdropPress={() => this.onOpenModal(false)}
                            onBackButtonPress={() => this.onOpenModal(false)}
                            children={
                                <View style={styles.modalview}>
                                    <View style={styles.modalHeaderSec}>
                                        <TouchableOpacity
                                            style={styles.crossImgSec}
                                            onPress={() => this.onOpenModal(false)}
                                            activeOpacity={0.9}>
                                            <Image source={ImageName.CROSS_IMG} style={styles.redCrossImg} />
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={{ fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 14, color: Color.COLOR.WHITE.PURE_WHITE }}>Details</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 15, marginBottom: 20, maxHeight: 500 }}>
                                        <ScrollView>
                                            {this.state.passbookArr.length > 0 ?
                                                <>
                                                    {this.state.passbookArr.map((item, key) => (
                                                        <View key={key}>
                                                            <View style={{ marginHorizontal: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 5, alignItems: "flex-start", flexDirection: "row", borderWidth: 1, borderColor: Color.COLOR.BLUE.LOTUS_BLUE, borderRadius: 10 }}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{ color: Color.COLOR.GRAY.GRAY_TINTS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 12, textDecorationLine: 'underline' }}>Lifted From</Text>
                                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: 11 }}>{item.liftFrom}</Text>
                                                                    <Text style={{ color: Color.COLOR.GRAY.DAVY_GRAY, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 11 }}>{item.liftFromType}</Text>
                                                                </View>
                                                                <View style={{}}>
                                                                    <Text style={{ color: Color.COLOR.GRAY.GRAY_TINTS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: 12, textAlign: "right", textDecorationLine: 'underline' }}>Points</Text>
                                                                    <Text style={{ color: Color.COLOR.RED.AMARANTH, fontFamily: FontFamily.FONTS.POPPINS.BOLD, fontSize: 11, textAlign: "right" }}>{item.point}</Text>
                                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 11 }}>Date : {item.createdAt}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </>
                                                :
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD, fontSize: 12 }}>No Liftings Marked till date !</Text>
                                                </View>
                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                            }
                        />
                    </>
                    :
                    null
                }
            </>
        )
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 10 }}>
                    {this.state.activeLoader ? null :
                        <>
                            <View style={{ flexDirection: "row", flex: 1 }}>
                                {this.props.isVisibleActivePoint == undefined || this.props.isVisibleActivePoint == null || this.props.isVisibleActivePoint == true ?
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() => this.onOpenModal(true)}
                                            style={{ borderWidth: 1, borderRadius: 30, borderColor: this.state.borderColor, alignSelf: "flex-start", flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#fff", alignItems: "center" }}>
                                            <SvgComponent svgName={"nineDot"} strokeColor={"#F13748"} height={11} width={11} />
                                            <Text style={{ color: "#817D7A", fontSize: 14, fontFamily: FontFamily.FONTS.INTER.BOLD, marginLeft: 5 }}>Point : </Text>
                                            <Text style={{ color: "#F13748", fontSize: 14, fontFamily: FontFamily.FONTS.INTER.BOLD, marginLeft: 5 }}>{Object.keys(this.state.chartData).length > 0 ? this.state.chartData.achieved[1].y : 0}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : null}

                                <View style={{ flex: 1 }} >
                                    {this.props.isVisibleLocation == undefined || this.props.isVisibleLocation == null ?
                                        <View>
                                            <LmsLocationMapping
                                                editData
                                                type={"lastHierarcyField"}
                                                isLabelVisible={false}
                                                onApiCallData={(value) => this.onSelectLocationData(value)} />

                                        </View>
                                        :
                                        this.props.isVisibleLocation ?
                                            <View>
                                                <LmsLocationMapping
                                                    editData
                                                    type={"lastHierarcyField"}
                                                    isLabelVisible={false}
                                                    onApiCallData={(value) => this.onSelectLocationData(value)} />

                                            </View>
                                            :
                                            null
                                    }
                                </View>
                            </View>
                        </>
                    }
                </View>
                {this.modalSec()}
            </View>
        )
    }
}
