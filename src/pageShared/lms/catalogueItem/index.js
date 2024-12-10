import React, { useEffect, useState } from 'react'
import styles from "./style";
import { PropTypes } from 'prop-types';
import { ActivityIndicator, Animated, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { Dimension, ImageName } from '../../../enums';
import SvgComponent from '../../../assets/svg';
import FastImage from 'react-native-fast-image';
import { ImagePreview } from '../../../shared';
import { MiddlewareCheck } from '../../../services/middleware';
import { ErrorCode } from '../../../services/constant';


import { Buffer } from 'buffer'
import { App_uri } from '../../../services/config';

function CatalogueItem({
    props,
    data,
    onPressTab,
    backgroundColor,
    borderRadius,
    additionStyles,
    isHidden,
    width,
    onPress,
    scrollY,
    index
}) {

    if (isHidden) return null;

    const [src, setSrc] = useState("");

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            let img = "";
            let req = {
                fileName: data.imagePath
            }
            setLoading(true)
            let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req, this.props);

            if (fileDownload.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                try {
                    const base = Buffer.from(fileDownload.response.Body.data, 'binary').toString('base64')
                    img = 'data:image/jpg;base64,' + base
                    setSrc(img)
                } catch (error) {

                }
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const onClickTab = (data) => {
        let mainData = Object.assign(data, { src: src })
        onPress(mainData)
    }



    return (
        <>
            {/* {scrollY == undefined || scrollY == null ? */}
            <TouchableOpacity style={[styles.mainTab, { ...additionStyles, width: width }]} activeOpacity={0.9} onPress={() => onClickTab(data)}>
                {/* {loading ? <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
                    <Image source={ImageName.NO_IMAGE} style={[{ height: 100, width: width, resizeMode: "contain", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]} />

                </View> :
                     <FastImage
                     style={{ width: width, height: 100, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
                     source={src.length > 0 ? { uri: src } : ImageName.NO_IMAGE}
                     resizeMode={FastImage.resizeMode.contain}
                 >
                 </FastImage>
                } */}
                <Image source={data.imagePath.length > 0 ? { uri: App_uri.LMS_AWS_S3_IMAGE_VIEW_URI + "/" + data.imagePath } : ImageName.NO_IMAGE} style={[{ height: 100, width: width, resizeMode: "contain", borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]} />

                {/* <ImagePreview width={width} height={100} fileName={data.imagePath} additionalStyles={{ borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} /> */}
                <View style={{ borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#efebeb", top: -3 }}>
                    <Text style={styles.heading} numberOfLines={1}>{data.label}</Text>
                    <View style={{ borderWidth: 0.5, borderColor: "#5F5F5F", backgroundColor: "#5F5F5F" }} />
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                        <Text style={styles.bottomheading}>Use</Text>
                        <SvgComponent svgName={"nineDot"} strokeColor={"#273441"} height={8} width={8} />
                        <View style={{ flex: 1 }} />
                        <View >
                            <Text style={styles.amount}>{data.amount}</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        </>
    )
}

CatalogueItem.defaultProps = {
    isHidden: false,
    data: {},
    backgroundColor: "#efebeb",
    borderRadius: 15,
    additionStyles: {},
    width: Dimension.width / 3,
    onPress: () => { }
};

CatalogueItem.propTypes = {
    isHidden: PropTypes.bool,
    data: PropTypes.instanceOf(Object),
    backgroundColor: PropTypes.string,
    borderRadius: PropTypes.number,
    additionStyles: PropTypes.instanceOf(Object),
    width: PropTypes.number,
    onPress: PropTypes.func
};

export default CatalogueItem