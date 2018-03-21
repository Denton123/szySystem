import React from 'react'
import {
    Icon,
    Card,
    Tabs,
    Pagination
} from 'antd-mobile'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

import withBasicDataModel from '../../../components/withBasicDataModel'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class WorkerAffairs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
        this.props.getData()
    }

    handleChangePage = (e) => {
        console.log(e)
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
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
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
                <Pagination total={dateSetting.total} current={1} locale={locale} onChange={this.handleChangePage} />
            </div>
        )
    }
}

export default withBasicDataModel(WorkerAffairs, {
    model: 'user'
})
