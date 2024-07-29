import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react'
import styles from './style';
import { View, Image, Text, SafeAreaView, } from 'react-native';
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../../enums';
import SvgComponent from '../../../assets/svg';
import { CRM_BASE_URI } from '../../../services/config/app_uri';
import ActivePointAndLocationSelectionTab from '../activePointAndLocationSelectionTab';
import { StorageDataModification } from '../../../services/common-view-function';

function ProfileSec({
    type,
    data,
    isHidden,
    props,
    isRefresh,
    onSelectLocation

}) {
    if (isHidden) return null;

    const propData = props.route.params.propData;


    const onSelectLocationData = async (val) => {
        onSelectLocation(val)
    }
    return (
        <View>
            <React.Fragment>
                <View style={{ backgroundColor: Color.COLOR.BLUE.LOTUS_BLUE, height: 150 }}>
                    <View style={{ marginHorizontal: 10, marginVertical: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ borderRadius: 100, borderColor: Color.COLOR.WHITE.PURE_WHITE, borderWidth: 1, height: 62, width: 62, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={propData.profilePic && propData.profilePic.length > 0 ? { uri: CRM_BASE_URI + propData.profilePic } : ImageName.USER_IMG} style={{ height: 60, width: 60, resizeMode: 'contain', borderRadius: 100 }} />
                            </View>
                            <View style={{ flex: 1, marginLeft: '5%' }}>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>For</Text>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>{propData.custBusinessName.length > 0 ? propData.custBusinessName : propData.customerName.length > 0 ? propData.customerName : propData.ownerName}</Text>
                                <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}>{propData.contactTypeName}</Text>
                            </View>
                            <View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    {/* <SvgComponent svgName={"lmsFilter"} strokeColor={"#fff"} height={25} width={25} /> */}
                                </View>
                                {/* <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                    <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.XS, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>Sales As</Text>
                                    <View style={{ width: 15 }} />
                                    <View style={{ backgroundColor: Color.COLOR.RED.AMARANTH, height: 22, width: 22, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM }}>3</Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>

                        {/* {isRefresh ? null : */}
                            <ActivePointAndLocationSelectionTab {...props} selectedLocation={(value) => onSelectLocationData(value)} screen={"profile"} isVisibleLocation={false} />
                        {/* } */}
                        {/* {activePointSec()} */}
                    </View>
                </View>
            </React.Fragment >
        </View >
    );

}

ProfileSec.defaultProps = {
    isHidden: false,
    data: {},
    type: "",
    isRefresh: false,
    onSelectLocation: () => { }
};

ProfileSec.propTypes = {
    data: PropTypes.instanceOf(Object),
    isHidden: PropTypes.bool,
    type: PropTypes.string,
    isRefresh: PropTypes.bool,
    onSelectLocation: PropTypes.func

};


export default ProfileSec;