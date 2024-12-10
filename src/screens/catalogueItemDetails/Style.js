
import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize, Padding } from '../../enums';

const styles = StyleSheet.create({

    container: {
        height: Dimension.height,
        backgroundColor: "#fff",
        flex: 1
    },
    advisorySec: {
        backgroundColor: "#172834",
        borderRadius: 20,
        paddingHorizontal: 10,
        flexDirection: "row",
        paddingVertical: 15,
        marginHorizontal: 10
    },
    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        paddingBottom: Padding.PADDING.NORMAL_PX_PADDING.NORMAL_PADDING_30PX,
        borderRadius: 12,
        maxHeight: Dimension.height,
        width: Dimension.width - 20,
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
        alignSelf: 'center',
    },

    headerSec: {
        marginTop: 10,
        flexDirection: "row",
        marginHorizontal: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    backImg: {
        height: 25,
        width: 25,
        resizeMode: "contain"
    },
    profileTab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 5,
    },
    imgPreviewSec: {
        height: 35,
        width: 35,
        borderRadius: 100
    },
    titleTxt: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.SM,
        fontFamily: FontFamily.FONTS.POPPINS.BOLD,
    },
    cardTab: {
        // flex: 0.2,
        backgroundColor: "#F13748",
        // paddingVertical: 5,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 18,
        // height: 35,
    },
    shoppingImg: {
        height: 18,
        width: 18,
        resizeMode: "contain"
    },
    cartCountTxt: {
        color: Color.COLOR.WHITE.PURE_WHITE,
        fontSize: 18,
        fontFamily: FontFamily.FONTS.POPPINS.BOLD,
        marginTop: 2,
    },

})

export default styles;