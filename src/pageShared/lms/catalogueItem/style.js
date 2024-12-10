import { StyleSheet } from "react-native";
import { Color, FontFamily } from "../../../enums";

const styles = StyleSheet.create({
    mainTab: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderRadius:15,
        backgroundColor:Color.COLOR.GRAY.GRAY_TINTS
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

    mainImg: {
        height: 25,
        width: 25,
        resizeMode: "contain"
    },
    imgSec: {
        marginBottom: 10
    },
    titleSec: {

    },
    titleTxt: {
        fontFamily: FontFamily.FONTS.POPPINS.REGULAR,
        fontSize: 12,
        color: "#1F2B4D",
    },

})

export default styles;