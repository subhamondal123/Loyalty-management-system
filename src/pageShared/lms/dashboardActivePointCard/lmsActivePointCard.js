// import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Color, FontFamily, FontSize, ImageName } from '../../../enums';
import { Image } from 'react-native';
import SvgComponent from '../../../assets/svg';
import { PropTypes } from 'prop-types';
import { MiddlewareCheck } from "../../../services/middleware";
import { ErrorCode } from "../../../services/constant";

function LmsActivePointCard({
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
        Animated.spring(
            scaleAnim,
            {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            }
        ).start();
        getUserPoints()
    }, []);

    const [scaleAnim] = useState(new Animated.Value(0))  // Initial value for scale: 0

    const [isLoading, setIsLoading] = useState(true)
    const [earnings, setEarnings] = useState("0")
    const [reedemPoints, setRedeemPoints] = useState("0")

    const getUserPoints = async () => {
        let responseData = await MiddlewareCheck("getUserPoints", {}, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                setEarnings(Object.keys(responseData.response).length > 0 ? responseData.response.newEarn : 0)
                setRedeemPoints(Object.keys(responseData.response).length > 0 ? responseData.response.redemption : 0)
            }
        }
        setIsLoading(false)
    }

    return (
        <Animated.View                 // Special animatable View
            style={{
                transform: [{ scale: scaleAnim }]
            }}
        >
            <View style={{
                marginTop: 20, flex: 1, marginHorizontal: "5%", borderRadius: 10, backgroundColor: '#F0F4F7',
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 2,
            }} >
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
                            <Text style={{ fontSize: FontSize.LG, marginRight: 30, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.LIGHT }}>{earnings}</Text>
                            <SvgComponent svgName={"greenDownArrow"} height={10} width={10} strokeColor={"#13D298"} />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 0.3, alignItems: 'center' }}>
                            <Text style={{ fontSize: FontSize.LG, marginRight: 30, color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.LIGHT }}>{reedemPoints}</Text>
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
            </View>
        </Animated.View>

    )
}

LmsActivePointCard.defaultProps = {
    isHidden: false,
    data: {},
    onPress: () => { }
};

LmsActivePointCard.propTypes = {
    isHidden: PropTypes.bool,
    data: PropTypes.instanceOf(Object),
    onPress: PropTypes.func
};

export default LmsActivePointCard;

