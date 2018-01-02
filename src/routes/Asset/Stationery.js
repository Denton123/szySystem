// // 办公用品管理
// import React, {Component} from 'react'
// import {
//     Icon,
//     Button,
//     Table,
//     Avatar,
//     DatePicker,
//     Input,
//     Radio,
//     message,
//     Divider,
//     Select,
//     InputNumber
// } from 'antd'
// import {
//     Link,
//     Route,
//     Switch,
//     Redirect
// } from 'react-router-dom'

// // 引入工具方法
// import {isObject, isArray, valueToMoment} from 'UTILS/utils'
// import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

// import BasicOperation from 'COMPONENTS/basic/BasicOperation'
// import InputRange from 'COMPONENTS/input/InputRange'

// import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
// import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
// import CustomModal from 'COMPONENTS/modal/CustomModal'
// import CustomForm from 'COMPONENTS/form/CustomForm'

// import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

// const RadioGroup = Radio.Group

// class Stationery extends Component {
//     checkNumber = (rule, value, callback) => {
//         if (!value || (value.number1 === undefined && value.number2 === undefined)) {
//             callback()
//             return
//         }
//         if (value.number1 <= value.number2) {
//             callback()
//             return
//         }
//         callback('两个都必选填，单价1小于单价2!')
//     }

//     render() {
//         const {
//             child,
//             route,
//             history,
//             location,
//             match
//         } = this.props

//         const entryDate = {
//             format: 'YYYY-MM-DD',
//             showTime: false,
//             style: {
//                 width: 220
//             }
//         }

//         const quitDate = {
//             format: 'YYYY-MM-DD',
//             showTime: false,
//             style: {
//                 width: 220
//             }
//         }

//         // 条件
//         const condition = [
//             {
//                 label: '名称',
//                 field: 'name',
//                 component: (<Input className="mb-10" autoComplete="off" placeholder="姓名" />)
//             },
//             {
//                 label: '单价',
//                 field: 'price',
//                 valid: {
//                     initialValue: { number1: 0, number2: 0 },
//                     rules: [{ validator: this.checkNumber }]
//                 },
//                 component: (<InputRange autoComplete="off" placeholder="单价" />)
//             },
//             {
//                 label: '购买日期',
//                 field: 'date',
//                 component: <CustomRangePicker className="mb-10" {...entryDate} />,
//             }
//         ]

//         // 操作
//         const operationBtn = [
//             () => <Button className="mr-10" type="primary" onClick={this.props.handleAdd}>新增</Button>,
//             () => <Button type="danger" onClick={this.props.handleDelete}>删除</Button>
//         ]

//         // 表格
//         const columns = [
//             {
//                 title: 'rifd',
//                 dataIndex: 'rfid',
//                 key: 'rfid',
//                 width: 70
//             },
//             {
//                 title: '名称',
//                 dataIndex: 'name',
//                 key: 'name',
//                 width: 70
//             },
//             {
//                 title: '单价',
//                 dataIndex: 'price',
//                 key: 'price',
//                 width: 70
//             },
//             {
//                 title: '数量',
//                 dataIndex: 'number',
//                 key: 'number',
//                 width: 70
//             },
//             {
//                 title: '购买日期',
//                 dataIndex: 'date',
//                 key: 'date'
//             },
//             {
//                 title: '购买人',
//                 dataIndex: 'purchase',
//                 key: 'purchase'
//             },
//             {
//                 title: '类型',
//                 dataIndex: 'type',
//                 key: 'type'
//             },
//             {
//                 title: '备注',
//                 dataIndex: 'memo',
//                 key: 'memo'
//             },
//             {
//                 title: '操作',
//                 key: 'action',
//                 width: 200,
//                 render: (text, record) => (
//                     <span>
//                         <a href="javascript:;" data-id={text.id} onClick={this.props.handleEdit}>编辑</a>
//                         <Divider type="vertical" />
//                         <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
//                     </span>
//                 )
//             }
//         ]

//         const rowSelection = {
//             onChange: this.props.handleTableRowChange
//         }

