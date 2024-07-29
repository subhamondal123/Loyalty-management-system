import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { Color, FontFamily, FontSize, ImageName } from '../../../enums';
import styles from './Style';

function DynamicCategoryTab({
    data,
    isHidden,
    isDisabled,
    onSelectedTab,
    borderRadius
}) {
    if (isHidden) return null;

    const [selectedIndex, setSelectedIndex] = useState(0);

    // styless

    const mainBox = {
        borderRadius: borderRadius,
        // marginHorizontal: 5,
        backgroundColor: Color.COLOR.WHITE.PURE_WHITE,
        borderWidth: 1,
        borderColor: "#747C90",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 3,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    }

    const activeMainBox = {
        borderRadius: borderRadius,
        // marginHorizontal: 5,
        backgroundColor: Color.COLOR.RED.AMARANTH,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 3,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
        
    }

    const activeTxt = {
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM,
        fontSize: FontSize.XS,
        color: Color.COLOR.WHITE.PURE_WHITE,
    }
    const mainTxt = {
        fontFamily: FontFamily.FONTS.POPPINS.MEDIUM,
        fontSize: FontSize.XS,
        color: Color.COLOR.BLUE.LOTUS_BLUE,
    }

    const onTabSelect = (value, index) => {
        onSelectedTab(value, index)
        setSelectedIndex(index)
    }

    return (
        <React.Fragment>
            {data == undefined || data == null ? null :
                <React.Fragment>
                    <TouchableOpacity style={data.check ? activeMainBox : mainBox}
                        activeOpacity={0.9} onPress={() => onTabSelect(data)}
                    >

                        {data.name == undefined || data.name == null ? null :
                            <Text style={data.check ? activeTxt : mainTxt}>{data.name}</Text>
                        }
                    </TouchableOpacity>
                </React.Fragment>
            }

        </React.Fragment>
    )
}

DynamicCategoryTab.defaultProps = {
    data: {},
    isHidden: false,
    isDisabled: false,
    onSelectedTab: () => { },
    borderRadius: 20
};

DynamicCategoryTab.propTypes = {
    data: PropTypes.instanceOf(Object),
    isHidden: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onSelectedTab: PropTypes.func,
    borderRadius: PropTypes.number
};


export default DynamicCategoryTab