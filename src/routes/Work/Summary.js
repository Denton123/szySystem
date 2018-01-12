import React from 'react'
import Sy from 'COMPONENTS/page/Summary'

const TotalSummary = Sy({
    personal: false
})

class Summary extends React.Component {
    render() {
        return (
            <TotalSummary {...this.props} />
        )
    }
}

export default Summary
