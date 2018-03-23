import React from 'react'

import Asset from '../../../components/page/Asset'

let TheBook = Asset({
    belong: 'book'
})

class Book extends React.Component {
    render() {
        return (
            <TheBook {...this.props} />
        )
    }
}

export default Book
