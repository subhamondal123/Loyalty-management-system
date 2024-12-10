export function modArrData(arr) {
    let respData = [];
    if (arr && arr.length) {
        for (let i = 0; i < arr.length; i++) {
            let modObj = {};
            if (arr[i].approvedStatus == undefined || arr[i].approvedStatus == null) {
                modObj["approvedStatus"] = "0"
            }
            else {
                modObj["approvedStatus"] = arr[i].approvedStatus
            }
            if (arr[i].stateName == undefined || arr[i].stateName == null) {
                modObj["stateName"] = "N/A"
            }
            else {
                modObj["stateName"] = arr[i].stateName
            }
            if (arr[i].roleName == undefined || arr[i].roleName == null) {
                modObj["roleName"] = "N/A"
            }
            else {
                modObj["roleName"] = arr[i].roleName
            }
            if (arr[i].user == undefined || arr[i].user == null) {
                modObj["user"] = "N/A"
            }
            else {
                modObj["user"] = arr[i].user
            }
            if (arr[i].createdAt == undefined || arr[i].createdAt == null) {
                modObj["createdAt"] = ""
            }
            else {
                modObj["createdAt"] = arr[i].createdAt
            }
            if (arr[i].comments == undefined || arr[i].comments == null) {
                modObj["comments"] = ""
            }
            else {
                modObj["comments"] = arr[i].comments
            }
            if (arr[i].requestedRoleName == undefined || arr[i].requestedRoleName == null) {
                modObj["requestedRoleName"] = ""
            }
            else {
                modObj["requestedRoleName"] = arr[i].requestedRoleName
            }
            
            modObj["labelColor"] = arr[i].stateName == "Requested" ? "#E3BE5D" : arr[i].stateName == "CRM" ? "#54C0A0" : arr[i].stateName == "Purchase" ? "#C372CA" : "#57C95A"
            modObj["backgroundColor"] = arr[i].stateName == "Requested" ? "#FFF4BB" : arr[i].stateName == "CRM" ? "#BBFFEB" : arr[i].stateName == "Purchase" ? "#FBC9FF" : "#9FF7A2"


            respData.push(modObj)
        }
    }

    return respData
}