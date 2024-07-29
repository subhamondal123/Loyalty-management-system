import { DateConvert } from "../../../services/common-view-function"

export function modPassbookData(data) {
    let respArr = []
    if (data) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let modObj = {}
                if (data[i].point == undefined || data[i].point == null) {
                    modObj["point"] = ""
                } else {
                    modObj["point"] = data[i].point
                }
                if (data[i].createdAt == undefined || data[i].createdAt == null) {
                    modObj["createdAt"] = ""
                } else {
                    modObj["createdAt"] = DateConvert.getMonthYearName(data[i].createdAt)
                }
                if (data[i].liftFrom == undefined || data[i].liftFrom == null) {
                    modObj["liftFrom"] = ""
                } else {
                    modObj["liftFrom"] = data[i].liftFrom
                }
                if (data[i].liftFromType == undefined || data[i].liftFromType == null) {
                    modObj["liftFromType"] = ""
                } else {
                    modObj["liftFromType"] = data[i].liftFromType
                }

                respArr.push(modObj)
            }
        }
    }
    return respArr
}