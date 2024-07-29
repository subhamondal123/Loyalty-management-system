
import React from "react";
import {
    View
} from "react-native";
import styles from "./style";
import { stateCheckForNetwork, stateUserInformation } from "../../redux/Sales360Action";

import { LmsCommonHeader, LmsHeader, LmsHeaderWithFilter, LmsHeaderWithScreenName } from "./sub-component";
import { StorageDataModification, Toaster } from "../../services/common-view-function";
import { MiddlewareCheck } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceLoader: false
        }
    }

    componentDidMount = () => {
        if (this.props.Sales360Redux.loginData.loginType == "employee") {
            this._getUserInfoFromApi();
        } else {
            this._getCustomerInfoFromApi()
        }
    }

    // for get the user info
    _getUserInfoFromApi = async () => {
        this.setState({ attendanceLoader: true });
        let responseData = await MiddlewareCheck("getGeneralData", {}, this.props);
        if (responseData) {
            if (responseData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.props.stateUserInformation(responseData.data);
                await StorageDataModification.headerData(responseData.data, "store");

            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ attendanceLoader: false });
    }

    // for get the customer info
    _getCustomerInfoFromApi = async () => {
        this.setState({ attendanceLoader: true });
        let reqData = {
            moduleType: "LMS"
        }
        let responseData = await MiddlewareCheck("getCustomerGeneralData", reqData, this.props);
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.props.stateUserInformation(responseData.response);
                await StorageDataModification.headerData(responseData.response, "store");

            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
        this.setState({ attendanceLoader: false });
    }

    getHeaderData = () => {
        let headerRespObj = {
            //lms
            lmsHeader: false,
            lmsCommonHeader: false,
            lmsHeaderWithFilter: false,
            lmsHeaderWithScreenName: false,
            headerText: ""
        }

        switch (this.props.route.name) {
            //lms

            case "ConfirmNewLifting": {
                headerRespObj.headerText = "Confirm Lifting"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "UpdateLiftingForm": {
                headerRespObj.headerText = "Confirm Lifting"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "EmployeeLmsDashboard":
                headerRespObj.lmsCommonHeader = true;
                break;
            case "PassbookAndRedemption": {
                headerRespObj.headerText = "Passbook"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "InfluencerPassbookAndRedemption": {
                headerRespObj.headerText = "Passbook"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "RedemptionDetails": {
                headerRespObj.headerText = "Redemption Details"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "SchemePage": {
                headerRespObj.headerText = "Offers"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "Catalogue": {
                headerRespObj.headerText = "Catalogue"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "InfluencerCatalogue": {
                headerRespObj.headerText = "Catalogue"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "SalesConfirmation": {
                headerRespObj.headerText = "Confirm Sale"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "GetSalesConfirmation": {
                headerRespObj.headerText = "Confirm Sale"
                headerRespObj.lmsHeader = true;
                break;
            }


            case "Notification": {
                headerRespObj.headerText = "Notification"
                headerRespObj.lmsHeaderWithScreenName = true;
                break;
            }

            case "GlobalCatalogueItemDetails": {
                headerRespObj.headerText = "Catalogue Item Details"
                headerRespObj.lmsHeaderWithScreenName = true;
                break;
            }





            case "CustomerListTab": {
                headerRespObj.headerText = "Customer List"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "ValidateSales": {
                headerRespObj.headerText = "Validate Sales"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "InfluencerActivityDetails": {
                headerRespObj.headerText = "Influencer Activity"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "RequestRedemtionCategory": {
                headerRespObj.headerText = "Request Redemption"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "ReedemScreen": {
                headerRespObj.headerText = "Redeem"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "InfluencerCatalogueItemDetails": {
                headerRespObj.headerText = "Catalogue Item Details"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "NewCustomerRegistration": {
                headerRespObj.headerText = "Add New Partner"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "StockUpdatePage": {
                headerRespObj.headerText = "Stock Update"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "CatalogueItemDetails": {
                headerRespObj.headerText = "Catalogue Item Details"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "ConfirmLiftingListForCustomer": {
                headerRespObj.headerText = "Confirm Lifting"
                headerRespObj.lmsHeader = true;
                break;
            }

            case "UpdateLiftingFormForCustomer": {
                headerRespObj.headerText = "Confirm Lifting"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "PassbookListTab": {
                headerRespObj.headerText = "Passbook"
                headerRespObj.lmsHeader = true;
                break;
            }
            case "AllRecentLiftingList": {
                headerRespObj.headerText = "Recent Lifting"
                headerRespObj.lmsHeaderWithFilter = true;
                break;
            }
            case "AllRecentLiftingListCustomer": {
                headerRespObj.headerText = "Recent Lifting"
                headerRespObj.lmsHeaderWithFilter = true;
                break;
            }




            default:
                headerRespObj.lmsCommonHeader = true;
                break;
        }

        return headerRespObj;
    }

    onFilterApply = (data) => {
        this.props.onFilterData(data)
    }


    onDataReset = () => {
        this.props.onReset()
    }

    onDataDownload = () => {
        this.props.onDownloadData()
    }

    onSelectNotification = () => {
        this.props.navigation.navigate("Notification")
    }

    onSearchField = () => {
        this.props.onSearchData()
    }


    render() {
        let headerData = this.getHeaderData()
        return (
            <View style={styles.headerContainer}>
                {headerData.lmsHeaderWithFilter ? <LmsHeaderWithFilter  {...this.props} headerText={headerData.headerText} onApplyFilter={(data) => this.onFilterApply(data)} onResetFilter={() => this.onDataReset()} onNotificationData={() => this.onSelectNotification()} /> : null}
                {headerData.lmsHeader ? <LmsHeader  {...this.props} headerText={headerData.headerText} onNotificationData={() => this.onSelectNotification()} /> : null}
                {headerData.lmsCommonHeader ? <LmsCommonHeader  {...this.props} headerText={headerData.headerText} onNotificationData={() => this.onSelectNotification()} /> : null}
                {headerData.lmsHeaderWithScreenName ? <LmsHeaderWithScreenName  {...this.props} headerText={headerData.headerText} /> : null}

            </View>
        )
    }
}

// export default Header;


const mapStateToProps = (state) => {
    const { Sales360Redux } = state;
    return { Sales360Redux };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            stateCheckForNetwork,
            stateUserInformation
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Header);
