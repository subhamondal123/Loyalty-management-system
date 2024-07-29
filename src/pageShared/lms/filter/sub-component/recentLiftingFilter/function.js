export function modifyCustomerData(data) {
    let respArr = [];
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let modObj = {};
            if (data[i].customerId == null && data[i].customerId == undefined || data[i].customerId.length == 0) {
                modObj["id"] = ""
            } else {
                modObj["id"] = data[i].customerId
            }
            if (data[i].custBusinessName == null && data[i].custBusinessName == undefined || data[i].custBusinessName.length == 0) {
                modObj["name"] = ""
            } else {
                modObj["name"] = data[i].custBusinessName
            }
            respArr.push(modObj);
        }
    }
    return respArr;
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