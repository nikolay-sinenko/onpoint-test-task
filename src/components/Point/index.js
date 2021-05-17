import React from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

/*
    Пульсирующие точки с подписями
*/

const Point = ({
    children,       //  Содержимое подписи
    className,      //  Внешние классы
    ...props        //  Прочие свойства
}) => {
    return (
        <div className={cx(className, 'pulse')}>
            <div className={cx('label', { 'label--right' : props.labelRight })}>
                {children}
            </div>
        </div>
    )
}

export default Point;