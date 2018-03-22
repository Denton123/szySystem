import React from 'react'
import ReactDOM from 'react-dom'
import {
    Icon,
    Card,
    Tabs,
    Pagination,
    WingBlank,
    List,
    WhiteSpace,
    Button,
    InputItem,
    PullToRefresh,
    Accordion
} from 'antd-mobile'
import { createForm } from 'rc-form'
import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CustomForm from '../../../components/CustomForm'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class WorkerAffairs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 刷新设置
            refreshing: false,
            height: document.documentElement.clientHeight 
        }
    }

    componentWillMount() {
        this.props.getData()
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
          height: hei
        }), 0)
    }

    handleChangePage = (e) => {
        console.log(e)
    }
        // 下拉刷新
    bandleDownRefresh = () => {
        this.setState({ refreshing: true })
        // this.getData({page: this.state.dateSetting.pagination.current})
        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 1000)
    }
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                console.log(this.props.form.getFieldsValue())
            } else {
                console.log(error)
                alert('Validation failed')
            }
        })
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

        let condition = [
            ({getFieldProps}) => {
                return (<InputItem placeholder="姓名"
                    {...getFieldProps('realname')}
                    title="姓名"
                    placeholder="controlled" >
                    姓名
                </InputItem>)
            }
        ]

        let formOperation = () => <Button type="primary" size="small" inline style={{ marginRight: '4px' }}>搜索</Button>
        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                <Accordion className="my-accordion">
                    <Accordion.Panel header="搜索">
                        <CustomForm formFields={condition} formOperation={formOperation} />
                    </Accordion.Panel>
                </Accordion>
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        height: this.state.height,
                        overflow: 'auto'
                    }}
                    indicator={{}}
                    direction={'down'}
                    refreshing={this.state.refreshing}
                    onRefresh={this.bandleDownRefresh}
                >
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <Card key={i.toString()}>
                                <Card.Header
                                    title={obj.realname}
                                    thumb={<img style={{maxWidth: '64px', maxHeight: '64px'}} src={obj && obj.avatar ? `/uploadImgs/${obj.avatar}` : '../../../assets/user.png'} />}
                                    extra={<span>{obj.job}</span>} />
                            </Card>
                        )) : <p className="pt10">暂无数据</p>
                    }
                    <WingBlank>
                        <Pagination
                            className="mt-10"
                            total={dateSetting.pagination.total}
                            current={dateSetting.pagination.current}
                            locale={locale}
                            onChange={this.props.handlePageChange} />
                    </WingBlank>
                </PullToRefresh>
            </div>
        )
    }
}

export default withBasicDataModel(WorkerAffairs, {
    model: 'user',
    conditionForm: {
        realname: null
    }
})
