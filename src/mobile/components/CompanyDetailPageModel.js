import React from 'react'
import ReactDOM from 'react-dom'
import {
    Pagination,
    WingBlank,
    PullToRefresh,
    Accordion
} from 'antd-mobile'
import CustomForm from './CustomForm'
import { isArray, isNullObject } from 'UTILS/utils'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class CompanyDetailPageModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 刷新设置
            height: document.documentElement.clientHeight,
        }
    }

    componentWillMount() {
        if (this.props.params) { // 任务入口
            this.props.getData({}, this.props.params.state)
        } else { // 其他
            this.props.getData()
        }
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop
        setTimeout(() => this.setState({
            height: hei
        }), 0)
    }

    handleSearchSubmit = (e) => {
        let obj = {}
        // 把搜索的值（数组）变成字符串
        for (let key in e) {
            if (isArray(e[key])) {
                obj[key] = e[key][0]
            } else {
                obj[key] = e[key]
            }
        }
        if (this.props.params) { // 任务入口
            this.props.handleSetTaskState('params', {
                ...this.props.params,
                filter: this.props.filter
            }, () => {
                this.props.handleSearchSubmit(obj, this.props.params.filter)
            })
        } else {
            this.props.handleSearchSubmit(obj)
        }
    }

    handleSearchReset = (e) => {
        if (this.props.params) { // 任务入口
            this.props.handleSetTaskState('filter', ['status'])
        }
        this.props.handleSearchReset(e)
    }

    bandleDownRefresh = () => {
        if (this.props.params) { // 任务入口
            this.props.bandleDownRefresh(this.props.params.filter)
        } else {
            this.props.bandleDownRefresh()
        }
    }

    render() {
        const {
            route,
            history,
            location,
            match,
            dateSetting,
            condition
        } = this.props
        return (
            <div style={{ height: '100%' }}>
                {condition && condition.length > 0 &&
                    <Accordion className="my-accordion">
                        <Accordion.Panel header="搜索">
                            <CustomForm formFields={condition} handleSubmit={this.handleSearchSubmit} handleReset={this.handleSearchReset} />
                        </Accordion.Panel>
                    </Accordion>
                }
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        overflow: 'auto',
                        height: this.state.height
                    }}
                    direction={'down'}
                    refreshing={this.props.refreshing}
                    onRefresh={this.bandleDownRefresh}
                >
                    {this.props.children}
                    <WingBlank>
                        <Pagination
                            className="mt-10 mb-10"
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

export default CompanyDetailPageModel
