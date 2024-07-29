import { Toaster } from "../../services/common-view-function";
import { validate as validateEmail } from 'email-validator';

export function modifyDataBeforeLogin(data) {

    let resp = {
        isValidated: false,
        stateObj: {
            userIdError: false,
            passwordError: false
        }
    }
    let errCounter = 0;
    if (data.userId == undefined || data.userId == null || data.userId.length == 0) {
        Toaster.ShortCenterToaster("Please enter username, email or phone no")
        resp.stateObj.userIdError = true;
        errCounter++;
    }
    if (errCounter == 0) {
        resp.isValidated = true;
    }

    return resp;
}

export function modifyCountryArrData(countryArr) {
    let modArrData = [];
    if (countryArr && countryArr.length > 0) {
        for (let i = 0; i < countryArr.length; i++) {
            modArrData.push({
                id: countryArr[i].countryId,
                name: countryArr[i].countryName
            })
        }
    }
    return modArrData;
}

// for emmail validate
export function emailModValidator(email) {
    if (email === undefined || email === null) {
        return false;
    } else {
        if (email.length === 0) {
            return false;
        } else {
            if (validateEmail(email)) {   // validate the email by email-validator module
                return true;
            } else {
                return false;
            }
        }
    }
};

export function modLoginData(data, type) {
    let modData = data.response[0];
    if (modData.firstName == undefined || modData.firstName == null) {
        modData.firstName = "";
    } else {
        modData.firstName = modData.firstName;
    }
    if (modData.lastName == undefined || modData.lastName == null) {
        modData.lastName = "";
    } else {
        modData.lastName = modData.lastName;
    }
    if (modData.email == undefined || modData.email == null) {
        modData.email = "";
    } else {
        modData.email = modData.email;
    }
    if (modData.password == undefined || modData.password == null) {
        modData.password = "";
    } else {
        modData.password = modData.password;
    }
    if (modData.username == undefined || modData.username == null) {
        modData.username = "";
    } else {
        modData.username = modData.username;
    }
    if (modData.userType == undefined || modData.userType == null) {
        modData.userType = "";
    } else {
        modData.userType = modData.userType;
    }
    if (modData.profileImgUrl == undefined || modData.profileImgUrl == null) {
        modData.profileImgUrl = "";
    } else {
        modData.profileImgUrl = modData.profileImgUrl;
    }
    if (modData.clientId == undefined || modData.clientId == null) {
        modData.clientId = "";
    } else {
        modData.clientId = modData.clientId;
    }
    if (modData.userId == undefined || modData.userId == null) {
        modData.userId = "";
    } else {
        modData.userId = modData.userId;
    }
    if (modData.createdAt == undefined || modData.createdAt == null) {
        modData.createdAt = "";
    } else {
        modData.createdAt = modData.createdAt;
    }
    if (modData.token == undefined || modData.token == null) {
        modData.token = "";
    } else {
        modData.token = modData.token;
    }
    if (modData.locationData == undefined || modData.locationData == null) {
        modData.locationData = [];
    } else {
        modData.locationData = modifyLocationData(modData.locationData);
    }
    if (modData.clientSettings == undefined || modData.clientSettings == null) {
        modData.clientSettings = [];
    } else {
        modData.clientSettings = modifyClientSettings(modData.clientSettings);
    }
    if (modData.moduleDetails == undefined || modData.moduleDetails == null) {
        modData.moduleDetails = [];
    } else {
        modData.moduleDetails = modifyModuleDetails(modData.moduleDetails);
    }
    if (modData.countryId == undefined || modData.countryId == null) {
        modData.countryId = "";
    } else {
        modData.countryId = modData.countryId;
    }
    if (modData.countryName == undefined || modData.countryName == null) {
        modData.countryName = "";
    } else {
        modData.countryName = modData.countryName;
    }
    if (modData.stateId == undefined || modData.stateId == null) {
        modData.stateId = "";
    } else {
        modData.stateId = modData.stateId;
    }
    if (modData.stateName == undefined || modData.stateName == null) {
        modData.stateName = "";
    } else {
        modData.stateName = modData.stateName;
    }
    if (modData.districtId == undefined || modData.districtId == null) {
        modData.districtId = "";
    } else {
        modData.districtId = modData.districtId;
    }
    if (modData.districtName == undefined || modData.districtName == null) {
        modData.districtName = "";
    } else {
        modData.districtName = modData.districtName;
    }
    if (modData.zoneId == undefined || modData.zoneId == null) {
        modData.zoneId = "";
    } else {
        modData.zoneId = modData.zoneId;
    }
    if (modData.zoneName == undefined || modData.zoneName == null) {
        modData.zoneName = "";
    } else {
        modData.zoneName = modData.zoneName;
    }
    if (modData.designationId == undefined || modData.designationId == null) {
        modData.designationId = "";
    } else {
        modData.designationId = modData.designationId;
    }
    if (modData.lastLevelLocations == undefined || modData.lastLevelLocations == null) {
        modData.lastLevelLocations = {};
    } else {
        modData.lastLevelLocations = modData.lastLevelLocations;
    }
    if (modData.clientSettings == undefined || modData.clientSettings == null) {
        modData["clientLogo"] = [];
    } else {
        modData["clientLogo"] = getClientLogo(modData.clientSettings);
    }
    if (modData.clientSettings == undefined || modData.clientSettings == null) {
        modData["orderOTPVerification"] = [];
    } else {
        modData["orderOTPVerification"] = getClientOtpVirification(modData.clientSettings);
    }

    modData["moduleType"] = "LMS"
    modData["loginType"] = type
    return modData;
}

