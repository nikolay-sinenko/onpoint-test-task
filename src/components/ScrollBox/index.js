import React, { useState, useEffect, useRef, useCallback } from 'react'

import _ from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

function withControl(Control, options = {}) {

    return ({ children, classNames, ...props }) => {

        const isVertical = props.vertical || !props.horizontal;

        const classes = cx({
            'container': true, 
            'container--vertical': isVertical,
            'container--horizontal': !isVertical
        }, classNames)

        const [current, setCurrent] = useState(0);
        const refRoot = useRef();

        useEffect(useCallback(() => {
            const root = refRoot.current;

            root.scrollTo({
                ...(isVertical ? {
                    top: root.clientHeight * current,
                } : {
                    left: root.clientWidth * current,
                }),
                behavior: 'smooth'
            });               

        }), [current]);

        const handleScroll = _.debounce(({ target }) => {

            const position = isVertical 
                ? target.scrollTop 
                : target.scrollLeft;

            const unit = isVertical 
                ? target.clientHeight 
                : target.clientWidth;

            const curr = Math.floor(position / unit);

            setCurrent(curr);
        }, 100);

        const handleControlChange = (value) => setCurrent(value);
    
        const labels = React.Children.toArray(children).map((el, idx) => el.props.label || `Slide ${idx+1}`);

        return (
            <React.Fragment>

                <div 
                    className={classes} 
                    onScroll={handleScroll}
                    ref={refRoot}
                >
                    {React.Children.map(children, (child) => (
                        <div className={cx('item')}>
                            {child}
                        </div>
                    ))}
                </div>

                <Control
                    value={current}
                    name={options.name}
                    labels={labels}
                    maxValue={React.Children.count(children)} 
                    onChange={handleControlChange} 
                />

            </React.Fragment>
        )
    }
}

export default withControl;