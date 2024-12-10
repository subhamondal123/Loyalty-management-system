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
    let modData = data.response;
    for (let i = 0; i < modData.length; i++) {
        if (modData[i].firstName == undefined || modData[i].firstName == null) {
            modData[i].firstName = "";
        } else {
            modData[i].firstName = modData[i].firstName;
        }
        if (modData[i].lastName == undefined || modData[i].lastName == null) {
            modData[i].lastName = "";
        } else {
            modData[i].lastName = modData[i].lastName;
        }
        if (modData[i].email == undefined || modData[i].email == null) {
            modData[i].email = "";
        } else {
            modData[i].email = modData[i].email;
        }
        if (modData[i].password == undefined || modData[i].password == null) {
            modData[i].password = "";
        } else {
            modData[i].password = modData[i].password;
        }
        if (modData[i].username == undefined || modData[i].username == null) {
            modData[i].username = "";
        } else {
            modData[i].username = modData[i].username;
        }
        if (modData[i].userType == undefined || modData[i].userType == null) {
            modData[i].userType = "";
        } else {
            modData[i].userType = modData[i].userType;
        }
        if (modData[i].profileImgUrl == undefined || modData[i].profileImgUrl == null) {
            modData[i].profileImgUrl = "";
        } else {
            modData[i].profileImgUrl = modData[i].profileImgUrl;
        }
        if (modData[i].clientId == undefined || modData[i].clientId == null) {
            modData[i].clientId = "";
        } else {
            modData[i].clientId = modData[i].clientId;
        }
        if (modData[i].clientName == undefined || modData[i].clientName == null) {
            modData[i].clientName = "";
        } else {
            modData[i].clientName = modData[i].clientName;
        }
        modData[i]["id"] = modData[i].clientId;
        modData[i]["name"] = modData[i].clientName;


        if (modData[i].clientUserId == undefined || modData[i].clientUserId == null) {
            modData[i].customerId = "";
        } else {
            modData[i].customerId = modData[i].userType == 6 ? modData[i].clientUserId : "";
        }
        if (modData[i].userId == undefined || modData[i].userId == null) {
            modData[i].userId = "";
        } else {
            modData[i].userId = modData[i].userId;
        }
        modData[i]["contactTypeId"] = modData[i].userType == 6 ? Object.keys(modData[i].forCustomerUser).length > 0 ? modData[i].forCustomerUser.contactTypeId : "" : modData[i].designationId;
        modData[i]["usertypeId"] = modData[i].userType == 6 ? Object.keys(modData[i].forCustomerUser).length > 0 ? modData[i].forCustomerUser.contactTypeId : "" : modData[i].designationId;
        modData[i]["mstSlNo"] = Object.keys(modData[i].forCustomerUser).length > 0 ? modData[i].forCustomerUser.mstSlNo : "";
        modData[i]["customerAccessTypeName"] = Object.keys(modData[i].forCustomerUser).length > 0 ? modData[i].forCustomerUser.customerAccessTypeName : "";
        modData[i]["customerAccessType"] = Object.keys(modData[i].forCustomerUser).length > 0 ? modData[i].forCustomerUser.customerAccessType : "";
        if (modData[i].createdAt == undefined || modData[i].createdAt == null) {
            modData[i].createdAt = "";
        } else {
            modData[i].createdAt = modData[i].createdAt;
        }
        if (modData[i].token == undefined || modData[i].token == null) {
            modData[i].token = "";
        } else {
            modData[i].token = modData[i].token;
        }
        if (modData[i].forCustomerUser == undefined || modData[i].forCustomerUser == null || Object.keys(modData[i].forCustomerUser).length == 0) {
            modData[i].forCustomerUser = {};
        } else {
            modData[i].forCustomerUser = modData[i].forCustomerUser;
        }
        if (modData[i].locationData == undefined || modData[i].locationData == null) {
            modData[i].locationData = [];
        } else {
            modData[i].locationData = modifyLocationData(modData[i].locationData);
        }
        if (modData[i].clientSettings == undefined || modData[i].clientSettings == null) {
            modData[i].clientSettings = [];
        } else {
            modData[i].clientSettings = modifyClientSettings(modData[i].clientSettings);
        }
        if (modData[i].moduleDetails == undefined || modData[i].moduleDetails == null) {
            modData[i].moduleDetails = [];
        } else {
            modData[i].moduleDetails = modifyModuleDetails(modData[i].moduleDetails);
        }
        if (modData[i].countryId == undefined || modData[i].countryId == null) {
            modData[i].countryId = "";
        } else {
            modData[i].countryId = modData[i].countryId;
        }
        if (modData[i].countryName == undefined || modData[i].countryName == null) {
            modData[i].countryName = "";
        } else {
            modData[i].countryName = modData[i].countryName;
        }
        if (modData[i].stateId == undefined || modData[i].stateId == null) {
            modData[i].stateId = "";
        } else {
            modData[i].stateId = modData[i].stateId;
        }
        if (modData[i].stateName == undefined || modData[i].stateName == null) {
            modData[i].stateName = "";
        } else {
            modData[i].stateName = modData[i].stateName;
        }
        if (modData[i].districtId == undefined || modData[i].districtId == null) {
            modData[i].districtId = "";
        } else {
            modData[i].districtId = modData[i].districtId;
        }
        if (modData[i].districtName == undefined || modData[i].districtName == null) {
            modData[i].districtName = "";
        } else {
            modData[i].districtName = modData[i].districtName;
        }
        if (modData[i].zoneId == undefined || modData[i].zoneId == null) {
            modData[i].zoneId = "";
        } else {
            modData[i].zoneId = modData[i].zoneId;
        }
        if (modData[i].zoneName == undefined || modData[i].zoneName == null) {
            modData[i].zoneName = "";
        } else {
            modData[i].zoneName = modData[i].zoneName;
        }
        if (modData[i].designationId == undefined || modData[i].designationId == null) {
            modData[i].designationId = "";
        } else {
            modData[i].designationId = modData[i].designationId;
        }
        if (modData[i].lastLevelLocations == undefined || modData[i].lastLevelLocations == null) {
            modData[i].lastLevelLocations = {};
        } else {
            modData[i].lastLevelLocations = modData[i].lastLevelLocations;
        }
        if (modData[i].clientSettings == undefined || modData[i].clientSettings == null) {
            modData[i]["clientLogo"] = [];
        } else {
            modData[i]["clientLogo"] = getClientLogo(modData[i].clientSettings);
        }
        if (modData[i].clientSettings == undefined || modData[i].clientSettings == null) {
            modData[i]["orderOTPVerification"] = [];
        } else {
            modData[i]["orderOTPVerification"] = getClientOtpVirification(modData[i].clientSettings);
        }

        modData[i]["moduleType"] = "LMS"
        modData[i]["loginType"] = modData[i].userType == "6" ? "customer" : "employee"

    }
    return modData;
}


//-------------------------------------------------------------------------------

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
    if (modData.customerAccessTypeName == undefined || modData.customerAccessTypeName == null) {
        modObj["customerAccessTypeName"] = "";
    } else {
        modObj["customerAccessTypeName"] = modData.customerAccessTypeName;
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
    let modData = { "sfa": [], "crm": [], "mms": [], "lms": [] };
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
            case "lms":
                modData.lms.push(data[i]);
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