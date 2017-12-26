import React from 'react'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

class CustomTree extends React.Component {
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode {...item} />
        })
    }
    render() {
        return (
            <Tree
                checkable
                onCheck={this.props.onCheck}
                checkedKeys={this.props.checkedKeys}
            >
                {this.renderTreeNodes(this.props.list)}
            </Tree>
        )
    }
}

export default CustomTree
