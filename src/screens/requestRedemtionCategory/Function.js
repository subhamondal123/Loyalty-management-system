export function modCatalogueData(obj) {
    let respData = { "catalogueName": "", "catalogueId": "", "description": "", "categories": [] }
    if (Object.keys(obj).length > 0) {
        respData.catalogueName = obj.catalogueDetails.length > 0 ? obj.catalogueDetails[0].catalogueName : "";
        respData.catalogueId = obj.catalogueDetails.length > 0 ? obj.catalogueDetails[0].catalogueId.toString() : "";
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

export function modListData(obj) {
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
                if (obj[i].categoryId == undefined || obj[i].categoryId == null) {
                    modObj["categoryId"] = ""
                } else {
                    modObj["categoryId"] = obj[i].categoryId
                }
                if (obj[i].catalogueId == undefined || obj[i].catalogueId == null) {
                    modObj["catalogueId"] = ""
                } else {
                    modObj["catalogueId"] = obj[i].catalogueId
                }
                if (obj[i].groupId == undefined || obj[i].groupId == null) {
                    modObj["groupId"] = ""
                } else {
                    modObj["groupId"] = obj[i].groupId
                }
                if (obj[i].itemName == undefined || obj[i].itemName == null) {
                    modObj["label"] = ""
                } else {
                    modObj["label"] = obj[i].itemName
                }
                if (obj[i].imagePath == undefined || obj[i].imagePath == null) {
                    modObj["imagePath"] = ""
                } else {
                    // modObj["imagePath"] = await getimagePathFromBlob(obj[i].imagePathPath)
                    modObj["imagePath"] = obj[i].imagePath

                }
                if (obj[i].redeemPointsWithoutPAN == undefined || obj[i].redeemPoints == null) {
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
                if (obj[i].description == undefined || obj[i].description == null) {
                    modObj["description"] = ""
                } else {
                    modObj["description"] = obj[i].description
                }

                modObj["image"] = ""

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