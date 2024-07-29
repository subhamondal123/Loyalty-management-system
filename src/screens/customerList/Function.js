export function modifyCustomerTypeArr(data) {
    let sortedArr = [];
    let respArr = [];
    if (data.length > 0) {
        sortedArr = data.sort((a, b) => a.seqno - b.seqno); // Sort the array based on seqno
        let remainingZeros = []; // Array to store objects with seqno 0
        console.log("sorterArr----", sortedArr)
        for (let i = 0; i < sortedArr.length; i++) {
            let modObj = {};
            modObj["id"] = sortedArr[i].contactTypeId;
            modObj["name"] = sortedArr[i].contactTypeName;
            modObj["mstSlNo"] = sortedArr[i].mstSlNo;
            modObj["customerAccessType"] = sortedArr[i].customerAccessType;
            modObj["check"] = i == 0 ? true : false;

            // if (sortedArr[i].seqno === 0) {
            //     remainingZeros.push(modObj); // Push objects with seqno 0 to remainingZeros array
            // } else {
            //     respArr.push(modObj); // Push objects with non-zero seqno to respArr
            // }
            respArr.push(modObj)
        }

        // Concatenate the arrays to put the remaining zeros at the end
        // respArr = respArr.concat(remainingZeros);
    } else {
        respArr = []
    }


    return respArr;
}