function getFirstName(name) {
    let txt = name.split(" ")
    let firstName = txt[0]
    return firstName
}

function getLastName(name) {
    let txt = name.split(" ")
    let lastName = txt[1]
    return lastName
}

export function modCustomerLoginData(data, type) {
    let modData = data.response[0];
    let modObj = {};
    if (modData.customerName == undefined || modData.customerName == null) {
        modObj["firstName"] = "";
        modObj["lastName"] = "";
    } else {
        modObj["firstName"] = getFirstName(modData.customerName);
        modObj["lastName"] = getLastName(modData.customerName);
    }
    if (modData.email == undefined || modData.email == null) {
        modObj["email"] = "";
    } else {
        modObj["email"] = modData.email;
    }
    if (modData.phoneNumber == undefined || modData.phoneNumber == null) {
        modObj["phoneNumber"] = "";
    } else {
        modObj["phoneNumber"] = modData.phoneNumber;
    }

    if (modData.password == undefined || modData.password == null) {
        modObj["password"] = "";
    } else {
        modObj["password"] = modData.password;
    }
    if (modData.username == undefined || modData.username == null) {
        modObj["username"] = "";
    } else {
        modObj["username"] = modData.username;
    }
    if (modData.userType == undefined || modData.userType == null) {
        modObj["userType"] = "";
    } else {
        modObj["userType"] = modData.userType;
    }
    if (modData.profilePic == undefined || modData.profilePic == null) {
        modObj["profileImgUrl"] = "";
    } else {
        modObj["profileImgUrl"] = modData.profilePic;
    }
    if (modData.clientId == undefined || modData.clientId == null) {
        modObj["clientId"] = "";
    } else {
        modObj["clientId"] = modData.clientId;
    }
    if (modData.customerId == undefined || modData.customerId == null) {
        modObj["userId"] = "";
    } else {
        modObj["userId"] = modData.customerId;
    }
    if (modData.customerId == undefined || modData.customerId == null) {
        modObj["customerId"] = "";
    } else {
        modObj["customerId"] = modData.customerId;
    }
    if (modData.createdAt == undefined || modData.createdAt == null) {
        modObj["createdAt"] = "";
    } else {
        modObj["createdAt"] = modData.createdAt;
    }
    if (modData.token == undefined || modData.token == null) {
        modObj["token"] = "";
    } else {
        modObj["token"] = modData.token;
    }
    if (modData.locationData == undefined || modData.locationData == null) {
        modObj["lastLevelLocations"] = {};
    } else {
        modObj["lastLevelLocations"] = modData.locationData[0];
    }
    // if (modData.clientSettings == undefined || modData.clientSettings == null) {
    //     modObj["clientSettings"] = [];
    // } else {
    //     modObj["clientSettings"] = modifyClientSettings(modData.clientSettings);
    // }
    // if (modData.moduleDetails == undefined || modData.moduleDetails == null) {
    //     modObj["moduleDetails"] = [];
    // } else {
    //     modObj["moduleDetails"] = modifyModuleDetails(modData.moduleDetails);
    // }
    if (modData.countryId == undefined || modData.countryId == null) {
        modObj["countryId"] = "";
    } else {
        modObj["countryId"] = modData.countryId;
    }
    if (modData.countryName == undefined || modData.countryName == null) {
        modObj["countryName"] = "";
    } else {
        modObj["countryName"] = modData.countryName;
    }
    if (modData.stateId == undefined || modData.stateId == null) {
        modObj["stateId"] = "";
    } else {
        modObj["stateId"] = modData.stateId;
    }
    if (modData.stateName == undefined || modData.stateName == null) {
        modObj["stateName"] = "";
    } else {
        modObj["stateName"] = modData.stateName;
    }
    if (modData.districtId == undefined || modData.districtId == null) {
        modObj["districtId"] = "";
    } else {
        modObj["districtId"] = modData.districtId;
    }
    if (modData.districtName == undefined || modData.districtName == null) {
        modObj["districtName"] = "";
    } else {
        modObj["districtName"] = modData.districtName;
    }
    if (modData.zoneId == undefined || modData.zoneId == null) {
        modObj["zoneId"] = "";
    } else {
        modObj["zoneId"] = modData.zoneId;
    }
    if (modData.zoneName == undefined || modData.zoneName == null) {
        modObj["zoneName"] = "";
    } else {
        modObj["zoneName"] = modData.zoneName;
    }
    if (modData.contactTypeId == undefined || modData.contactTypeId == null) {
        modObj["designationId"] = "";
    } else {
        modObj["designationId"] = modData.contactTypeId;
    }
    if (modData.contactTypeId == undefined || modData.contactTypeId == null) {
        modObj["roleId"] = "";
    } else {
        modObj["roleId"] = modData.contactTypeId;
    }
    if (modData.contactTypeId == undefined || modData.contactTypeId == null) {
        modObj["contactTypeId"] = "";
    } else {
        modObj["contactTypeId"] = modData.contactTypeId;
    }
    if (modData.contactTypeName == undefined || modData.contactTypeName == null) {
        modObj["contactTypeName"] = "";
    } else {
        modObj["contactTypeName"] = modData.contactTypeName;
    }

    if (modData.countriesData == undefined || modData.countriesData == null) {
        modObj["mappedCountires"] = [];
    } else {
        modObj["mappedCountires"] = modData.countriesData;
    }

    if (modData.mappedMaxLevelForProducts == undefined || modData.mappedMaxLevelForProducts == null) {
        modObj["mappedMaxLevelForProducts"] = [];
    } else {
        modObj["mappedMaxLevelForProducts"] = modData.mappedMaxLevelForProducts;
    }
    if (modData.locationMasterHierarchyTypes == undefined || modData.locationMasterHierarchyTypes == null) {
        modObj["locationMasterHierarchyTypes"] = [];
    } else {
        modObj["locationMasterHierarchyTypes"] = modData.locationMasterHierarchyTypes;
    }
    if (modData.productMasterHierarchyTypes == undefined || modData.productMasterHierarchyTypes == null) {
        modObj["productMasterHierarchyTypes"] = [];
    } else {
        modObj["productMasterHierarchyTypes"] = modData.productMasterHierarchyTypes;
    }
    if (modData.mappedHighersLevelProducts == undefined || modData.mappedHighersLevelProducts == null) {
        modObj["mappedHighersLevelProducts"] = [];
    } else {
        modObj["mappedHighersLevelProducts"] = modData.mappedHighersLevelProducts;
    }
    if (modData.mstSlNo == undefined || modData.mstSlNo == null) {
        modObj["mstSlNo"] = "";
    } else {
        modObj["mstSlNo"] = modData.mstSlNo;
    }
    if (modData.custBusinessName == undefined || modData.custBusinessName == null) {
        modObj["custBusinessName"] = "";
    } else {
        modObj["custBusinessName"] = modData.custBusinessName;
    }
    if (modData.address == undefined || modData.address == null) {
        modObj["address"] = "";
    } else {
        modObj["address"] = modData.address;
    }

    modObj["moduleType"] = "LMS"

    modObj["loginType"] = type
    return modObj;
}

