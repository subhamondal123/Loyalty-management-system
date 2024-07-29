import { App_uri } from "../../services/config";

export function modOfferData(arr) {
    let respData = []
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].offerImagePath == undefined || arr[i].offerImagePath == null) {
                modObj["image"] = ""
            } else {
                modObj["image"] = App_uri.LMS_IMAGE_VIEW_URI + arr[i].offerImagePath
            }
            if (arr[i].offerCode == undefined || arr[i].offerCode == null) {
                modObj["offerCode"] = ""
            } else {
                modObj["offerCode"] = arr[i].offerCode
            }

            respData.push(modObj)
        }
    }

    return respData
}

export function modRecentOfferData(arr) {
    let respData = []
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].offerImagePath == undefined || arr[i].offerImagePath == null) {
                modObj["image"] = ""
            } else {
                modObj["image"] = App_uri.LMS_IMAGE_VIEW_URI + arr[i].offerImagePath
            }
            if (arr[i].offerCode == undefined || arr[i].offerCode == null) {
                modObj["offerCode"] = ""
            } else {
                modObj["offerCode"] = arr[i].offerCode
            }

            respData.push(modObj)
        }
    }

    return respData
}
