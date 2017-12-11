import React from 'react'
import { Form, Button } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
/**
 * props属性(存在*的属性，在父组件是必须传值)
 * handleSubmit          {function} 提交表单的方法           *
 * formFields            {array}    表单字段数组             *
 * updateFormFields      {function} 更新表单字段时的方法     *
 * formFieldsValues      {object}   表单全部字段的值         *
 * customFormItemLayout  {object}   表单行的布局
 * layout                {string}   表单布局方式             默认'horizontal'    'horizontal'|'vertical'|'inline'
 * formStyle             {object}   表单样式
 * customFormOperation   {ReactNode}表单的提交时的按钮
 * customOperationLayout {object}   表单提交操作行的布局
 * isSubmitting          {boolean}  表单提交按钮loading状态  - 当customFormOperation传入后，这值不需要再传
 * formItemStyle         {object}   表单域的样式             默认 {}
 */
class CustomForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmit(values)
            }
            console.log('Received values of form: ', values)
        })
    }
    render() {
        const defaultLabelCol = {
            xs: { span: 6, offset: 0 },
            sm: { span: 6, offset: 0 },
            md: { span: 6, offset: 0 },
            lg: { span: 6, offset: 0 },
            xl: { span: 6, offset: 0 },
            xxl: { span: 6, offset: 0 }
        }
        const defaultWrapperCol = {
            xs: { span: 16, offset: 1 },
            sm: { span: 16, offset: 1 },
            md: { span: 16, offset: 1 },
            lg: { span: 16, offset: 1 },
            xl: { span: 16, offset: 1 },
            xxl: { span: 16, offset: 1 }
        }
        const defaultOperationLayout = {
            xs: { span: 8, offset: 8 },
            sm: { span: 8, offset: 8 },
            md: { span: 8, offset: 8 },
            lg: { span: 8, offset: 8 },
            xl: { span: 8, offset: 8 },
            xxl: { span: 8, offset: 8 }
        }
        const {getFieldDecorator} = this.props.form
        const {formFields} = this.props
        const formItemLayout = this.props.customFormItemLayout
            ? this.props.customFormItemLayout
            : {
                labelCol: defaultLabelCol,
                wrapperCol: defaultWrapperCol
            }
        const operationLayout = this.props.customOperationLayout
            ? this.props.customOperationLayout
            : defaultOperationLayout
        const layout = this.props.layout ? this.props.layout : 'horizontal'
        const formStyle = this.props.formStyle ? this.props.formStyle : {width: 300}
        return (
            <Form onSubmit={this.handleSubmit} layout={layout} style={formStyle}>
                {formFields.map((item, idx) => (
                    <FormItem key={idx} label={item.label ? item.label : ''} {...formItemLayout} style={item.formItemStyle ? item.formItemStyle : {}}>
                        {item.field
                            ? getFieldDecorator(item.field, item.valid ? item.valid : {})(item.component)
                            : item.component
                        }
                    </FormItem>
                ))}
                <FormItem wrapperCol={operationLayout}>
                    {
                        this.props.customFormOperation
                        ? this.props.customFormOperation
                        : (
                            <Button type="primary" htmlType="submit" loading={this.props.isSubmitting}>
                                保存
                            </Button>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}

export default Form.create({
    // 当 Form.Item 子节点的值发生改变时触发
    onFieldsChange: function(props, values) {
        props.updateFormFields(values)
    },
    // 把父组件的属性映射到表单项上
    mapPropsToFields(props) {
        let obj = {}
        for (let i in props.formFieldsValues) {
            obj[i] = Form.createFormField({
                ...props.formFieldsValues[i],
                value: props.formFieldsValues[i].value
            })
        }
        return obj
    }
})(CustomForm)
