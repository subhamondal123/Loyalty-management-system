import { App_uri } from "../../services/config";

export function modifyDetailsData(arr) {
    let respData = {};
    if (arr && arr.length > 0) {
        if (arr[0].id == undefined || arr[0].id == null) {
            respData["id"] = "N/A"
        } else {
            respData["id"] = arr[0].id
        }
        if (arr[0].description == undefined || arr[0].description == null) {
            respData["description"] = "N/A"
        } else {
            respData["description"] = arr[0].description
        }
        if (arr[0].imagePath == undefined || arr[0].imagePath == null) {
            respData["imagePath"] = ""
        } else {
            respData["imagePath"] = App_uri.LMS_IMAGE_VIEW_URI + arr[0].imagePath
        }
        if (arr[0].itemCode == undefined || arr[0].itemCode == null) {
            respData["itemCode"] = "N/A"
        } else {
            respData["itemCode"] = arr[0].itemCode
        }
        if (arr[0].itemName == undefined || arr[0].itemName == null) {
            respData["itemName"] = "N/A"
        } else {
            respData["itemName"] = arr[0].itemName
        }

    }
    return respData
}

export function modifySuggestedItemData(arr) {
    let respData = [];
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].id == undefined || arr[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].id
            }
            if (arr[i].itemName == undefined || arr[i].itemName == null) {
                modObj["label"] = ""
            } else {
                modObj["label"] = arr[i].itemName
            }
            if (arr[i].imagePath == undefined || arr[i].imagePath == null) {
                modObj["image"] = ""
            } else {
                modObj["image"] = App_uri.LMS_IMAGE_VIEW_URI + arr[i].imagePath
            }
            if (arr[i].redeemPoints == undefined || arr[i].redeemPoints == null) {
                modObj["amount"] = ""
            } else {
                modObj["amount"] = arr[i].redeemPoints
            }

            respData.push(modObj)
        }

    }
    return respData
}



export function modDeliveryAddress(arr) {
    let respData = [];
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].id == undefined || arr[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].id
            }
            if (arr[i].address == undefined || arr[i].address == null) {
                modObj["address"] = ""
            } else {
                modObj["address"] = arr[i].address
            }

            if (arr[i].isDefault == undefined || arr[i].isDefault == null) {
                modObj["isDefault"] = ""
            } else {
                modObj["isDefault"] = arr[i].isDefault
            }

            modObj["check"] = arr[i].isDefault == 1 ? true : false
            respData.push(modObj)
        }

    }
    return respData
}
