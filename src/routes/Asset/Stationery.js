import React from 'react'
import Asset from 'COMPONENTS/page/Asset.js'

const TheStationery = Asset({
    belong: 'stationery',
    title: '办公用品管理',
})

class Stationery extends React.Component {
    render() {
        return (
            <TheStationery {...this.props} />
        )
    }
}

export default Stationery
