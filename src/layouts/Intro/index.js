import React, { useEffect, useRef } from 'react'

import _ from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

import Point from '@components/Point'

const Intro = () => {

    const refRoot = useRef();
    const refNext = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(e => {
            refNext.current.style.opacity = e[0].intersectionRatio > 0 ? 1 : 0;
        })
        observer.observe(refRoot.current)
    }, [])

    return (
        <React.Fragment>
            <h1 className={cx('heading')}>Всегда ли цели терапии СД2 на поверхности?</h1>
            
            <div ref={refRoot} className={cx('content')}>
                <Point className={cx('point')} labelRight>Цель по HbA1c</Point>
                <Point className={cx('point')}>Гипогликемия</Point>
                <Point className={cx('point')}>СС риски</Point>
                <Point className={cx('point')}>Осложнения СД</Point>
            </div>

            <div ref={refNext} className={cx('next')}>Листайте вниз</div>
        </React.Fragment>
    )
}

export default Intro;