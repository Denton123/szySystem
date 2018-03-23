import React from 'react'

import Asset from '../../../components/page/Asset'

let TheEquipment = Asset({
    belong: 'equipment'
})

class Equipment extends React.Component {
    render() {
        return (
            <TheEquipment {...this.props} />
        )
    }
}

export default Equipment