//         // 表单
//         const formFields = [
//             {
//                 label: '名称',
//                 field: 'name',
//                 valid: {
//                     rules: [{required: true, message: '请输入名称'}]
//                 },
//                 component: (<Input autoComplete="off" placeholder="名称" />)
//             },
//             {
//                 label: 'rfid',
//                 field: 'rfid',
//                 valid: {
//                     rules: [{required: false, message: '请输入rfid'}]
//                 },
//                 component: (<Input autoComplete="off" placeholder="rfid" />)
//             },
//             {
//                 label: '单价',
//                 field: 'price',
//                 valid: {
//                     rules: [
//                         {
//                             type: 'number', message: '请输入数字类型'
//                         },
//                         {
//                             required: true, message: '请输入单价'
//                         }
//                     ]
//                 },
//                 component: (<InputNumber autoComplete="off" placeholder="单价" min={0} />)
//             },
//             {
//                 label: '数量',
//                 field: 'number',
//                 valid: {
//                     rules: [
//                         {
//                             type: 'number', message: '请输入数字类型'
//                         },
//                         {
//                             required: true, message: '请输入数量'
//                         }
//                     ]
//                 },
//                 component: (<InputNumber autoComplete="off" placeholder="数量" min={0} />)
//             },
//             {
//                 label: '购买日期',
//                 field: 'date',
//                 valid: {
//                     rules: [{required: true, message: '请选择购买日期'}]
//                 },
//                 component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
//             },
//             {
//                 label: '购买人',
//                 field: 'purchase',
//                 valid: {
//                     rules: [{required: true, message: '请输入购买人'}]
//                 },
//                 component: (<Input autoComplete="off" placeholder="购买人" />)
//             },
//             {
//                 label: '类型',
//                 field: 'type',
//                 component: (
//                     <RadioGroup>
//                         <Radio value="公司">公司</Radio>
//                         <Radio value="学校">学校</Radio>
//                     </RadioGroup>
//                 )
//             },
//             {
//                 label: '属于',
//                 field: 'belong',
//                 component: (
//                     <RadioGroup disabled>
//                         <Radio value="equipment">设备</Radio>
//                         <Radio value="stationery">办公用品</Radio>
//                         <Radio value="book">图书</Radio>
//                     </RadioGroup>
//                 )
//             },
//             {
//                 label: '备注',
//                 field: 'memo',
//                 component: (<Input autoComplete="off" placeholder="备注" />)
//             }
//         ]

//         return (
//             <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
//                 <CustomForm
//                     layout="inline"
//                     formStyle={{width: '100%'}}
//                     customFormOperation={<Button type="primary" htmlType="submit">查询</Button>}
//                     formFields={condition}
//                     handleSubmit={this.props.handleQuery}
//                     updateFormFields={this.props.updateQueryFields}
//                     formFieldsValues={this.props.queryFieldValues}
//                 />
//                 <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
//                 <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
//                 <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} user={this.props.user}>
//                     <CustomForm
//                         formStyle={{width: '100%'}}
//                         formFields={formFields}
//                         handleSubmit={this.props.handleFormSubmit}
//                         updateFormFields={this.props.updateFormFields}
//                         formFieldsValues={this.props.formFieldsValues}
//                         isSubmitting={this.props.isSubmitting}
//                     />
//                 </CustomModal>
//             </div>
//         )
//     }
// }

// const St = withBasicDataModel(Stationery, {
//     model: 'asset',
//     subModel: {belong: 'stationery'},
//     title: '设备管理',
//     dataSetting: {},
//     modalSetting: {
//         title: '设备管理'
//     },
//     // 查询的
//     queryFieldValues: {
//         name: {
//             value: null
//         },
//         price: {
//             value: null
//         },
//         date: {
//             value: null
//         }
//     },
//     // 表单的
//     formFieldsValues: {
//         id: {
//             value: null
//         },
//         name: {
//             value: null
//         },
//         rfid: {
//             value: null
//         },
//         price: {
//             value: null
//         },
//         number: {
//             value: null
//         },
//         date: {
//             value: null
//         },
//         purchase: {
//             value: null
//         },
//         type: {
//             value: null
//         },
//         memo: {
//             value: null
//         },
//         belong: {
//             value: 'stationery'
//         }
//     },
//     clearFormValues: {
//         id: {
//             value: null
//         },
//         name: {
//             value: null
//         },
//         rfid: {
//             value: null
//         },
//         price: {
//             value: null
//         },
//         number: {
//             value: null
//         },
//         date: {
//             value: null
//         },
//         purchase: {
//             value: null
//         },
//         type: {
//             value: null
//         },
//         memo: {
//             value: null
//         },
//         belong: {
//             value: 'stationery'
//         }
//     }
// })

// export default St

import React from 'react'
import Asset from './Asset.js'

const TheStationery = Asset({
    belong: 'stationery',
    title: '办公用品管理',
})

class Stationery extends React.Component {
    render() {
        return (
            <TheStationery {...this.props} />
        )
    }
}

export default Stationery
