import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, Image, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './style';
import { Color, FontFamily, ImageName } from '../../enums';
import { PropTypes } from 'prop-types';
import TextInputBox from '../text-input-box';
import { DateConvert, Toaster } from '../../services/common-view-function';

const months = [
    'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];

const MonthlyCalendar = ({ onSelect, month, year, visible, onClose, onReset, buttonColor, isRightBtnDisabled, isLeftBtnDisabled }) => {
    const [currYear, setCurrYear] = useState(year);
    const [currYearActive, sertCurrentYearActive] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(month);

    useEffect(() => {
        if (visible) {
            setCurrYear(year);
            setSelectedMonth(month);
        }
        sertCurrentYearActive(false);
    }, [visible, month, year]);

    const handleMonthSelect = (month) => {
        const date = new Date(Date.UTC(currYear, months.indexOf(month), 1));
        if (date <= new Date()) {
            setSelectedMonth(month);
        } else {
        }
    };

    const onPrevNexYear = (type) => {
        if ((currYear.toString()).length == 4) {
            if (type === "prev") {
                setCurrYear(prevYear => parseInt(prevYear) - 1);
                setSelectedMonth(DateConvert.getDDthMonthNameYYYYformat(new Date()).month)
            } else if (type === "next") {
                if (currYear + 1 <= DateConvert.getDDthMonthNameYYYYformat(new Date()).year) {
                    setCurrYear(prevYear => parseInt(prevYear) + 1);
                    setSelectedMonth(DateConvert.getDDthMonthNameYYYYformat(new Date()).month)
                }
            }
        } else {
            Toaster.ShortCenterToaster("Please enter a valid year!");
        }
    };

    const onSubmit = () => {
        if ((currYear.toString()).length == 4) {
            const selectedMonthIndex = months.indexOf(selectedMonth);
            onSelect(selectedMonth, currYear, selectedMonthIndex);
            onClose();
            // sertCurrentYearActive(false);
        } else {
            Toaster.ShortCenterToaster("Please select a valid year!");
        }
    };

    const onResetPress = () => {
        onReset();
        onClose();
        // sertCurrentYearActive(false);
    }

    const onChangeYear = (value) => {
        setCurrYear(value);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity onPress={onClose}>
                                <Image source={ImageName.RED_CLOSE_IMG} style={{ height: 25, width: 25, resizeMode: 'contain', bottom: 15, left: 15 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.yearSec}>
                            <TouchableOpacity onPress={() => onPrevNexYear("prev")} disabled={isLeftBtnDisabled} style={{ flex: 0.2 }}>
                                <Image source={ImageName.NAVIGATION_PREV} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.5 }}>
                                <TextInputBox
                                    placeholder={"Enter Year"}
                                    value={currYear.toString()}
                                    height={40}
                                    onChangeText={(value) => onChangeYear(value)}
                                    keyboardType="number"
                                    maxLength={4}
                                    isActive={currYearActive}
                                    onFocus={() => {
                                        sertCurrentYearActive(true)
                                    }}
                                    onBlur={() => {
                                        sertCurrentYearActive(false)
                                    }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => onPrevNexYear("next")} disabled={isRightBtnDisabled} style={{ flex: 0.2 }}>
                                <Image source={ImageName.NAVIGATION_NEXT} style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 15 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            {months.map((monthName, index) => (
                                <TouchableOpacity key={index} onPress={() => handleMonthSelect(monthName)} style={selectedMonth === monthName ? styles.selectedMonth : styles.month} activeOpacity={0.9}>
                                    <Text style={styles.monthText}>{monthName}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            {/* <TouchableOpacity onPress={onResetPress} style={styles.resetButton}>
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={onSubmit} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

MonthlyCalendar.defaultProps = {
    onSelect: () => { },
    month: "",
    year: "",
    visible: false,
    onClose: () => { },
    buttonColor: Color.COLOR.RED.AMARANTH,
    isRightBtnDisabled: false,
    isLeftBtnDisabled: false,
    onRequestClose: () => { },
    onBackdropPress: () => { },
    onBackButtonPress: () => { },
};

MonthlyCalendar.propTypes = {
    onSelect: PropTypes.func,
    month: PropTypes.string,
    year: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    buttonColor: PropTypes.string,
    isRightBtnDisabled: PropTypes.bool,
    isLeftBtnDisabled: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onBackdropPress: PropTypes.func,
    onBackButtonPress: PropTypes.func,
};

export default MonthlyCalendar;
