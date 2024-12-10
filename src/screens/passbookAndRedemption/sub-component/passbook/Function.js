

export function modifyListData(data) {
    var respData = { "totalCount": 0, "list": [] };
    if (data) {
        let listData = data.response;
        if (listData && listData.length > 0) {
            for (let i = 0; i < listData.length; i++) {
                let modObj = {};
                if (listData[i].id == undefined || listData[i].id == null) {
                    modObj["id"] = "";
                } else {
                    modObj["id"] = listData[i].id;
                }
                if (listData[i].type == undefined || listData[i].type == null) {
                    modObj["type"] = "";
                } else {
                    modObj["type"] = listData[i].type;
                }
                if (listData[i].point == undefined || listData[i].point == null) {
                    modObj["point"] = "N/A";
                } else {
                    modObj["point"] = listData[i].point;
                }
                if (listData[i].createdAt == undefined || listData[i].createdAt == null) {
                    modObj["createdAt"] = "";
                } else {
                    modObj["createdAt"] = listData[i].createdAt;
                }
                if (listData[i].rewardId == undefined || listData[i].rewardId == null) {
                    modObj["rewardId"] = "";
                } else {
                    modObj["rewardId"] = listData[i].rewardId;
                }
                if (listData[i].offerId == undefined || listData[i].offerId == null || listData[i].offerId == "") {
                    modObj["offerId"] = "";
                } else {
                    modObj["offerId"] = listData[i].offerId;
                }
                if (listData[i].itemId == undefined || listData[i].itemId == null) {
                    modObj["itemId"] = "";
                } else {
                    modObj["itemId"] = listData[i].itemId;
                }
                if (listData[i].invoice == undefined || listData[i].invoice == null) {
                    modObj["invoice"] = "";
                } else {
                    modObj["invoice"] = listData[i].invoice;
                }
                if (listData[i].name == undefined || listData[i].name == null) {
                    modObj["pointCategoryName"] = "N/A";
                } else {
                    modObj["pointCategoryName"] = listData[i].name;
                }
                if (listData[i].isLockPointConverted == undefined || listData[i].isLockPointConverted == null) {
                    modObj["isLockPointConverted"] = "";
                } else {
                    modObj["isLockPointConverted"] = listData[i].isLockPointConverted;
                }
                if (listData[i].itemName == undefined || listData[i].itemName == null) {
                    modObj["itemName"] = "";
                } else {
                    modObj["itemName"] = listData[i].itemName;
                }
                if (listData[i].liftFrom == undefined || listData[i].liftFrom == null) {
                    modObj["liftFrom"] = "";
                } else {
                    modObj["liftFrom"] = listData[i].liftFrom;
                }

                if (listData[i].item == undefined || listData[i].item == null) {
                    modObj["item"] = "";
                } else {
                    modObj["item"] = listData[i].item;
                }

                if (listData[i].salesDate == undefined || listData[i].salesDate == null) {
                    modObj["salesDate"] = "";
                } else {
                    modObj["salesDate"] = listData[i].salesDate;
                }
                
                

                modObj["check"] = false;
                respData.list.push(modObj);
            }
        }
    }
    return (respData);
}


export function modifyFinancialYearDropdownData(data) {
    let respArr = [];
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {};
            if (data[i].financialyearId == undefined || data[i].financialyearId == null) {
                modObj["id"] = ""
            } else {
                modObj["id"] = data[i].financialyearId
            }
            if (data[i].financialYearStartDate == undefined || data[i].financialYearStartDate == null) {
                modObj["name"] = ""
            } else {
                modObj["name"] = formatYearRange(data[i].financialYearStartDate, data[i].financialYearEndDate)
            }
            respArr.push(modObj)
        }
    }
    return respArr
}

export function formatYearRange(startDate, endDate) {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    // Format to desired format "YYYY-YY"
    return `${startYear}-${endYear.toString().slice(-2)}`;
}