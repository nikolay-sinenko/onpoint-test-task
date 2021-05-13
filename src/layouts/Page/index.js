import React from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)

import withControl from '@components/ScrollBox'
import Pagination from '@components/Pagination'
import Slider from '@components/Slider'

import Intro from '../Intro';
import Filler from '../Filler';
import Schema from '@components/Schema';


const MainScroll = withControl(Pagination, { name: "dots-control"});
const InnerScroll = withControl(Slider);

function Page() {
    return(
        <MainScroll classNames={cx('background')} vertical>
            <Intro />
            <Filler />
            <InnerScroll horizontal>
                <Schema 
                    label="1988" 
                    title="Звенья патогенеза СД2"
                    imageName="tab_1"
                    sprite ="slide_3_ice_1"
                    size="60%"
                />
                <Schema 
                    label="2009" 
                    title="Смертельный октет"
                    imageName="tab_2"
                    sprite ="slide_3_ice_2"
                    size="70%"
                />
                <Schema 
                    label="2016" 
                    title="Звенья патогенеза СД2"
                    imageName="tab_3"
                    sprite ="slide_3_ice_3"
                    size="80%"
                />
            </InnerScroll>
        </MainScroll>
    )
}

export default Page;