import { DateConvert, Toaster } from "../../services/common-view-function";
import { App_uri } from "../../services/config";

export function modifyLocationMappedData(mainData, listData) {
    let finalData = [];
    if (mainData && mainData.length > 0) {
        const sortedLocationMapData = mainData.sort((a, b) => a.SlNo - b.SlNo);
        finalData = sortedLocationMapData.map(mainItem => {
            const matchingListItems = listData.filter(listItem => listItem.slNo === mainItem.SlNo);
            return {
                ...mainItem,
                fileItem: matchingListItems
            };
        });
    }
    return finalData;
}

// for calculate product rate
export function onCalculateProductRate(item, profileData) {
    let tempRate = 0;
    let validCheck = false;
    // for product rate (customerType == "Primary" then PTD but retailer PTR)
    if (item.productAttributes.PTR) {
        tempRate = (parseFloat(item.productAttributes.PTR)).toFixed(2);
        validCheck = true;
    }
    if (profileData.customerAccessTypeName == "Primary") {
        if (item.productAttributes.PTD) {
            tempRate = (parseFloat(item.productAttributes.PTD)).toFixed(2);
            validCheck = true;
        }
    }
    return { rate: tempRate, validCheck: validCheck };
}

export function modifyProfileData(objData) {
    // transactionType == 3 -> primary, 2 -> secondary
    // objData.totalItemCount
    let obj = {
        cartCount: (objData.totalItemCount == null || objData.totalItemCount == undefined) ? 0 : objData.totalItemCount,
        title: objData.customerName == null || objData.customerName == undefined ? "" : objData.customerName,
        profileImg: objData.profilePic == null || objData.profilePic == undefined ? "" : objData.profilePic,
        userId: objData.customerId == null || objData.customerId == undefined ? "" : objData.customerId,
        customerType: objData.custType == null || objData.custType == undefined ? "" : objData.custType,
    }

    return obj
}

export function validData(arr) {
    let errCount = 0,
        status = false;
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].invoiceId.length == 0) {
                Toaster.ShortCenterToaster("Please add Invoice Id !")
                errCount++
            } else if (arr[i].invoiceDateObj.invoiceDate.length == 0) {
                Toaster.ShortCenterToaster("Please add Invoice Date !")
                errCount++
            } else if (arr[i].productArr.length == 0) {
                Toaster.ShortCenterToaster("Please Add a Product !")
                errCount++
            }
            // else if (arr[i].profileImg.length == 0) {
            //     Toaster.ShortCenterToaster("Please Upload Invoice Image !")
            //     errCount++
            // }
        }
    }
    if (errCount == 0) {
        status = true
    }
    return status
}

export function modInvoiceData(arrData) {
    let respArr = [];

    if (arrData) {
        for (let i = 0; i < arrData.length; i++) {
            let modObj = {}
            modObj["invoiceNumber"] = arrData[i].invoiceId
            modObj["salesDate"] = DateConvert.viewDateFormatYYYYMMDD(arrData[i].invoiceDateObj.rawDate)
            modObj["invoicePath"] = arrData[i].profileImg
            modObj["offerId"] =  Object.keys(arrData[i].selectedOfferObj).length > 0 ? arrData[i].selectedOfferObj.id : "0"
            modObj["referedBy"] = Object.keys(arrData[i].selectedRefferedBy).length > 0 ? arrData[i].selectedRefferedBy.id : "0"
            modObj["products"] = arrData[i].productArr

            respArr.push(modObj)

        }
    }
    return respArr
}

export function modOfferData(arr) {
    let respData = []
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].id == undefined || arr[i].id == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].id
            }
            if (arr[i].offerImagePath == undefined || arr[i].offerImagePath == null) {
                modObj["image"] = ""
            } else {
                modObj["image"] = App_uri.LMS_IMAGE_VIEW_URI + arr[i].offerImagePath
            }
            if (arr[i].offerCode == undefined || arr[i].offerCode == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = arr[i].offerCode
            }

            respData.push(modObj)
        }
    }

    return respData
}
