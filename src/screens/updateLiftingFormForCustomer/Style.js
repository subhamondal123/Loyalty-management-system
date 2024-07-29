import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize } from "../../enums";

const styles = StyleSheet.create({
    container: {
        // height: Dimension.height,
        flex:1,
        backgroundColor: "#fff"
    },
    inputBoxStyle: {
        // flex:1,
        marginTop: 20,
        height: 45,
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        borderWidth: 1,
        borderColor: Color.COLOR.GRAY.GRAY_TINTS,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    inputBoxText: {
        fontSize: FontSize.SM,
        fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD,
        textAlign: "center",
        // marginLeft: 21,
        // marginRight: 10,
        color: Color.COLOR.GRAY.GRAY_COLOR,
    }

})

export default styles