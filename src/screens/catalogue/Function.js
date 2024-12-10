import { DateConvert } from "../../services/common-view-function";
import { App_uri } from "../../services/config";
import { ErrorCode } from "../../services/constant";
import { MiddlewareCheck } from "../../services/middleware";

import { Buffer } from 'buffer'

export function modCatalogueData(obj) {
    let respData = { "catalogueName": "", "catalogueId": "", "description": "", "categories": [],"catalogueFile":"" }
    if (Object.keys(obj).length > 0) {
        respData.catalogueName = obj.catalogueDetails.length > 0 ? obj.catalogueDetails[0].catalogueName : "";
        respData.catalogueId = obj.catalogueDetails.length > 0 ? obj.catalogueDetails[0].catalogueId.toString() : "";
        respData.catalogueFile = obj.catalogueDetails.length > 0 ? obj.catalogueDetails[0].catalogueFile ? obj.catalogueDetails[0].catalogueFile : "" : "";
        if (obj.categoryDetails && obj.categoryDetails.length > 0) {
            for (let i = 0; i < obj.categoryDetails.length; i++) {
                let modObj = {};
                if (obj.categoryDetails[i].categoryId == undefined || obj.categoryDetails[i].categoryId == null) {
                    modObj["id"] = ""
                } else {
                    modObj["id"] = obj.categoryDetails[i].categoryId
                }
                if (obj.categoryDetails[i].categoryName == undefined || obj.categoryDetails[i].categoryName == null) {
                    modObj["name"] = ""
                } else {
                    modObj["name"] = obj.categoryDetails[i].categoryName
                }

                modObj["check"] = i == 0 ? true : false

                respData.categories.push(modObj)
            }
        }
    }
    return respData
}

export function modGroupData(arr) {
    let respData = []
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].id == undefined || arr[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].id
            }
            if (arr[i].groupName == undefined || arr[i].groupName == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = arr[i].groupName
            }

            modObj["check"] = i == 0 ? true : false

            respData.push(modObj)
        }
    }

    return respData
}

export async function modListData(obj) {
    let respData = { "listData": [], totalCount: "" }
    if (obj) {
        // if (Object.keys(obj).length > 0) {
        if (obj && obj.length > 0) {
            for (let i = 0; i < obj.length; i++) {
                let modObj = {};
                if (obj[i].itemId == undefined || obj[i].itemId == null) {
                    modObj["id"] = ""
                } else {
                    modObj["id"] = obj[i].itemId
                }
                if (obj[i].itemName == undefined || obj[i].itemName == null) {
                    modObj["label"] = ""
                } else {
                    modObj["label"] = obj[i].itemName
                }
                if (obj[i].imagePath == undefined || obj[i].imagePath == null) {
                    modObj["imagePath"] = ""
                } else {
                    modObj["imagePath"] = obj[i].imagePath
                    // modObj["imagePath"] = await getImg(obj[i].imagePath)

                }
                if (obj[i].redeemPoints == undefined || obj[i].redeemPoints == null) {
                    modObj["amount"] = ""
                } else {
                    modObj["amount"] = obj[i].redeemPoints
                }
                if (obj[i].redeemPointsWithPAN == undefined || obj[i].redeemPointsWithPAN == null) {
                    modObj["redeemPointsWithPAN"] = ""
                } else {
                    modObj["redeemPointsWithPAN"] = obj[i].redeemPointsWithPAN
                }
                if (obj[i].redeemPointsWithoutPAN == undefined || obj[i].redeemPointsWithoutPAN == null) {
                    modObj["redeemPointsWithoutPAN"] = ""
                } else {
                    modObj["redeemPointsWithoutPAN"] = obj[i].redeemPointsWithoutPAN
                }

                modObj["image"] = ""
                modObj["loading"] = false

                respData.listData.push(modObj)
            }



        }
        // }
    }
    return respData
}

export function modifyFinancialYearDropdownData(data) {
    let respArr = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {};
            if (data[i].financialyearId == undefined || data[i].financialyearId == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = data[i].financialyearId
            }
            if (data[i].financialYearStartDate == undefined || data[i].financialYearStartDate == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = formatYearRange(data[i].financialYearStartDate, data[i].financialYearEndDate)
            }
            respArr.push(modObj)
        }
    }
    return respArr
}

export function formatYearRange(startDate, endDate) {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    // Format to desired format "YYYY-YY"
    return `${startYear}-${endYear.toString().slice(-2)}`;
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


export async function getImg(filename) {
    const start = Date.now();

    // try {
    let req = { fileName: filename };
    let fileDownload = await MiddlewareCheck("geLMSFileDownloadPreview", req, this.props);
    // const downloadTime = Date.now();
    // console.log(`Download time: ${downloadTime - start} ms`);
    if (fileDownload.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        const base = Buffer.from(fileDownload.response.Body.data).toString('base64');
        const processTime = Date.now();
        console.log(`Processing time: ${processTime - downloadTime} ms`);

        return 'data:image/jpg;base64,' + base;
    } else {
        // Handle error cases appropriately
        console.error('File download failed:', fileDownload.status);
        return null;
    }
    // } catch (error) {
    //     // Handle exceptions that may occur during processing
    //     console.error('Error processing image:', error);
    //     return null;
    // }
}