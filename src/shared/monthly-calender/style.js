const { StyleSheet } = require("react-native");
const { Color, Dimension } = require("../../enums");

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: Color.COLOR.BLACK.PURE_BLACK,
        // borderRadius: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        borderRadius: 8,
        borderColor: "#000",
    },
    month: {
        width: '25%', // Adjust as needed
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    monthText: {
        color: Color.COLOR.BLUE.LOTUS_BLUE,
    },
    navigationButton: {
        width: '25%', // Adjust as needed
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    navigationButtonText: {
        color: '#007AFF', // Example color
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxWidth: Dimension.width - 50,
        maxHeight: 500,
        height: 350
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: Color.COLOR.RED.AMARANTH,
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 5,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resetButton: {
        marginTop: 20,
        backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE,
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 5,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeButtonText: {
        color: Color.COLOR.WHITE.PURE_WHITE,
        fontSize: 16,
    },
    resetButtonText: {
        color: Color.COLOR.WHITE.PURE_WHITE,
        fontSize: 16,
    },
    selectedMonth: {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: Color.COLOR.GRAY.LIGHT_GRAY_COLOR,
        borderRadius: 10,
    },
    yearSec: {
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        borderRadius: 8,
        borderColor: "#000",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: 200
    }
});

export default styles;