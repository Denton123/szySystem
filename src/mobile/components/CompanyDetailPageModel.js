import React from 'react'
import ReactDOM from 'react-dom'
import {
    Pagination,
    WingBlank,
    Button,
    PullToRefresh,
    Accordion
} from 'antd-mobile'
import CustomForm from './CustomForm'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class CompanyDetailPageModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 刷新设置
            height: document.documentElement.clientHeight
        }
    }

    componentWillMount() {
        if (this.props.params) { // 任务入口
            this.props.getData(this.props.params.obj, this.props.params.arr)
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
        if (this.props.params) { // 任务入口
            this.props.handleSearchSubmit(e, this.props.params.arr)
        } else {
            this.props.handleSearchSubmit(e)
        }
    }

    handleSearchReset = (e) => {
        console.log('CompanyDetailPageModel.js handleSearchReset ----')
        console.log(this.props.resetNotFilter)
        if (this.props.resetNotFilter) { // 任务管理的特效处理入口
            if (this.props.type) {
                console.log(this.props.type)
                let value = this.props.type === 'normal' ? 'null' : 'notnull'
                this.props.history.replace(this.props.location.pathname, {...this.props.location.state, project_id: value})
                console.log(this.props)
            }
            this.props.handleSearchReset(e, this.props.resetNotFilter)
        } else { // 其他
            this.props.handleSearchReset(e)
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
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
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
                        height: this.state.height,
                        overflow: 'auto'
                    }}
                    direction={'down'}
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.bandleDownRefresh}
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
