export function showHideIcon(props) {
    let obj = {
        isVisibleFilterIcon: true,
        isVisibleBellIcon: false
    };
    switch (props.route.name) {
        case "AllRecentLiftingListCustomer":
            obj.isVisibleBellIcon = false;
            break;
        case "AllRecentLiftingList":
            obj.isVisibleBellIcon = false;
            break;

        default:
            obj.isVisibleBellIcon = false;
            obj.isVisibleFilterIcon = false;
    }
    return obj;
}