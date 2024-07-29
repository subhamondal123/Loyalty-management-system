
import { StyleSheet } from "react-native";
import {  Color, Dimension, Padding } from '../../enums';

const styles = StyleSheet.create({
    
    container: {
        height:Dimension.height,
        backgroundColor:"#fff",
        flex:1
    },
    advisorySec: {
        backgroundColor: "#172834",
        borderRadius: 20,
        paddingHorizontal: 10,
        flexDirection: "row",
        paddingVertical: 15,
        marginHorizontal:10
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

})

export default styles;