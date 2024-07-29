import { DateConvert } from "../../services/common-view-function";
import { App_uri } from "../../services/config";

export function customerModifyData(data) {
    var respData = { "totalCount": 0, "customerList": [] };
    if (data) {
        let customer = data.response;
        if (customer && customer.length > 0) {
            for (let i = 0; i < customer.length; i++) {
                let modObj = {};
                if (customer[i].customerId == undefined || customer[i].customerId == null) {
                    modObj["id"] = "";
                } else {
                    modObj["id"] = customer[i].customerId;
                }
                if (customer[i].address == undefined || customer[i].address == null) {
                    modObj["address"] = "";
                } else {
                    modObj["address"] = customer[i].address;
                }
                if (customer[i].custBusinessName == undefined || customer[i].custBusinessName == null || customer[i].custBusinessName.length == 0) {
                    modObj["custBusinessName"] = "";
                } else {
                    modObj["custBusinessName"] = customer[i].custBusinessName;
                }
                if (customer[i].contactTypeName == undefined || customer[i].contactTypeName == null || customer[i].contactTypeName.length == 0) {
                    modObj["contactTypeName"] = "";
                } else {
                    modObj["contactTypeName"] = customer[i].contactTypeName;
                }
                if (customer[i].count == undefined || customer[i].count == null) {
                    modObj["count"] = "";
                } else {
                    modObj["count"] = customer[i].count;
                }
                if (customer[i].lastDate == undefined || customer[i].lastDate == null || customer[i].lastDate.length == 0) {
                    modObj["lastDate"] = "";
                } else {
                    modObj["lastDate"] = DateConvert.getDayMonthYearName(customer[i].lastDate);
                }
                if (customer[i].profilePic == undefined || customer[i].profilePic == null) {
                    modObj["profilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + "/images/business.jpg";
                } else {
                    modObj["profilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + customer[i].profilePic;
                }
                if (customer[i].contactTypeId == undefined || customer[i].contactTypeId == null) {
                    modObj["contactTypeId"] = "";
                } else {
                    modObj["contactTypeId"] = customer[i].contactTypeId;
                }
                if (customer[i].name == undefined || customer[i].name == null) {
                    modObj["ownerName"] = "";
                } else {
                    modObj["ownerName"] = customer[i].name;
                }

                // if (customer[i].location == undefined || customer[i].location == null) {
                //     modObj["product"] = "";
                // } else {
                //     modObj["product"] = modProductObj(data[i].location);
                // }



                modObj["check"] = false;
                modObj["tick"] = false;
                modObj["showHide"] = false;
                respData.customerList.push(modObj);
            }
        }
    }
    return (respData);
}


function modProductObj(data) {
    let modObj = {}
    for (let i = 0; i < data.length; i++) {
        if (data[i].slNo == 1) {
            modObj["productName"] = data[i].name;
        }
        data.reduce((prev, current) => {
            let brandName = (prev.slNo > current.slNo) ? prev : current;
            modObj["brandName"] = brandName.name;
        });
    }
    // return modObj;
}

export function modifyContactTypeArr(data) {
    let sortedArr = data.sort((a, b) => a.seqno - b.seqno); // Sort the array based on seqno
    let respArr = [];

    for (let i = 0; i < sortedArr.length; i++) {
        let modObj = {};
        modObj["id"] = sortedArr[i].contactTypeId;
        modObj["name"] = sortedArr[i].contactTypeName;
        modObj["mstSlNo"] = sortedArr[i].mstSlNo;
        modObj["customerAccessType"] = sortedArr[i].customerAccessType;
        modObj["check"] = i == 0 ? true : false;

        respArr.push(modObj); // Push objects with non-zero seqno to respArr
    }

    return respArr;
}

export function modParentCustomerData(data) {
    let modObj = {}
    if (data) {
        if (data.customerId == undefined || data.customerId == null || data.customerId.length == 0) {
            modObj["id"] = "";
        } else {
            modObj["id"] = data.customerId;
        }
        if (data.customerName == undefined || data.customerName == null || data.customerName.length == 0) {
            modObj["name"] = "";
        } else {
            modObj["name"] = data.customerName;
        }
        if (data.custBusinessName == undefined || data.custBusinessName == null || data.custBusinessName.length == 0) {
            modObj["custBusinessName"] = "";
        } else {
            modObj["custBusinessName"] = data.custBusinessName;
        }
        if (data.address == undefined || data.address == null || data.address.length == 0) {
            modObj["address"] = "";
        } else {
            modObj["address"] = data.address;
        }
        if (data.profilePic == undefined || data.profilePic == null || data.profilePic.length == 0) {
            modObj["profilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + "/images/business.jpg";
        } else {
            modObj["profilePic"] = App_uri.AWS_S3_IMAGE_VIEW_URI + data.profilePic;
        }
        if (data.contactTypeId == undefined || data.contactTypeId == null || data.contactTypeId.length == 0) {
            modObj["contactTypeId"] = "";
        } else {
            modObj["contactTypeId"] = data.contactTypeId;
        }
        if (data.contactTypeName == undefined || data.contactTypeName == null || data.contactTypeName.length == 0) {
            modObj["contactTypeName"] = "";
        } else {
            modObj["contactTypeName"] = data.contactTypeName;
        }
        if (data.count == undefined || data.count == null || data.count.length == 0) {
            modObj["count"] = "";
        } else {
            modObj["count"] = data.count;
        }
        if (data.lastDate == undefined || data.lastDate == null || data.lastDate.length == 0) {
            modObj["lastDate"] = "";
        } else {
            modObj["lastDate"] = DateConvert.getDayMonthYearName(data.lastDate);
        }
    }
    return modObj;
}