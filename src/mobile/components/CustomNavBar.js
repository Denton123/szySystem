import React from 'react'
import { NavBar, Icon } from 'antd-mobile'

class CustomNavBar extends React.Component {
    render() {
        const {
            title,
            icon,
            leftClick,
        } = this.props
        return (
            <NavBar
                icon={<Icon type={icon} />}
                onLeftClick={leftClick}
            >
                {title}
            </NavBar>
        )
    }
}

export default CustomNavBar
