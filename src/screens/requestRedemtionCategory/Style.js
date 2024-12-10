import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily } from "../../enums";

const styles = StyleSheet.create({
    container: {
        height: Dimension.height,
        backgroundColor: "#fff"
    },
    advisorySec: {
        backgroundColor: "#172834",
        borderRadius: 20,
        paddingHorizontal: 10,
        flexDirection: "row",
        paddingVertical: 15,
        marginHorizontal: 10
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
})

export default styles;