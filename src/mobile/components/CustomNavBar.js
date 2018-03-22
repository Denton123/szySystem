/*
头部导航栏
 */
import React from 'react'
import { NavBar, Icon } from 'antd-mobile'

class CustomNavBar extends React.Component {
    render() {
        const {
            title,
            icon,
            leftClick,
            rightContent,
        } = this.props
        return (
            <NavBar
                icon={<Icon type={icon} />}
                onLeftClick={leftClick}
                rightContent={rightContent}
            >
                {title}
            </NavBar>
        )
    }
}

export default CustomNavBar
