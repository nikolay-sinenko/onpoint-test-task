import React, { useEffect, useRef } from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)


/*
    Компонент для отображения блок-схемы
*/
const Schema = ({
    title,      //  Заголовок
    imageName,  //  Имя файла блок-схемы
    size,       //  Масштаб
    sprite      //  Имя файла фонового спрайта
}) => {

    //  Ссылка на DOM-элемент блока-обёртки
    const refWrap = useRef();

    //  Функция для динамической загрузки изображений
    const loadImage = name => require.context('@img')(`./${name}.webp`).default

    //  Хук, который срабатывает при монтировании компонента
    useEffect(()=>{
        //  Динамически подгружаем фоновые спрайты
        refWrap.current.style.backgroundImage = `url(${loadImage(sprite)})`;
    }, [])

    /*
        Отображение компонента
    */

    return (
        <div className={cx('wrapper')} ref={refWrap}>
            <h2 className={cx('heading')}>{title}</h2>

            <div className={cx('content')} style={{ width: size }}>
                <img src={loadImage(imageName)} alt={title} />
            </div>
        </div>
    )
}

export default Schema;