import React from 'react'
import ReactDOM from 'react-dom'
import { createForm } from 'rc-form'
import {
    List, TextareaItem, Button
} from 'antd-mobile'

class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                console.log(this.props.form.getFieldsValue())
            } else {
                console.log(error)
                alert('Validation failed')
            }
        })
    }

    render() {
        const { getFieldProps } = this.props.form
        console.log(getFieldProps)
        return (<div>
            <TextareaItem
                {...getFieldProps('control')}
                title="受控组件"
                type="phone"
                placeholder="controlled"
            />
            <Button type="primary" size="small" inline onClick={this.onSubmit}>Submit</Button>
        </div>)
    }
}

const TextareaItemExampleWrapper = createForm()(Demo)
export default TextareaItemExampleWrapper
