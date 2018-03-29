import React from 'react'
import { Grid, Icon } from 'antd-mobile'
import {
    Link
} from 'react-router-dom'

class Company extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // src: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'
            src: '/default_project_cover.png'
        }
    }
    onGridItem = (el, index) => {
        console.log(el)
        console.log(index)
        this.props.handleSetState('CustomNavBarState', {...this.props.CustomNavBarState, title: el.name})
        this.props.history.push(`${this.props.match.url}${el.path}`)
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
            <div>
                <Grid
                    data={permissionRoutes}
                    square={false}
                    columnNum={3}
                    onClick={this.onGridItem}
                    renderItem={(el, index) => (
                        <div style={{color: '#808080'}}>
                            <p className={`iconfont icon-${el.icon}`} />
                            {el.name}
                        </div>
                    )} />
            </div>
        )
    }
}

export default Company
// <img src={`/img/${el.icon}.png`} />
