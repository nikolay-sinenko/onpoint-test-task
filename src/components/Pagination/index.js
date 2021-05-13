import React from 'react'

import _ from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

const Pagination = ({ 
    name,
    value,
    maxValue,
    onChange
}) => {

    const handleChange = _.debounce(({ target: { value }}) => {
        onChange(value);
    }, 10)

    return (
        <div className={cx('container')} >
            {_.times(maxValue, (idx) => (
                <input
                    className={cx('dot')}
                    type="radio" 
                    name={name} 
                    key={`${name}-${idx}`}
                    onChange={handleChange}
                    checked={idx == value}
                    value={idx}
                />
            ))}
        </div>
    )
}

export default Pagination;