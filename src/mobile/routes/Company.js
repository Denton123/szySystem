import React from 'react'
import { Grid, Icon } from 'antd-mobile'
import {
    Link
} from 'react-router-dom'

class Company extends React.Component {
    onGridItem = (el, index) => {
        console.log(el)
        console.log(index)
        this.props.handleSetState('CustomNavBarState', {...this.props.CustomNavBarState, title: el.name})
        // this.props.history.push(`${this.props.match.url}${el.path}`)
    }
    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes,
            handleSetState
        } = this.props
        console.log(this.props)
        return (
            <div style={{ padding: 24, background: '#fff' }}>
                Company
                <Grid
                    data={permissionRoutes}
                    columnNum={3}
                    onClick={this.onGridItem}
                    renderItem={(el, index) => (
                        <Link to={`${match.url}${el.path}`}>
                            <p><img style={{width: '33px', height: '33px'}} src="https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png" /></p>
                            {el.name}
                        </Link>
                    )} />
            </div>
        )
    }
}

export default Company
