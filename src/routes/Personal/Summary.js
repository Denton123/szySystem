import React from 'react'
import Sy from 'COMPONENTS/page/Summary'

const PersonalSummary = Sy({
    personal: true
})

class Summary extends React.Component {
    render() {
        return (
            <PersonalSummary {...this.props} />
        )
    }
}

export default Summary
