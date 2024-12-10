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
        marginHorizontal:10
    },

    heading: {
        fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD,
        fontSize: 9,
        color: "#1F2B4D",
        marginBottom: 5
    },
    bottomheading: {
        fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD,
        fontSize: 12,
        color: "#8B8B8B",
        marginBottom: 3,
        marginRight: 5
    },
    amount: {
        fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD,
        fontSize: 11,
        color: "#1F2B4D",
        marginBottom: 3,
        marginRight: 5
    },
    mainTab: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderRadius:15,
        backgroundColor:Color.COLOR.GRAY.GRAY_TINTS
    },
    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        // paddingBottom: 50,
        borderRadius: 12,
        maxHeight: Dimension.height,
        // width: Dimension.width - 20,
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // flex:1,
        // right: 0,
        // left: 0,
        // bottom: 0,
        // top: -100,
        alignSelf: 'center',
    },

})

export default styles;