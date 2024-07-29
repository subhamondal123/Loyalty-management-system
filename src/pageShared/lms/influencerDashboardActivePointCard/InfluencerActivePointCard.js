// import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Color, FontFamily, FontSize, ImageName } from '../../../enums';
import { Image } from 'react-native';
import SvgComponent from '../../../assets/svg';
import { PropTypes } from 'prop-types';
import { MiddlewareCheck } from "../../../services/middleware";
import { ErrorCode } from "../../../services/constant";

function InfluencerActivePointCard({
    data,
    props,
    onPress,
    isHidden,
}) {
    if (isHidden) return null;

    const onSelect = () => {
        onPress()
    }


    useEffect(() => {
        getUserPoints()
    }, []);

    const [earnings, setEarnings] = useState("0")
    const [reedemPoints, setRedeemPoints] = useState("0")

    const getUserPoints = async () => {
        let reqData = {
            refUserId: props.route.params.propData.id.toString()
        }
        let responseData = await MiddlewareCheck("getUserPoints", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                setEarnings(Object.keys(responseData.response).length > 0 ? responseData.response.newEarn : 0)
                setRedeemPoints(Object.keys(responseData.response).length > 0 ? responseData.response.redemption : 0)
            }
        }
    }

    return (
        <TouchableOpacity style={{
            marginTop: 20, flex: 1, marginHorizontal: "5%", borderRadius: 10, backgroundColor: '#F0F4F7',
            shadowColor: '#000',
            shadowOffset: { width: 1, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 2,
        }} onPress={() => onSelect()}>
            <View style={{ flexDirection: 'row', padding: 10, marginHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: FontSize.XXXL, fontFamily: FontFamily.FONTS.POPPINS.LIGHT, color: Color.COLOR.BLACK.PURE_BLACK }}>{Object.keys(data).length > 0 ? data.achieved[1].y : 0}</Text>
                    <Text style={{ fontFamily: FontFamily.FONTS.POPPINS.LIGHT, color: "#747C90", fontSize: 14 }}>Your Total Active Points</Text>
                </View>
                <View >
                    <Image source={ImageName.ILLUSTRATION} style={{ height: 90, width: 90, resizeMode: "contain" }} />
                </View>
            </View>
            <View style={{ marginHorizontal: '5%', padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', flex: 0.6, alignItems: 'center' }}>
                        <Text style={{ fontSize: FontSize.LG, marginRight: 30, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.LIGHT }}>{earnings == null || earnings == undefined ? 0 : earnings}</Text>
                        <SvgComponent svgName={"greenDownArrow"} height={10} width={10} strokeColor={"#13D298"} />
                    </View>
                    <View style={{ flexDirection: 'row', flex: 0.3, alignItems: 'center' }}>
                        <Text style={{ fontSize: FontSize.LG, marginRight: 30, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.LIGHT }}>{reedemPoints == null || reedemPoints == undefined ? 0 : reedemPoints}</Text>
                        <SvgComponent svgName={"redUpArrow"} height={10} width={10} strokeColor={"#FF2E00"} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.8 }}>
                        <Text style={{ fontFamily: FontFamily.FONTS.POPPINS.LIGHT, color: "#747C90", fontSize: 14 }}>New Earn</Text>
                    </View>
                    <View>
                        <Text style={{ fontFamily: FontFamily.FONTS.POPPINS.LIGHT, color: "#747C90", fontSize: 14 }}>Redemption</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    )
}

InfluencerActivePointCard.defaultProps = {
    isHidden: false,
    data: {},
    onPress: () => { }
};

InfluencerActivePointCard.propTypes = {
    isHidden: PropTypes.bool,
    data: PropTypes.instanceOf(Object),
    onPress: PropTypes.func
};

export default InfluencerActivePointCard;

