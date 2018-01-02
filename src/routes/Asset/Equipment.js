import React from 'react'
import Asset from './Asset.js'

const TheEquipment = Asset({
    belong: 'equipment',
    title: '设备管理',
})

class Equipment extends React.Component {
    render() {
        return (
            <TheEquipment {...this.props} />
        )
    }
}

export default Equipment
