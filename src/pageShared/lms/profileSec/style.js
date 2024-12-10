import { StyleSheet } from "react-native";
import { Color, Dimension, FontFamily, FontSize } from "../../../enums";


const styles = StyleSheet.create({
    mainView: {
        marginTop: 15
    },
    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        // paddingBottom: Padding.PADDING.NORMAL_PX_PADDING.NORMAL_PADDING_30PX,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: Dimension.width / 1.1,
        maxHeight: Dimension.height ,
        alignSelf: 'center',
        // right: 0,
        // left: 0,
        bottom: 0,
        position: 'absolute',
        // position: 'absolute',
    },
    dropdownSec: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        height: 28,
        width: 28,
        backgroundColor: '#9298a9',
        borderRadius: 100,
    },
});

export default styles;