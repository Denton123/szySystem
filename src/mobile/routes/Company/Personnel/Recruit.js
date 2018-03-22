import React from 'react'
import {
    Icon,
    Card,
    Tabs,
    Pagination,
    List,
    WingBlank
} from 'antd-mobile'
import withBasicDataModel from '../../../components/withBasicDataModel'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

const Item = List.Item
const Brief = Item.Brief

class Recruit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
        this.props.getData()
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

        return (
            <div>
                <List className="my-list">
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (<Item extra={obj.job} key={i}>{obj.interviewee}</Item>)) : <p className="mt-10">暂无数据</p>
                    }
                </List>
                <WingBlank>
                    <Pagination
                        className="mt-10"
                        total={dateSetting.pagination.total}
                        current={dateSetting.pagination.current}
                        locale={locale}
                        onChange={this.props.handlePageChange} />
                </WingBlank>
            </div>
        )
    }
}

export default withBasicDataModel(Recruit, {
    model: 'recruit'
})
