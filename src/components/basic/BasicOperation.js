import React from 'react'

class BasicOperation extends React.Component {
    render() {
        const operationBtns = this.props.operationBtns
        return (
            <div className={this.props.className || ''}>
                {operationBtns.map((Btn, idx) => (
                    <span key={idx} className="inline-block mr-10">
                        <Btn />
                    </span>
                ))}
            </div>
        )
    }
}

export default BasicOperation
