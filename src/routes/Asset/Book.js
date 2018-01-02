import React from 'react'
import Asset from './Asset.js'

const TheBook = Asset({
    belong: 'book',
    title: '图书管理',
})

class Book extends React.Component {
    render() {
        return (
            <TheBook {...this.props} />
        )
    }
}

export default Book
