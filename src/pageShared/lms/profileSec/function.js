import { StorageDataModification, Toaster } from "../../../services/common-view-function";

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

export function modCustDoc(data) {
    let respArr = [];
    for (let i = 0; i < data.length; i++) {
        let modObj = {};
        if (data[i].documentId == undefined || data[i].documentId == null || data[i].documentId.length == 0) {
            modObj["documentId"] = "";
        } else {
            modObj["documentId"] = data[i].documentId;
        }
        if (data[i].docTypeId == undefined || data[i].docTypeId == null || data[i].docTypeId.length == 0) {
            modObj["docTypeId"] = "";
        } else {
            modObj["docTypeId"] = data[i].docTypeId;
        }
        if (data[i].docNumber == undefined || data[i].docNumber == null || data[i].docNumber.length == 0) {
            modObj["documentNumber"] = "";
        } else {
            modObj["documentNumber"] = data[i].docNumber;
        }
        if (data[i].documentName == undefined || data[i].documentName == null || data[i].documentName.length == 0) {
            modObj["docName"] = "";
        } else {
            modObj["docName"] = data[i].documentName;
        }
        if (data[i].documentName == undefined || data[i].documentName == null || data[i].documentName.length == 0) {
            modObj["docImg"] = "";
        } else {
            modObj["docImg"] = data[i].documentName;
        }
        if (data[i].documentTypeName == undefined || data[i].documentTypeName == null || data[i].documentTypeName.length == 0) {
            modObj["fileType"] = "";
        } else {
            modObj["fileType"] = data[i].documentTypeName;
        }
        if (data[i].createdAt == undefined || data[i].createdAt == null || data[i].createdAt.length == 0) {
            modObj["createdAt"] = "";
        } else {
            modObj["createdAt"] = data[i].createdAt;
        }
        if (data[i].createdTime == undefined || data[i].createdTime == null || data[i].createdTime.length == 0) {
            modObj["createdTime"] = "";
        } else {
            modObj["createdTime"] = data[i].createdTime;
        }
        if (data[i].docSubmittedBy == undefined || data[i].docSubmittedBy == null || data[i].docSubmittedBy.length == 0) {
            modObj["docSubmittedBy"] = "";
        } else {
            modObj["docSubmittedBy"] = data[i].docSubmittedBy;
        }
        modObj["docType"] = data[i].documentName.split('.').pop()

        modObj["docFileName"] = data[i].documentName
        respArr.push(modObj);
    }
    return respArr;
}

export async function modDocArr(data) {
    let userInfo = await StorageDataModification.userCredential({}, "get");
    let respArr = [];
    for (let i = 0; i < data.length; i++) {
        let modObj = {};
        if (data[i].docTypeId == undefined || data[i].docTypeId == null || data[i].docTypeId.length == 0) {
            modObj["docTypeId"] = "";
        } else {
            modObj["docTypeId"] = data[i].docTypeId;
        }
        if (data[i].docFileName == undefined || data[i].docFileName == null || data[i].docFileName.length == 0) {
            modObj["docFileName"] = "";
        } else {
            modObj["docFileName"] = data[i].docFileName;
        }
        if (data[i].documentNumber == undefined || data[i].documentNumber == null || data[i].documentNumber.length == 0) {
            modObj["docNumber"] = "";
        } else {
            modObj["docNumber"] = data[i].documentNumber;
        }
        modObj["createdBy"] = userInfo.userId;
        modObj["createdAt"] = "";
        modObj["fileName"] = "";
        modObj["createdTime"] = "";
        modObj["orgFileName"] = data[i].docName;
        respArr.push(modObj);
    }
    return respArr;
}

export function validateData(data) {
    let errCounter = 0,
        status = false;

    if (data.custDocArray == undefined || data.custDocArray == null || data.custDocArray.length == 0) {
        Toaster.ShortCenterToaster("Please Selet atleast one document !")
        errCounter++
    }

    if (errCounter == 0) {
        status = true;

    }
    return status
}