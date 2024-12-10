import React, { Component } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { Color, FontFamily, FontSize, ImageName } from '../../../../../enums'
import { BigTextButton, DropdownInputBox } from '../../../../../shared'
import styles from './style'
import DatePicker from 'react-native-date-picker'
import { DateConvert, StorageDataModification } from '../../../../../services/common-view-function'
import { MiddlewareCheck } from '../../../../../services/middleware'
import { modifyCustomerData, modifyLocationMappedData } from './function'
import { ErrorCode } from '../../../../../services/constant'
import DynamicProductMapping from '../../../../dynamicProductMapping'


export default class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCategoryObj: {},
            categoryArr: [],
        }
    }

    componentDidMount = async () => {
        let data = await StorageDataModification.catalogueAndCategoryData({}, "get");
        if(data){
            if(Object.keys(data).length > 0){
                this.setState({categoryArr:data.categories})
            }
        }
        this._load();
    }

    _load = async () => {
    }


    onApply = () => {
        let filterData = {};
        filterData["selectedCategoryObjData"] = this.state.selectedCategoryObj;
        this.props.onFilter(filterData);
    }

    onReset = () => {
        this.setState({
            selectedCategoryObj: {},
        });
        this.props.onResetFilterModal();
    }

    // for button design implement here
    footerSec = () => {
        return (
            <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                <BigTextButton
                    text={"Reset"}
                    fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                    fontSize={FontSize.SM}categories
                    fontColor={"#000"}
                    borderRadius={30}
                    isLinearGradient={true}
                    gradientColors={["#fff", "#dfdfdf"]}
                    additionalStyles={{ borderColor: "#000", borderWidth: 0.8 }}
                    onPress={() => this.onReset()}
                />
                <View style={{ width: 55 }} />
                <BigTextButton
                    isLinearGradient={true}
                    gradientColors={["#C5C91E", "#3AB500"]}
                    text={"Search"}
                    fontFamily={FontFamily.FONTS.POPPINS.MEDIUM}
                    fontSize={FontSize.SM}
                    borderRadius={30}
                    start={{ x: 1, y: 0.3 }}
                    end={{ x: 0.5, y: 1 }}
                    onPress={() => this.onApply()}
                />
            </View>
        )
    }

    onSelectCategory = (val) => {
        this.setState({ selectedCategoryObj: val })
    }

    dropdownSec = () => {
        return (
            <View>
                <View style={{ margin: 10 }}>
                    {this.state.customerListLoader ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator color={Color.COLOR.BLACK.PURE_BLACK} />
                        </View>
                        :
                        <View style={{ marginRight: 5 }}>
                            <Text style={{ color: Color.COLOR.BLUE.LOTUS_BLUE, fontSize: FontSize.SM, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, marginLeft: 10, marginVertical: 10 }}>Select Category</Text>
                            <DropdownInputBox
                                selectedValue={this.state.selectedCategoryObj.id ? this.state.selectedCategoryObj.id.toString() : "0"}
                                data={this.state.categoryArr}
                                onSelect={(value) => this.onSelectCategory(value)}
                                headerText={"Select Option"}
                                additionalBoxStyle={{ backgroundColor: Color.COLOR.WHITE.WHITE_SMOKE, borderRadius: 10 }}
                                isBackButtonPressRequired={true}
                                isBackdropPressRequired={true}
                                unSelectedTextColor={"#5F5F5F"}
                                selectedTextColor={"#1F2B4D"}
                                fontFamily={FontFamily.FONTS.INTER.SEMI_BOLD}
                                borderRadius={25}
                                isSearchable={true}
                            />
                        </View>
                    }
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{ marginTop: 10 }}>
                {this.dropdownSec()}
                {this.footerSec()}
            </View>
        )
    }
}
