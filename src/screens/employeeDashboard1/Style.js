import { StyleSheet } from "react-native";
import { Dimension } from "../../enums";

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
    }
})

export default styles