import { Toaster } from "../../services/common-view-function";
import { App_uri } from "../../services/config";

export function modRecentLiftingData(data, permData) {
    let respData = { list: [], totalMtd: 0, count: 0 };
    if (data.details) {
        let total = getTotalMtd(data)
        respData.totalMtd = total;
        respData.count = data.count;
        for (let i = 0; i < data.details.length; i++) {
            let modObj = {};
            if (data.details[i].id == undefined || data.details[i].id == null) {
                modObj["id"] = "";
            } else {
                modObj["id"] = data.details[i].id;
            }
            if (data.details[i].refUserTypeId == undefined || data.details[i].refUserTypeId == null) {
                modObj["refUserTypeId"] = "";
            } else {
                modObj["refUserTypeId"] = data.details[i].refUserTypeId;
            }
            if (data.details[i].salesDate == undefined || data.details[i].salesDate == null) {
                modObj["salesDate"] = "";
            } else {
                modObj["salesDate"] = data.details[i].salesDate;
            }

            if (data.details[i].refUserTypeName == undefined || data.details[i].refUserTypeName == null) {
                modObj["refUserTypeName"] = "";
            } else {
                modObj["refUserTypeName"] = data.details[i].refUserTypeName;
            }
            if (data.details[i].referUserId == undefined || data.details[i].referUserId == null) {
                modObj["referUserId"] = "";
            } else {
                modObj["referUserId"] = data.details[i].referUserId;
            }
            if (data.details[i].referUserName == undefined || data.details[i].referUserName == null) {
                modObj["referUserName"] = "";
            } else {
                modObj["referUserName"] = data.details[i].referUserName;
            }
            if (data.details[i].liftFromUserTypeId == undefined || data.details[i].liftFromUserTypeId == null) {
                modObj["liftFromUserTypeId"] = "";
            } else {
                modObj["liftFromUserTypeId"] = data.details[i].liftFromUserTypeId;
            }
            if (data.details[i].liftFromUserTypeName == undefined || data.details[i].liftFromUserTypeName == null) {
                modObj["liftFromUserTypeName"] = "";
            } else {
                modObj["liftFromUserTypeName"] = data.details[i].liftFromUserTypeName;
            }
            if (data.details[i].liftFromUserId == undefined || data.details[i].liftFromUserId == null) {
                modObj["liftFromUserId"] = "";
            } else {
                modObj["liftFromUserId"] = data.details[i].liftFromUserId;
            }
            if (data.details[i].liftFromUserName == undefined || data.details[i].liftFromUserName == null) {
                modObj["liftFromUserName"] = "";
            } else {
                modObj["liftFromUserName"] = data.details[i].liftFromUserName;
            }
            if (data.details[i].createdAt == undefined || data.details[i].createdAt == null) {
                modObj["createdAt"] = "";
            } else {
                modObj["createdAt"] = data.details[i].createdAt;
            }
            if (data.details[i].isVerified == undefined || data.details[i].isVerified == null) {
                modObj["isVerified"] = "";
            } else {
                modObj["isVerified"] = data.details[i].isVerified;
            }
            if (data.details[i].productQuantity == undefined || data.details[i].productQuantity == null) {
                modObj["productQuantity"] = "";
            } else {
                modObj["productQuantity"] = data.details[i].productQuantity;
            }
            if (data.details[i].unitName == undefined || data.details[i].unitName == null) {
                modObj["unitName"] = "";
            } else {
                modObj["unitName"] = data.details[i].unitName;
            }
            if (data.details[i].referUserProfilePic == undefined || data.details[i].referUserProfilePic == null) {
                modObj["referUserProfilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + "/images/business.jpg";
            } else {
                modObj["referUserProfilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + data.details[i].referUserProfilePic;
            }
            if (data.details[i].liftFromUserProfilePic == undefined || data.details[i].liftFromUserProfilePic == null) {
                modObj["liftFromUserProfilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + "/images/business.jpg";
            } else {
                modObj["liftFromUserProfilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + data.details[i].liftFromUserProfilePic;
            }

            if (data.details[i].location == undefined || data.details[i].location == null || data.details[i].location.length == 0) {
                modObj["topLevelProduct"] = "";
            } else {
                modObj["topLevelProduct"] = getTopLevelProduct(data.details[i].location);
            }
            if (data.details[i].location == undefined || data.details[i].location == null || data.details[i].location.length == 0) {
                modObj["leafLevelProduct"] = "";
            } else {
                modObj["leafLevelProduct"] = getLeafLevelProduct(data.details[i].location);
            }
            if (data.details[i].liftFromCustName == undefined || data.details[i].liftFromCustName == null) {
                modObj["liftFromCustName"] = "";
            } else {
                modObj["liftFromCustName"] = data.details[i].liftFromCustName;
            }
            if (data.details[i].referCustName == undefined || data.details[i].referCustName == null) {
                modObj["referCustName"] = "";
            } else {
                modObj["referCustName"] = data.details[i].referCustName;
            }
            if (data.details[i].productId == undefined || data.details[i].productId == null) {
                modObj["productId"] = "";
            } else {
                modObj["productId"] = data.details[i].productId;
            }
            if (data.details[i].financialYearId == undefined || data.details[i].financialYearId == null) {
                modObj["financialYearId"] = "";
            } else {
                modObj["financialYearId"] = data.details[i].financialYearId;
            }



            modObj["isDelete"] = hasEditPermission(data.details[i].createdAt, permData);
            modObj["isEdit"] = hasEditPermission(data.details[i].createdAt, permData);
            modObj["check"] = false;
            modObj["tick"] = false;
            modObj["showHide"] = false;
            respData.list.push(modObj);
        }
    }
    return (respData);
}

hasEditPermission = (createdAt, permData) => {
    if (permData) {
        if (permData.length > 0) {
            const createDate = new Date(createdAt);
            const currentDate = new Date();
            const differenceInMs = currentDate - createDate;
            const differenceInHours = differenceInMs / (1000 * 60 * 60); // Convert milliseconds to hours
            if (differenceInHours < (permData[0].days > 0 ? permData[0].days * 24 : 0)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

export function modSalesPermData(data) {
    let respArr = []
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {};
            if (data[i].days == null || data[i].days == undefined || data[i].days.length == 0) {
                modObj["days"] = 1
            } else {
                modObj["days"] = data[i].days;
            }
            respArr.push(modObj);
        }
    }
    return respArr
}

function getTotalMtd(arr) {
    let str = 0
    for (let i = 0; i < arr.length; i++) {
        str = str + arr[i].productQuantity
    }
    return str
}

function getTopLevelProduct(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].slNo == 1) {
            str = arr[i].name
        }
    }
    return str
}

function getLeafLevelProduct(arr) {
    let str = "";
    const highestSlNoObject = arr.reduce((max, item) => item.slNo > max.slNo ? item : max, arr[0]);
    str = highestSlNoObject.name
    return str
}

export function validateData(data) {
    let errorCount = 0;

    if (data == undefined || data == null || data.length == 0) {
        Toaster.ShortCenterToaster("Please enter Quantity !");
        errorCount++;
    }

    if (errorCount == 0) {
        return true;
    } else {
        return false;
    }
}