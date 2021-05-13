import React, { useCallback, useEffect, useRef, useState } from 'react'

import _ from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

const Slider = ({ 
    name, 
    value, 
    labels, 
    maxValue, 
    onChange
}) => {

    const span = Math.floor(100 / (maxValue - 1 || 1));
    const treshhold = span / 2;
    const snapArea = treshhold / 1.5;
 
    const [current, setCurrent] = useState(value);

    const refThumb = useRef();
    const refSlider = useRef();

    useEffect(useCallback(() => {
        snap(value);
    }), [value]);

    useEffect(useCallback(() => {
        snap(current);
        onChange(current);
    }), [current]);

    useEffect(() => {
        const thumb = refThumb.current;
        const slider = refSlider.current;

        [ thumb, slider ].forEach(el => {
            el.addEventListener('mousedown', handleDragStart);

            el.addEventListener('touchstart', handleDragStart, { passive: false });
            el.addEventListener('touchmove', handleDrag);
            el.addEventListener('touchend', handleDragEnd);
        })
        
        return () => {
            [ thumb, slider ].forEach(el => {
                el.removeEventListener('mousedown', handleDragStart);
                el.removeEventListener('touchstart', handleDragStart);
                el.removeEventListener('touchmove', handleDrag);
                el.removeEventListener('touchend', handleDragEnd);
            })
        }

    }, []);

    const handleDragStart = (e) => {
        changePos(e);

        window.onmouseup = handleDragEnd;
        window.onmousemove = handleDrag;
    };

    const handleDragEnd = (e) => {
        const curr = findSpan(changePos(e));

        snap(curr)
        setCurrent(curr);

        window.onmouseup = window.onmousemove = null;
    };

    const handleDrag = _.debounce((e) => {
        const curr = findSpan(changePos(e), snapArea);
        
        if (curr < 0) return;
        
        snap(curr);
        setCurrent(curr);

    }, 10);

    const changePos = (e) => {

        const slider = refSlider.current;

        let x = e.clientX || e.changedTouches[0].clientX;
        x -= slider.offsetLeft;

        x = _.clamp(x, 0, slider.clientWidth);

        let pos = Math.floor(x / slider.clientWidth * 100);
        
        moveTo(pos);
        return pos;
    };

    const snap = (idx) => {
        moveTo(idx * span, "var(--transition-snap)");
    }

    const moveTo = (position, transition = null) => {
        refThumb.current.style.transition = transition;
        refSlider.current.style.setProperty('--position', position);
    };

    const findSpan = (pos, area = treshhold) => (
        _.times(maxValue, (idx) => (
            pos >= idx * span - area && 
            pos <= idx * span + area
        )).findIndex(x => x)
    );

    return(
        <div ref={refSlider} className={cx('container')} >
            <div className={cx('track')}>
                <button 
                    ref={refThumb}
                    type="button" 
                    className={cx('thumb')}
                >
                </button>
            </div>
            <ul className={cx('legend')}>
                {labels.map((label, idx) => (
                    <li key={`${name}-${idx}`} className={cx('label')}>{label}</li>
                ))}
            </ul>
        </div>
    )
}

export default Slider;