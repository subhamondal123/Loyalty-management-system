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