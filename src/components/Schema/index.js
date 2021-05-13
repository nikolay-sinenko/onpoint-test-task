import React, { useEffect, useRef } from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

const Schema = ({
    title,
    imageName,
    size,
    sprite
}) => {

    const refWrap = useRef();

    const loadImage = name => require.context('@img')(`./${name}.webp`).default

    useEffect(()=>{
        refWrap.current.style.backgroundImage = `url(${loadImage(sprite)})`;
    }, [])

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