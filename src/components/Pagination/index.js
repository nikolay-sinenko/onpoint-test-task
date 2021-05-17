import React from 'react'

import lodash from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

/*
    Контрол-пагинация
*/

const Pagination = ({ 
    value,      //  Начальное значение
    maxValue,   //  Максимальное значение
    onChange,   //  Callback компонента-родителя
    name        //  DOM-свойство name для группирования radio-input'ов
}) => {

    /*
        Обработчик изменения значения radio-input'ов
    */
    const handleChange = (event) => {
        //  Приводим значение к числовому типу
        //  т.к. по умолчанию value имеет строчный тип
        onChange(parseInt(event.target.value));
    }

    /*
        Отображение компонента
    */
    return (
        <div className={cx('container')} >
            {lodash.times(maxValue, (index) => (
                <input
                    className={cx('dot')}
                    type="radio" 
                    name={name} 
                    key={`${name}-${index}`}
                    onChange={handleChange}
                    checked={index == value}
                    value={index}
                />
            ))}
        </div>
    )
}

export default Pagination;