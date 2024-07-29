import { App_uri } from "../../services/config";

export function modifyCategoryData(arr) {
    let respData = [];
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].id == undefined || arr[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].id
            }
            if (arr[i].categoryname == undefined || arr[i].categoryname == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = arr[i].categoryname
            }

            modObj["check"] = false;

            respData.push(modObj)
        }
    }

    return respData;
}

export function modCatalogueData(obj) {
    let respData = { "catalogueName": "", "catalogueId": "", "categories": [] }
    respData.catalogueName = obj.catalogue;
    respData.catalogueId = obj.catalogueId;
    if (obj.categories && obj.categories.length > 0) {
        for (let i = 0; i < obj.categories.length; i++) {
            let modObj = {};
            if (obj.categories[i].id == undefined || obj.categories[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = obj.categories[i].id
            }
            if (obj.categories[i].categoryname == undefined || obj.categories[i].categoryname == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = obj.categories[i].categoryname
            }

            modObj["check"] = i == 0 ? true : false

            respData.categories.push(modObj)
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
        if (Object.keys(obj).length > 0) {
            if (obj.details && obj.details.length > 0) {
                for (let i = 0; i < obj.details.length; i++) {
                    let modObj = {};
                    if (obj.details[i].id == undefined || obj.details[i].id == null) {
                        modObj["id"] = ""
                    } else {
                        modObj["id"] = obj.details[i].id
                    }
                    if (obj.details[i].itemName == undefined || obj.details[i].itemName == null) {
                        modObj["label"] = ""
                    } else {
                        modObj["label"] = obj.details[i].itemName
                    }
                    if (obj.details[i].imagePath == undefined || obj.details[i].imagePath == null) {
                        modObj["image"] = ""
                    } else {
                        modObj["image"] = App_uri.LMS_IMAGE_VIEW_URI + obj.details[i].imagePath
                    }
                    if (obj.details[i].redeemPoints == undefined || obj.details[i].redeemPoints == null) {
                        modObj["amount"] = ""
                    } else {
                        modObj["amount"] = obj.details[i].redeemPoints
                    }

                    modObj["type"] = "customer"

                    respData.listData.push(modObj)
                }

            }
        }
    }
    return respData
}