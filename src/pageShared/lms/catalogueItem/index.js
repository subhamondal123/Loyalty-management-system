import React, { useState } from 'react'
import styles from "./style";
import { PropTypes } from 'prop-types';
import { Animated, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { Dimension, ImageName } from '../../../enums';
import SvgComponent from '../../../assets/svg';

function CatalogueItem({
    props,
    data,
    onPressTab,
    backgroundColor,
    borderRadius,
    additionStyles,
    isHidden,
    width,
    onPress,
    scrollY,
    index
}) {

    if (isHidden) return null;

    const onClickTab = (data) => {
        onPress(data)
    }

    // const height = Dimension.height

    // if (scrollY == undefined || scrollY == null) {

    // } else {
        // const inputRange = [
        //     -1,
        //     0,
        //     (height * 0.1 + 5) * index,
        //     (height * 0.1 + 5) * (index + 9),
        // ];
        // const scale = 1;
        // const opacity = scrollY.interpolate({
        //     inputRange,
        //     outputRange: [1, 1, 1, 0],
        // });
        // const Offset = scrollY.interpolate({
        //     inputRange,
        //     outputRange: [0, 0, 0, 500],
        // });

    // }



    return (
        <>
            {/* {scrollY == undefined || scrollY == null ? */}
                <TouchableOpacity style={[styles.mainTab, { ...additionStyles, width: width }]} activeOpacity={0.9} onPress={() => onClickTab(data)}>
                    <Image source={{ uri: data.image }} style={{ height: 100, width: width, resizeMode: "contain", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                    <View style={{ borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#efebeb", top: -3 }}>
                        <Text style={styles.heading}>{data.label}</Text>
                        <View style={{ borderWidth: 0.5, borderColor: "#5F5F5F", backgroundColor: "#5F5F5F" }} />
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                            <Text style={styles.bottomheading}>Use</Text>
                            <SvgComponent svgName={"nineDot"} strokeColor={"#273441"} height={8} width={8} />
                            <View style={{ flex: 1 }} />
                            <View >
                                <Text style={styles.amount}>{data.amount}</Text>

                            </View>
                        </View>
                    </View>

                </TouchableOpacity>
                {/* :
                <Animated.View
                    style={{
                        transform: [{ scale: scale }, { translateX: Offset }],
                        opacity: opacity,
                    }}
                >
                    <TouchableOpacity style={[styles.mainTab, { ...additionStyles, width: width }]} activeOpacity={0.9} onPress={() => onClickTab(data)}>
                        <Image source={{ uri: data.image }} style={{ height: 100, width: width, resizeMode: "contain", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />
                        <View style={{ borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#efebeb", top: -3 }}>
                            <Text style={styles.heading}>{data.label}</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "#5F5F5F", backgroundColor: "#5F5F5F" }} />
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                                <Text style={styles.bottomheading}>Use</Text>
                                <SvgComponent svgName={"nineDot"} strokeColor={"#273441"} height={8} width={8} />
                                <View style={{ flex: 1 }} />
                                <View >
                                    <Text style={styles.amount}>{data.amount}</Text>

                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>

                </Animated.View>
            } */}


        </>
    )
}

CatalogueItem.defaultProps = {
    isHidden: false,
    data: {},
    backgroundColor: "#efebeb",
    borderRadius: 15,
    additionStyles: {},
    width: Dimension.width / 3,
    onPress: () => { }
};

CatalogueItem.propTypes = {
    isHidden: PropTypes.bool,
    data: PropTypes.instanceOf(Object),
    backgroundColor: PropTypes.string,
    borderRadius: PropTypes.number,
    additionStyles: PropTypes.instanceOf(Object),
    width: PropTypes.number,
    onPress: PropTypes.func
};

export default CatalogueItem