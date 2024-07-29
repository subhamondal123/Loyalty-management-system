import { DateConvert, Toaster } from "../../services/common-view-function";

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

export function modDocumentArr(arr, quantity, unitId, date, selectedProductData) {
    let arrData = [];
    for (let i = 0; i < arr.length; i++) {
        let modObj = {
            "invoiceNumber": "",
            "salesDate": DateConvert.viewDateFormatYYYYMMDD(date),
            "invoicePath": arr[i].docName,
            "referedBy": "0",
            "offerId": "0",
            "products": modProductData(arr, quantity, unitId, date, selectedProductData)
        }
        arrData.push(modObj);
    }
    return arrData;
}

function modProductData(arr, quantity, unitId, date, selectedProductData) {
    let arrData = [];
    let modObj = {
        "productId": selectedProductData.hierarchyDataId,
        "productQuantity": quantity,
        "productUnitId": unitId,
        "productPrice": "0"
    }
    arrData.push(modObj);
    return arrData;
}

export function modUnitArr(arr) {
    let arrData = [];
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {}
            if (arr[i].unitId == undefined || arr[i].unitId == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = arr[i].unitId
            }
            if (arr[i].unitShort == undefined || arr[i].unitShort == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = arr[i].unitShort
            }
            arrData.push(modObj)
        }
    }
    return arrData
}


export function validateData(data) {
    let errCounter = 0,
        status = false;
    if (data.locationObj.hierarchyTypeId == undefined || data.locationObj.hierarchyTypeId == null || data.locationObj.hierarchyTypeId.length == 0) {
        Toaster.ShortCenterToaster("Please select Product !")
        errCounter++
    } else if (data.quantity == undefined || data.quantity == null || data.quantity.length == 0) {
        Toaster.ShortCenterToaster("Please Enter Quantity !")
        errCounter++
    }
    else if (data.selectedUnit.id == undefined || data.selectedUnit.id == null || data.selectedUnit.id.length == 0) {
        Toaster.ShortCenterToaster("Please Selet Unit !")
        errCounter++
    }
    else if (data.fromDateObj.fromDate == undefined || data.fromDateObj.fromDate == null || data.fromDateObj.fromDate.length == 0) {
        Toaster.ShortCenterToaster("Please enter date !")
        errCounter++
    }
    // else if (data.documentArr == undefined || data.documentArr == null || data.documentArr.length == 0) {
    //     Toaster.ShortCenterToaster("Please upload document !")
    //     errCounter++
    // }



    if (errCounter == 0) {
        status = true;

    }
    return status
}

export function modAttributeData(data) {
    let arrData = [];
    for (let i = 0; i < data.length; i++) {
        let modObj = {
            "id": data[i].attributeDataValueId,
            "name": data[i].attributeValue,
        }
        arrData.push(modObj);
    }
    return arrData;
}

export function decimalUpto(value, place) {
    let regex = new RegExp(`^\\d*\\.?\\d{0,${place}}$`);
    return regex.test(value) || value === '';
}