import { StyleSheet } from "react-native";
import { Dimension } from "../../enums";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Dimension.height,
        width: Dimension.width,
        backgroundColor:'#FF041B'
    },
})

export default styles;