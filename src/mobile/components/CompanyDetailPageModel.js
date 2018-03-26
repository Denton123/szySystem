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
        console.log(this.props.params)
        if (this.props.params) {
            this.props.getData(this.props.params.obj, this.props.params.arr)
        } else {
            this.props.getData()
        }
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop
        setTimeout(() => this.setState({
            height: hei
        }), 0)
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
                            <CustomForm formFields={condition} handleSubmit={this.props.handleSearchSubmit} handleReset={this.props.handleSearchReset} />
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
