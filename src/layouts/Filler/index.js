import React from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

const Filler = () => {
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('text')}>Основа терапии — патогенез СД2</h1>
        </div>
    )
}

export default Filler;