import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize } from "../../enums";

const styles = StyleSheet.create({
    container: {
        height: Dimension.height,
        backgroundColor: "#fff"
    },
    mainBox: {
        borderRadius: 20,
        // marginHorizontal: 5,
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        borderWidth: 1,
        borderColor: "#747C90",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 20
    },

    activeMainBox: {
        borderRadius: 20,
        // marginHorizontal: 5,
        backgroundColor: Color.COLOR.RED.AMARANTH,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: "#747C90",
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
    },

    activeTxt: {
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM,
        fontSize: FontSize.XS,
        color: Color.COLOR.WHITE.PURE_WHITE,
    },
    mainTxt: {
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM,
        fontSize: FontSize.XS,
        color: Color.COLOR.BLUE.LOTUS_BLUE,
    }
})

export default styles