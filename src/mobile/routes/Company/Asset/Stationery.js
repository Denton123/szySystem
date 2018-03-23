import React from 'react'

import Asset from '../../../components/page/Asset'

let TheStationery = Asset({
    belong: 'stationery'
})

class Stationery extends React.Component {
    render() {
        return (
            <TheStationery {...this.props} />
        )
    }
}

export default Stationery
