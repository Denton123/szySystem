import React from 'react'
import { Form, Button, Icon, Input } from 'antd'

import './CustomDynamicForm.less'

const FormItem = Form.Item

/**
 * props属性(存在*的属性，在父组件是必须传值)
 * dynamicKeys           {array}    动态表单记录的key值      *
 * dynamicAdd            {function} 新增一项                 *
 * dynamicRemove         {function} 移除一项动态表单         *
 * handleSubmit          {function} 提交表单的方法           *
 * formFields            {array}    表单字段数组             *
 * isSubmitting          {boolean}  表单提交按钮loading状态  - 当customFormOperation传入后，这值不需要再传
 * customFormItemLayout  {object}   表单行的布局
 */

class CustomDynamicForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmit(values)
            }
        })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const {
            formFields,
            dynamicKeys
        } = this.props

        const defaultLabelCol = {
            xs: { span: 4, offset: 0 },
            sm: { span: 4, offset: 0 },
            md: { span: 4, offset: 0 },
            lg: { span: 4, offset: 0 },
            xl: { span: 4, offset: 0 },
            xxl: { span: 4, offset: 0 }
        }
        const defaultWrapperCol = {
            xs: { span: 14, offset: 1 },
            sm: { span: 14, offset: 1 },
            md: { span: 14, offset: 1 },
            lg: { span: 14, offset: 1 },
            xl: { span: 14, offset: 1 },
            xxl: { span: 14, offset: 1 }
        }

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
                md: { span: 24, offset: 0 },
                lg: { span: 24, offset: 0 },
                xl: { span: 24, offset: 0 },
                xxl: { span: 24, offset: 0 }
            },
        }

        const formItemLayout = this.props.customFormItemLayout
            ? this.props.customFormItemLayout
            : {
                labelCol: defaultLabelCol,
                wrapperCol: defaultWrapperCol
            }

        const formFieldsLength = formFields.length

        getFieldDecorator('keys', { initialValue: dynamicKeys })
        const keys = getFieldValue('keys')
        const formItems = keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    label={''}
                    required={false}
                    key={k}
                >
                    {formFields.map((item, idx) => (
                        <FormItem
                            {...formItemLayout}
                            label={item.label}
                            style={formFieldsLength > 1 ? {marginBottom: 8} : {marginBottom: 0}}
                            required={false}
                            key={idx}
                        >
                            {getFieldDecorator(`${item.field}-${k}`, item.valid)(item.component)}
                        </FormItem>
                    ))}
                    {keys.length > 1 ? (
                        <Icon
                            className="ml-10 dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.props.dynamicRemove(k)}
                        />
                    ) : null}
                </FormItem>
            )
        })
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel} className="txt-c">
                    <Button type="dashed" onClick={this.props.dynamicAdd} style={{ width: '60%' }}>
                        <Icon type="plus" /> 新增
                    </Button>
                </FormItem>
                <FormItem {...formItemLayoutWithOutLabel} className="txt-c">
                    <Button type="primary" htmlType="submit" loading={this.props.isSubmitting}>提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create({
    // // 当 Form.Item 子节点的值发生改变时触发
    // onFieldsChange: function(props, values) {
    //     props.updateFormFields(values)
    // },
    // // 把父组件的属性映射到表单项上
    // mapPropsToFields(props) {
    //     let obj = {}
    //     for (let i in props.formFieldsValues) {
    //         obj[i] = Form.createFormField({
    //             ...props.formFieldsValues[i],
    //             value: props.formFieldsValues[i].value
    //         })
    //     }
    //     return obj
    // }
})(CustomDynamicForm)
