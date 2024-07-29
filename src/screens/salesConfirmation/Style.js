import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize, Padding } from "../../enums";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimension.height,
        width: Dimension.width,
        backgroundColor: '#ffffff'
    },

    activeBoxshadowColor: {
        marginTop: 15,
        marginHorizontal: 5
    },

    dashUnderline: {
        borderStyle: 'dashed',
        borderColor: Color.COLOR.BLUE.LOTUS_BLUE,
        borderWidth: 0.7,
        marginHorizontal: 10
    },

    mainHeadrView: {
        // marginHorizontal: 10,
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#0B4F6C",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 15
    },

    mainTraderView: {
        marginHorizontal: 10,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },

    userImgSec: {
        borderRadius: 100,
        borderColor: Color.COLOR.WHITE.PURE_WHITE,
        borderWidth: 1,
        height: 42,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center'
    },

    imgSec: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        borderRadius: 100
    },

    taderText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.SM,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM,
        flex: 1,
        marginLeft: 5
    },

    showHideView: {
        marginHorizontal: 35,
        marginTop: 8
    },

    numberTextView: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2eaf0',
        borderRadius: 24
    },

    textNumber: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.MD,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
    },

    invText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.BOLD,
        flex: 1,
        marginLeft: 10
    },

    dateText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.BOLD,
        marginRight: 10
    },

    mainInputSec: {
        marginTop: 10,
        marginHorizontal: 5
        // flexDirection: 'row',
        // alignItems: 'center'
    },

    inputSec: {
        width: "85%",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        borderWidth: 0.8,
        borderColor: "#000",
        borderRadius: 20,
        backgroundColor: '#fff'
    },

    flexView: {
        alignItems: 'flex-end',
        flex: 0.3
    },

    bottonMainView: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15
    },

    cameraView: {
        height: 50,
        width: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Color.COLOR.BLUE.LOTUS_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
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



    productView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 15,

    },

    productName: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.REGULAR,

    },

    productValue: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: 11,
        fontFamily: FontFamily.FONTS.POPPINS.REGULAR,

    },

    salesRefferText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.SM,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
    },

    putRefferalText: {
        color: "#747C90",
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
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

    superTraderText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        fontSize: FontSize.SM,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
    },

    subRollText: {
        color: "#747C90",
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.REGULAR
    },

    verifyText: {
        color: "#747C90",
        fontSize: FontSize.XS,
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM
    },
    inputBoxStyle: {
        height: 35,
        backgroundColor: "#fff",
        borderColor: "#747C90", borderWidth: 0.5,
        elevation: 1,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputBoxText: {
        fontSize: 11,
        fontFamily: FontFamily.FONTS.INTER.SEMI_BOLD,
        marginLeft: 21,
        marginRight: 10,
        color: Color.COLOR.BLUE.LOTUS_BLUE,
        flex: 1
    },

    //modal

    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        paddingBottom: 50,
        borderRadius: 12,
        maxHeight: Dimension.height,
        width: Dimension.width - 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // flex:1,
        // right: 0,
        // left: 0,
        // bottom: 0,
        // top: -100,
        alignSelf: 'center',
    },
    sendSuccessfulImage: {
        height: 140,
        width: 210,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: FontSize.SM,
        color: Color.COLOR.BLACK.PURE_BLACK,
        fontFamily: FontFamily.FONTS.POPPINS.SEMI_BOLD,
        marginLeft: 10
    },

})

export default styles;