function getClientLogo(arr) {
    let clientLogo = "";
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].settingsType == "companyLogo") {
                clientLogo = arr[i].settingsValue
            }
        }
    }
    return clientLogo;
}

function getClientOtpVirification(arr) {
    let clientLogo = "";
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].settingsType == "orderOTPVerification") {
                clientLogo = arr[i].settingsValue
            }
        }
    }
    return clientLogo;
}

function modifyClientSettings(data) {
    let respData = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {
                "settingsType": "",
                "settingsValue": ""
            };
            if (data[i].settingsType == undefined || data[i].settingsType == null) {
                modObj["settingsType"] = "";
            } else {
                modObj["settingsType"] = data[i].settingsType;
            }
            if (data[i].settingsValue == undefined || data[i].settingsValue == null) {
                modObj["settingsValue"] = "";
            } else {
                modObj["settingsValue"] = data[i].settingsValue;
            }
            respData.push(modObj);
        }
    }

    return respData;
}

function modifyLocationData(data) {
    let respData = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {
                "countryId": "",
                "countryName": "",
                "stateId": "",
                "stateName": "",
                "districtId": "",
                "districtName": "",
                "zoneId": "",
                "zoneName": ""
            };
            if (data[i].countryId == undefined || data[i].countryId == null) {
                modObj["countryId"] = "";
            } else {
                modObj["countryId"] = data[i].countryId;
            }
            if (data[i].countryName == undefined || data[i].countryName == null) {
                modObj["countryName"] = "";
            } else {
                modObj["countryName"] = data[i].countryName;
            }
            if (data[i].stateId == undefined || data[i].stateId == null) {
                modObj["stateId"] = "";
            } else {
                modObj["stateId"] = data[i].stateId;
            }
            if (data[i].stateName == undefined || data[i].stateName == null) {
                modObj["stateName"] = "";
            } else {
                modObj["stateName"] = data[i].stateName;
            }
            if (data[i].districtId == undefined || data[i].districtId == null) {
                modObj["districtId"] = "";
            } else {
                modObj["districtId"] = data[i].districtId;
            }
            if (data[i].districtName == undefined || data[i].districtName == null) {
                modObj["districtName"] = "";
            } else {
                modObj["districtName"] = data[i].districtName;
            }
            if (data[i].zoneId == undefined || data[i].zoneId == null) {
                modObj["zoneId"] = "";
            } else {
                modObj["zoneId"] = data[i].zoneId;
            }
            if (data[i].zoneName == undefined || data[i].zoneName == null) {
                modObj["zoneName"] = "";
            } else {
                modObj["zoneName"] = data[i].zoneName;
            }

            respData.push(modObj);
        }
    }

    return respData;
}


