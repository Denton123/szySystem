import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    List,
    Picker
} from 'antd-mobile'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'
import {ajax} from 'UTILS/ajax'

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

class Technology extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            types: [], // 全部技术类型
            allTypesData: [
                {
                    label: '请选择',
                    value: ''
                }
            ],
            src: 'https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png'
        }
    }

    componentWillMount() {
        this.getAllTechtype()
    }
    getAllTechtype() {
        ajax('get', '/techtype/all')
        .then(res => {
            let arr = this.state.allTypesData
            res.data.forEach(d => {
                arr.push({
                    label: d.name,
                    value: d.id
                })
            })
            this.setState({
                allTypesData: arr,
                types: res.data
            })
        })
    }

    handleOk = (e) => {
        console.log(this.state.allTypesData)
    }
    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes,
            dateSetting
        } = this.props

        const {
            types,
            allTypesData
        } = this.state
        let condition = [
            ({getFieldProps}) => {
                return (
                    <InputItem
                        {...getFieldProps('title')}
                        title="标题"
                        placeholder="标题">
                        标题
                    </InputItem>
                )
            },
            ({getFieldProps}) => {
                return (
                    <Picker extra="请选择(可选)"
                        data={allTypesData}
                        title="类型"
                        {...getFieldProps('type_id', {
                            initialValue: [allTypesData[0].value]
                        })}
                        cols={1}
                        onOk={this.handleOk}
                    >
                        <List.Item arrow="horizontal">类型</List.Item>
                    </Picker>
                )
            }
        ]

        return (
            <div>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Header
                                        title={obj.title}
                                        extra={<span>{types.length > 0 ? (types.find(item => item.id === obj.type_id)).name : ''}</span>} />
                                    <Card.Body>
                                        <div style={{textAlign: 'left'}} dangerouslySetInnerHTML={{__html: escape(obj.content)}} />
                                    </Card.Body>
                                </Card>
                                <WhiteSpace size="sm" />
                            </WingBlank>
                        )) : <NoData />
                    }
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(Technology, {
    model: 'technology'
})
