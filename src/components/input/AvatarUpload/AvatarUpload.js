import React from 'react'
import { Upload, Icon, message } from 'antd'
import styles from './AvatarUpload.less'

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

// 上传文件之前的钩子,参数为上传的文件
function beforeUpload(file) {
    console.log('beforeUpload---')
    console.log(file)
    const isJPG = file.type === 'image/jpeg'
    if (!isJPG) {
        message.error('You can only upload JPG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isJPG && isLt2M
}

class Avatar extends React.Component {
    state = {}

    // 上传中、完成、失败都会调用这个函数。
    handleChange = (info) => {
        // 状态有：uploading done error removed
        if (info.file.status === 'done') {
            console.log('info---')
            console.log(info)
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                console.log('imageUrl---')
                this.setState({
                    imageUrl: imageUrl,
                    fileList: info.fileList
                })
                this.props.onChange(info)
            })
        }
    }

    render() {
        const imageUrl = this.state.imageUrl || this.props.imageUrl
        return (
            <Upload
                className="avatar-uploader"
                name="avatar"
                showUploadList={false}
                action="/api/user/uploaderImg"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {
                    imageUrl ? <img src={imageUrl} alt="" className="avatar" /> : <Icon type="plus" className="avatar-uploader-trigger" />
                }
            </Upload>
        )
    }
}

export default Avatar
