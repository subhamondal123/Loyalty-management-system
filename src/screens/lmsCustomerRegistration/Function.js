import { Toaster } from "../../services/common-view-function";
import { DataValidator } from "../../validators";

export function modifyCustomerTypeArr(data) {
    let respArr = [];
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {}
            modObj["id"] = data[i].contactTypeId
            modObj["name"] = data[i].contactTypeName;
            modObj["check"] = false;

            respArr.push(modObj)
        }
    }
    return respArr;
}

export function validateData(data) {
    let errCounter = 0,
        status = false;

    if (data.customerTypeId == undefined || data.customerTypeId == null || data.customerTypeId.length == 0) {
        Toaster.ShortCenterToaster("Please Selet User Type !")
        errCounter++
    }
    else if (DataValidator.mobileNumberValidator(data.phone) == false) {
        // Toaster.ShortCenterToaster("Please Enter  Contact Number");
        errCounter++;
    } else if (data.firstName.length == 0) {
        Toaster.ShortCenterToaster("Please Enter Customer Name !")
        errCounter++
    }
    //  else if (data.customerTypeId == 104 && data.erpCode.length == 0) {
    //     Toaster.ShortCenterToaster("Please Enter ERP Code !")
    //     errCounter++
    // }
    else if (data.custBusinessName.length == 0) {
        Toaster.ShortCenterToaster("Please Enter Customer Business Name!")
        errCounter++
    }
    else if (data.locationObj == undefined || data.locationObj == null || data.locationObj.length == 0) {
        Toaster.ShortCenterToaster("Please Selet Location !")
        errCounter++
    }
    else if (data.custDocArray == undefined || data.custDocArray == null || data.custDocArray.length == 0) {
        Toaster.ShortCenterToaster("Please Selet Document Type !")
        errCounter++
    }



    if (errCounter == 0) {
        status = true;

    }
    return status
}

export function modifyLocationMappedData(mainData, listData) {

    let finalData = [];
    if (mainData && mainData.length > 0) {
        const sortedLocationMapData = mainData.sort((a, b) => a.SlNo - b.SlNo);
        finalData = sortedLocationMapData.map(mainItem => {
            const matchingListItems = listData.filter(listItem => listItem.slNo == mainItem.SlNo);
            return {
                ...mainItem,
                fileItem: matchingListItems
            };
        });
    }
    return finalData;
}


export function modDocTypeData(data) {
    let respArr = [];
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {}
            modObj["id"] = data[i].docTypeId
            modObj["name"] = data[i].documentTypeName;

            respArr.push(modObj)
        }
    }
    return respArr;
}