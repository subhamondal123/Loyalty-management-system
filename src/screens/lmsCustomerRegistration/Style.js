import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize } from "../../enums";

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: Dimension.height,
        // width: Dimension.width,
        backgroundColor: '#ffffff'
    },

    activeBoxshadowColor: {
        marginTop: 15,
        marginHorizontal: 5
    },

    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        // paddingBottom: Padding.PADDING.NORMAL_PX_PADDING.NORMAL_PADDING_30PX,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: Dimension.width / 1.1,
        // maxHeight: Dimension.height,
        alignSelf: 'center',
        // right: 0,
        // left: 0,
        bottom: -21,
        position: 'absolute',
        // position: 'absolute',
    },

    dashUnderline: {
        borderStyle: 'dashed',
        borderColor: Color.COLOR.BLUE.LOTUS_BLUE,
        borderWidth: 0.7,
        marginHorizontal: 8
    },
    dropdownSec: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        height: 28,
        width: 28,
        backgroundColor: '#9298a9',
        borderRadius: 100,
    },

    mainBox: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        elevation: 2,
        shadowColor: '#000',
        borderRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        marginBottom: 5,
    },

    blueBox: {
        backgroundColor: Color.COLOR.RED.AMARANTH,
        height: 80,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        justifyContent: 'center',
    },

    mainTraderView: {
        marginHorizontal: 10,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    numberViewSec: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        borderColor: '#000',
        borderWidth: 0.5
    },
    textNumber: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.MD,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
    },

    countryCodeLine: {
        borderWidth: 0.5,
        borderColor: Color.COLOR.BLACK.PURE_BLACK,
        // borderBottomColor: Color.COLOR.GRAY.LIGHT_GRAY_COLOR,
        // backgroundColor: '#fff',
        // borderRadius: 10,
        // marginBottom: 10,
        marginRight: 10,
        // width: singleton.width / 5,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.3,
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        borderRadius: 30
    },
    countryCode: {
        fontFamily: FontFamily.FONTS.POPPINS.REGULAR,
        fontSize: FontSize.SM,
        color: Color.COLOR.BLACK.DARK_BLACK
    },

})

export default styles;