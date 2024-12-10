import { App_uri } from "../../services/config";

export function modRecentLiftingData(data) {
    let respData = { list: [], totalMtd: 0, count: 0 };
    if (data.details) {
        // let total = getTotalMtd(data)
        // respData.totalMtd = total;
        respData.count = data.count;
        for (let i = 0; i < data.details.length; i++) {
            let modObj = {};
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





            modObj["check"] = false;
            modObj["tick"] = false;
            modObj["showHide"] = false;
            respData.list.push(modObj);
        }
    }
    return (respData);
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

export function modMonthlyPointData(data) {
    let respArr = [];
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {};
            if (data[i].month == undefined || data[i].month == null) {
                modObj["x"] = "";
            } else {
                modObj["x"] = data[i].month;
            }
            if (data[i].point == undefined || data[i].point == null) {
                modObj["y"] = "";
            } else {
                modObj["y"] = parseFloat((data[i].point).toFixed(2));
            }
            respArr.push(modObj);
        }
    }
    return respArr;
}