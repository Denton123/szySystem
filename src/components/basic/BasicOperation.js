import React from 'react'

class BasicOperation extends React.Component {
    render() {
        const operationBtns = this.props.operationBtns
        return (
            <div className={this.props.className || ''}>
                {operationBtns.map((Btn, idx) => (
                    <Btn key={idx} />
                ))}
            </div>
        )
    }
}

export default BasicOperation
