

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
               

                modObj["check"] = false;
                respData.list.push(modObj);
            }
        }
    }
    return (respData);
}