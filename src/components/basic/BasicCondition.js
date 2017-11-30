import React from 'react'

class BasicCondition extends React.Component {
    render() {
        const conditions = this.props.conditions
        return (
            <div className={this.props.className || ''}>
                {conditions.map((condition, idx) => (
                    <div key={idx} className="inline-block mr-10">
                        <span>{condition.name}：</span>
                        <condition.component />
                    </div>
                ))}
            </div>
        )
    }
}

export default BasicCondition
