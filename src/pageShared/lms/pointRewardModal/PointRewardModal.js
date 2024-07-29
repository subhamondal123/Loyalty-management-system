import { PropTypes } from 'prop-types';
import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import styles from "./Style";
import { BigTextButton, CheckBox, Modal } from "../../../shared";
import { Color, FontFamily, FontSize, ImageName } from '../../../enums';
import SvgComponent from '../../../assets/svg';

function PointRewardModal({
    isHidden,
    isVisible,
    isLoading,
    type,
    data,
    onCloseModal,
    props,
    onFilter,
    onDataReset

}) {
    if (isHidden) return null;
    const onRequestCloseModal = () => {
        onCloseModal();
    }

    const onBackDropPressModal = () => {
        onCloseModal();
    }

    const onBackButtonPressModal = () => {
        // onCloseModal();
    }



    return (
        <Modal
            isVisible={isVisible}
            // onRequestClose={() => onRequestCloseModal()}
            // onBackdropPress={() => onBackDropPressModal()}
            // onBackButtonPress={() => onBackButtonPressModal()}
            children={
                <View style={styles.modalview}>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity activeOpacity={0.9} onPress={() => onRequestCloseModal()}>
                            <SvgComponent svgName={"cross"} strokeColor={Color.COLOR.BLUE.LOTUS_BLUE} height={20} width={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={ImageName.REWARD_POINT_IMG} style={styles.sendSuccessfulImage}></Image>
                        <Text style={styles.headerText}>You Will Get</Text>
                        <Text style={styles.headerBottomText}>{data} Points</Text>
                        <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: 16, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>after Confirmation</Text>
                    </View>
                </ View>
            }
        />

    )
}

PointRewardModal.defaultProps = {
    isHidden: false,
    isVisible: false,
    isLoading: false,
    type: "accept",
    data: "",
    onCloseModal: () => { },
    onFilter: () => { },
    onDataReset: () => { }
}

PointRewardModal.propTypes = {
    isHidden: PropTypes.bool,
    isVisible: PropTypes.bool,
    isLoading: PropTypes.bool,
    type: PropTypes.string,
    data: PropTypes.string,
    onCloseModal: PropTypes.func,
    onFilter: PropTypes.func,
    onDataReset: PropTypes.func,
}

export default PointRewardModal;