function modifyModuleDetails(data) {
    let respData = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {
                "name": "",
                "isView": 0,
                "addPem": 0,
                "editPem": 0,
                "deletePem": 0,
                "approvePem": 0,
                "child": []
            };
            if (data[i].name == undefined || data[i].name == null) {
                modObj["name"] = "";
            } else {
                modObj["name"] = data[i].name;
            }
            if (data[i].isView == undefined || data[i].isView == null) {
                modObj["isView"] = "0";
            } else {
                modObj["isView"] = data[i].isView;
            }
            if (data[i].addPem == undefined || data[i].addPem == null) {
                modObj["addPem"] = "0";
            } else {
                modObj["addPem"] = data[i].addPem;
            }
            if (data[i].editPem == undefined || data[i].editPem == null) {
                modObj["editPem"] = "0";
            } else {
                modObj["editPem"] = data[i].editPem;
            }
            if (data[i].deletePem == undefined || data[i].deletePem == null) {
                modObj["deletePem"] = "0";
            } else {
                modObj["deletePem"] = data[i].deletePem;
            }
            if (data[i].approvePem == undefined || data[i].approvePem == null) {
                modObj["approvePem"] = "0";
            } else {
                modObj["approvePem"] = data[i].approvePem;
            }
            if (data[i].child == undefined || data[i].child == null) {
                modObj["child"] = [];
            } else {
                modObj["child"] = modifyChildModuleData(data[i].child);
            }

            respData.push(modObj);
        }
    }

    return respData;
}

function modifyChildModuleData(data) {
    let respData = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {
                "name": "",
                "isView": 0,
                "addPem": 0,
                "editPem": 0,
                "deletePem": 0,
                "approvePem": 0,
            };
            if (data[i].name == undefined || data[i].name == null) {
                modObj["name"] = "";
            } else {
                modObj["name"] = data[i].name;
            }
            if (data[i].isView == undefined || data[i].isView == null) {
                modObj["isView"] = "0";
            } else {
                modObj["isView"] = data[i].isView;
            }
            if (data[i].addPem == undefined || data[i].addPem == null) {
                modObj["addPem"] = "0";
            } else {
                modObj["addPem"] = data[i].addPem;
            }
            if (data[i].editPem == undefined || data[i].editPem == null) {
                modObj["editPem"] = "0";
            } else {
                modObj["editPem"] = data[i].editPem;
            }
            if (data[i].deletePem == undefined || data[i].deletePem == null) {
                modObj["deletePem"] = "0";
            } else {
                modObj["deletePem"] = data[i].deletePem;
            }
            if (data[i].approvePem == undefined || data[i].approvePem == null) {
                modObj["approvePem"] = "0";
            } else {
                modObj["approvePem"] = data[i].approvePem;
            }

            respData.push(modObj);
        }
    }

    return respData;
}


export function modifyMenuPermisionData(data) {
    let modData = { "sfa": [], "crm": [], "mms": [] };
    for (let i = 0; i < data.length; i++) {
        switch (data[i].specificModule) {
            case "sfa":
                modData.sfa.push(data[i]);
                break;
            case "crm":
                modData.crm.push(data[i]);
                break;
            case "mms":
                modData.mms.push(data[i]);
                break;
            default:
                break;
            // code block
        }
    }
    return modData;
}

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

export function modYearData(data) {
    let modObj = {
        "financialyearId": "0",
        "financialYearStartDate": "",
        "financialYearEndDate": ""
    }
    if (data) {
        if (Object.keys(data).length > 0) {
            modObj.financialyearId = data.financialyearId
            modObj.financialYearStartDate = data.financialYearStartDate
            modObj.financialYearEndDate = data.financialYearEndDate
        }
    }
    return modObj
}