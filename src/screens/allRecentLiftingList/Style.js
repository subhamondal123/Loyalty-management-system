import { StyleSheet } from "react-native";
import { Color, Dimension } from "../../enums";

const styles = StyleSheet.create({
    container: {
        height: Dimension.height,
        backgroundColor: "#fff"
    },
    activityBox: {
        borderWidth: 0.5,
        borderColor: "#F4C5C9",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 90,
        width: Dimension.width / 3 - 30,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    modalview: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        // paddingBottom: 50,
        borderRadius: 12,
        maxHeight: Dimension.height,
        width: Dimension.width - 20,
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

export default styles