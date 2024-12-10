import { PropTypes } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react'
import styles from './style';
import { ActivityIndicator, Image, View, NativeModules } from 'react-native';
import { ErrorCode } from '../../services/constant';
import { MiddlewareCheck } from '../../services/middleware';

import { Buffer } from 'buffer'
import { ImageName } from '../../enums';

import _debounce from 'lodash/debounce';

function ImagePreview({
    isHidden,
    isDisabled,
    isVisible,
    props,
    height,
    width,
    fileName,
    additionalStyles
}) {

    if (isHidden) return null;
    // for validate url

    const [src, setSrc] = useState("");
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     debouncedFetchData();
    // }, [debouncedFetchData]);

    useEffect(async () => {
        async function fetchData() {
            // You can await here
            try {
                let req = { fileName: fileName };
                let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req);
                if (fileDownload.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    const base = Buffer.from(fileDownload.response.Body.data, 'binary').toString('base64');
                    setSrc('data:image/jpg;base64,' + base);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                throw new Error('Failed to process image: ' + error.message);

            }
            // ...
        }
        fetchData()

    }, [fileName]);

    const debouncedFetchData = useCallback(
        _debounce(async () => {
            try {

                RnBgTask.runInBackground_withPriority("NORMAL", async () => {
                    let req = { fileName: fileName };
                    let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req);
                    if (fileDownload.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                        const base = Buffer.from(fileDownload.response.Body.data, 'binary').toString('base64');
                        setSrc('data:image/jpg;base64,' + base);
                    }
                })
            } catch (error) {
                // Handle error
            } finally {
                setLoading(false);
            }
        }, 400),
        [fileName] // Dependency array ensures a new debounced function is created when fileName changes
    );


    return (
        <View>
            {loading ?
                <Image source={ImageName.NO_IMAGE} style={[{ height: height, width: width, resizeMode: "contain" }, { ...additionalStyles }]} />
                // <View style={{ height: 100 }}>
                //     <ActivityIndicator />
                // </View>
                :
                <Image source={src.length > 0 ? { uri: src } : ImageName.NO_IMAGE} style={[{ height: height, width: width, resizeMode: "contain" }, { ...additionalStyles }]} />
            }
        </View>
    )
}

ImagePreview.defaultProps = {
    isHidden: false,
    isDisabled: false,
    isVisible: false,
    onRequestClose: () => { },
    onBackdropPress: () => { },
    onBackButtonPress: () => { },
    props: {},
    height: 100,
    width: 100,
    fileName: "abc.png",
    additionalStyles: {}
};

ImagePreview.propTypes = {
    isHidden: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isVisible: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onBackdropPress: PropTypes.func,
    onBackButtonPress: PropTypes.func,
    props: PropTypes.instanceOf(Object).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    fileName: PropTypes.string,
    additionalStyles: PropTypes.instanceOf(Object)
};


export default ImagePreview;