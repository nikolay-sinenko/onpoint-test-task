import React, { useEffect, useRef } from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

import Point from '@components/Point'

/*
    Первый экран
*/
const Intro = () => {

    //  Ссылка на DOM-элемент блока с точками
    const refContentBlock = useRef();
    //  Ссылка на подсказку-указатель ("Листайте дальше")
    const refNextBlock = useRef();

    //  Хук, который срабатывает при монтировании компонента
    useEffect(() => {
        
        //  Инициализируем объект обсервера пересечений
        const observer = new IntersectionObserver(event => {
            //  Изменяем видимость подсказки в зависимости от направления пересечения
            refNextBlock.current.style.opacity = event[0].intersectionRatio > 0 ? 1 : 0;
        })
        //  Устанавливаем обсервер следить за пересечением блока с точками границами viewport'а
        observer.observe(refContentBlock.current)
    }, [])

    /*
        Отображение компонента
    */
    return (
        <React.Fragment>
            <h1 className={cx('heading')}>Всегда ли цели терапии СД2 на поверхности?</h1>
            
            <div ref={refContentBlock} className={cx('content')}>
                <Point className={cx('point')} labelRight>Цель по HbA1c</Point>
                <Point className={cx('point')}>Гипогликемия</Point>
                <Point className={cx('point')}>СС риски</Point>
                <Point className={cx('point')}>Осложнения СД</Point>
            </div>

            <div ref={refNextBlock} className={cx('next')}>Листайте вниз</div>
        </React.Fragment>
    )
}

export default Intro;