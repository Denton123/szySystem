import { Modal } from 'antd'

const CustomPrompt = function(settings, cb) {
    // cancelText  取消按钮文字  string  取消
    // content 内容  string|ReactNode    无
    // iconType    图标 Icon 类型  string  question-circle
    // maskClosable    点击蒙层是否允许关闭  Boolean false
    // okText  确认按钮文字  string  确定
    // okType  确认按钮类型  string  primary
    // title   标题  string|ReactNode    无
    // width   宽度  string|number   416
    // zIndex  设置 Modal 的 z-index  Number  1000
    // onCancel    取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 function    无
    // onOk    点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭

    // type类型包含info、success、error、warning、confirm
    const { type } = settings
    const props = {}
    for (let i in settings) {
        if (i === 'type') continue
        props[i] = settings[i]
    }
    const Prompt = Modal[type](props)
    cb && cb(Prompt)
}

export default CustomPrompt
