import { StorageDataModification, Toaster } from "../../services/common-view-function";

export function modifyResData(data) {
    if (data) {
        if (data.address == undefined || data.address == null || data.address.length == 0) {
            data.address = "";
        } else {
            data.address = data.address;
        }
        if (data.countryName == undefined || data.countryName == null || data.countryName.length == 0) {
            data.countryName = "";
        } else {
            data.countryName = data.countryName;
        }
        if (data.createdAt == undefined || data.createdAt == null || data.createdAt.length == 0) {
            data.createdAt = "";
        } else {
            data.createdAt = data.createdAt;
        }
        if (data.levelName == undefined || data.levelName == null || data.levelName.length == 0) {
            data.levelName = "Level 0";
        } else {
            data.levelName = data.levelName;
        }
        if (data.pointsEarned == undefined || data.pointsEarned == null || data.pointsEarned.length == 0) {
            data.pointsEarned = "0";
        } else {
            data.pointsEarned = data.pointsEarned;
        }

        if (data.designationName == undefined || data.designationName == null || data.designationName.length == 0) {
            data.designationName = "";
        } else {
            data.designationName = data.designationName;
        }
        if (data.districtName == undefined || data.districtName == null || data.districtName.length == 0) {
            data.districtName = "";
        } else {
            data.districtName = data.districtName;
        }
        if (data.erpCode == undefined || data.erpCode == null || data.erpCode.length == 0) {
            data.erpCode = "N/A";
        } else {
            data.erpCode = data.erpCode;
        }
        if (data.email == undefined || data.email == null || data.email.length == 0) {
            data.email = "N/A";
        } else {
            data.email = data.email;
        }
        if (data.name == undefined || data.name == null || data.name.length == 0) {
            data.name = "";
        } else {
            data.name = data.name;
        }
        if (data.phone == undefined || data.phone == null || data.phone.length == 0) {
            data.phone = "";
        } else {
            data.phone = data.phone;
        }
        if (data.profileImgUrl == undefined || data.profileImgUrl == null || data.profileImgUrl.length == 0) {
            data.profileImgUrl = "";
        } else {
            data.profileImgUrl = data.profileImgUrl;
        }
        if (data.roleName == undefined || data.roleName == null || data.roleName.length == 0) {
            data.roleName = "";
        } else {
            data.roleName = data.roleName;
        }
        // if (data.hmUpperNodes == undefined || data.hmUpperNodes == null || data.hmUpperNodes.length == 0) {
        //     data.hmUpperNodes["State"] = "";
        // } else {
        //     data.hmUpperNodes["State"] = data.hmUpperNodes.State;
        // }
        // if (data.hmUpperNodes == undefined || data.hmUpperNodes == null || data.hmUpperNodes.length == 0) {
        //     data.hmUpperNodes["District"] = "";
        // } else {
        //     data.hmUpperNodes["District"] = data.hmUpperNodes.District;
        // }
        if (data.userId == undefined || data.userId == null || data.userId.length == 0) {
            data.userId = "";
        } else {
            data.userId = data.userId;
        }
        if (data.username == undefined || data.username == null || data.username.length == 0) {
            data.username = "";
        } else {
            data.username = data.username;
        }
        if (data.custBusinessName == undefined || data.custBusinessName == null || data.custBusinessName.length == 0) {
            data.custBusinessName = "";
        } else {
            data.custBusinessName = data.custBusinessName;
        }

        if (data.hmName == undefined || data.hmName == null || data.hmName.length == 0) {
            data.hmName = "";
        } else {
            data.hmName = getLocation(data.hmName);
        }
    }
    return (data);
}

function getLocation(item) {
    let text = "";
    if (item.length > 0) {
        text = item.split(",")
    }
    return text;
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
        modObj["createdTime"] = "";
        modObj["orgFileName"] = data[i].docName;
        respArr.push(modObj);
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