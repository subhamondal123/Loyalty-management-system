
import { Buffer } from 'buffer'
import { ErrorCode } from "../../services/constant";
import { MiddlewareCheck } from "../../services/middleware";

export async function modifyCartData(obj) {
    let respData = { "listData": [], totalCount: "" }
    if (obj) {
        if (Object.keys(obj).length > 0) {
            if (obj.details && obj.details.length > 0) {
                for (let i = 0; i < obj.details.length; i++) {
                    let modObj = {};
                    if (obj.details[i].id == undefined || obj.details[i].id == null) {
                        modObj["id"] = ""
                    } else {
                        modObj["id"] = obj.details[i].id
                    }
                    if (obj.details[i].itemId == undefined || obj.details[i].itemId == null) {
                        modObj["itemId"] = ""
                    } else {
                        modObj["itemId"] = obj.details[i].itemId
                    }
                    if (obj.details[i].itemName == undefined || obj.details[i].itemName == null) {
                        modObj["label"] = ""
                    } else {
                        modObj["label"] = obj.details[i].itemName
                    }
                    if (obj.details[i].imagePath == undefined || obj.details[i].imagePath == null) {
                        modObj["imagePath"] = ""
                    } else {
                        // modObj["imagePath"] = await getimagePathFromBlob(obj[i].imagePathPath)
                        modObj["imagePath"] = await getImageFromBlob(obj.details[i].imagePath)

                    }
                    if (obj.details[i].redeemPoints == undefined || obj.details[i].redeemPoints == null) {
                        modObj["amount"] = ""
                    } else {
                        // modObj["amount"] = checkPan ? obj.details[i].redeemPointsWithPAN : obj.details[i].redeemPointsWithoutPAN
                        modObj["amount"] = obj.details[i].redeemPoints
                    }
                    if (obj.details[i].redeemPointsWithPAN == undefined || obj.details[i].redeemPointsWithPAN == null) {
                        modObj["redeemPointsWithPAN"] = ""
                    } else {
                        modObj["redeemPointsWithPAN"] = obj.details[i].redeemPointsWithPAN
                    }
                    if (obj.details[i].redeemPointsWithoutPAN == undefined || obj.details[i].redeemPointsWithoutPAN == null) {
                        modObj["redeemPointsWithoutPAN"] = ""
                    } else {
                        modObj["redeemPointsWithoutPAN"] = obj.details[i].redeemPointsWithoutPAN
                    }

                    modObj["image"] = "",
                        modObj["check"] = false,

                        respData.listData.push(modObj)
                }
            }
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



export async function getImageFromBlob(fileName) {
    // return new Promise(async (resolve, reject) => {
    let img = "";
    let req = {
        fileName: fileName
    }
    let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req, this.props);
    if (fileDownload.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        try {
            const base = Buffer.from(fileDownload.response.Body.data, 'binary').toString('base64')
            img = 'data:image/jpg;base64,' + base
            return img
            // resolve(img)
        } catch (error) {

        }
    }
    //     else {
    //         reject(false)
    //     }
    // })
}


export function modCartDataForRequest(data, isPan) {
    let respData = []
    if (data) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let modObj = {};
                if (data[i].amount == undefined || data[i].amount == null) {
                    modObj["point"] = ""
                } else {
                    modObj["point"] = data[i].amount
                }
                if (data[i].id == undefined || data[i].id == null) {
                    modObj["cartId"] = ""
                } else {
                    modObj["cartId"] = data[i].id
                }
                if (data[i].itemId == undefined || data[i].itemId == null) {
                    modObj["itemId"] = null
                } else {
                    modObj["itemId"] = data[i].itemId
                }

                if (data[i].tdsId == undefined || data[i].tdsId == null) {
                    modObj["tdsId"] = null
                } else {
                    modObj["tdsId"] = data[i].tdsId
                }

                modObj["type"] = data[i].id == null || data[i].id == undefined ? 2 : 1   //for tds data == 2 , normal ==1
                modObj["isPan"] = isPan
                modObj["creditNote"] = data[i].check ? "1" : "0"
                // modObj["tdsId"] = data[i].tdsId

                respData.push(modObj)
            }
        }
    }
    return respData
}

export function modPointData(data) {
    let obj = {
        "activePoints": 0,
        "holdPoints": 0,
        "lockPoints": 0
    }
    if (Object.keys(data).length > 0) {
        obj.activePoints = data.activePoints,
            obj.holdPoints = data.holdPoints,
            obj.lockPoints = data.lockPoints
    }
    return obj
}
