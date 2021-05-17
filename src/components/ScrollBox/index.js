import React, { useState, useEffect, useRef } from 'react'

import lodash from 'lodash'
import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)


/*
    Блок слайдов с контролом
*/

function withControl(Control, options = {}) {

    return ({ 
        children,       //  Дочерние элементы
        classNames,     //  Внешние имена классов
        ...props        //  Прочие параметры 
    }) => {

        /*
            Переменные
        */

        //  Направление прокрутки слайдов
        const isVertical = props.vertical || !props.horizontal;

        //  Перечень классов главного контейнера
        //  К ним примешиваются классы, переданные из родительского компонента
        const rootContainerClasses = cx({
            'container': true, 
            'container--vertical': isVertical,
            'container--horizontal': !isVertical
        }, classNames)

        //  Общее количество слайдов
        const slidesCount = React.Children.count(children);

        //  Подписи к слайдам (для контрола)
        const slidesLabels = React.Children.toArray(children)
            .map((element, index) => element.props.label || `Slide ${index + 1}`);

        //  Ссылка на DOM-элемент главного контейнера
        const refRootContainer = useRef();
        
        //  Стейт для хранения индекса текущего слайда
        const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

        //  Хук, который срабатывает при изменении индекса слайда
        useEffect(() => {

            //  Получаем DOM-элемент контейнера
            const root = refRootContainer.current;

            //  Скроллим его в направлении прокрутки
            //  на (размер слайда * номер слайда) px
            root.scrollTo({
                ...(isVertical ? {
                    top: root.clientHeight * currentSlideIndex,
                } : {
                    left: root.clientWidth * currentSlideIndex,
                }),
                behavior: 'smooth' // Делаем это нежно
            });            
            
        }, [currentSlideIndex]);

        //  Обёртка над функцией изменения стейта,
        //  которая гарантирует, что при множественных вызовах за короткий временной промежуток (100мс)
        //  стейт изменится только один раз
        const setCurrentSlideIndexDebounced = lodash.debounce(setCurrentSlideIndex, 100);

        /*
            Обработчик события изменения значения контрола
        */

        const handleControlValueChange = (value) => {
            //  Изменяем индекс слайда, на значение, переданное из контрола
            setCurrentSlideIndex(value);
        }

        /*
            Обработчик события колёсика мыши
        */
    
        const handleWheelScroll = event => {

            //  Определяем направление сдвига индекса слайда
            const shift = Math.sign(event.deltaY);

            //  Проверяем граничные условия
            if (
                shift < 0 && currentSlideIndex == 0 ||
                shift > 0 && currentSlideIndex == slidesCount - 1
            ) return;

            //  Не даём событию всплыть,
            //  чтобы избежать нежелательных пересечений
            event.stopPropagation();
            
            //  Изменяем номер слайда в соответствии со сдвигом
            //  Чтобы избежать изменения индекса сразу на несколько пунктов,
            //  используем debounce-верисю функции-сеттера
            setCurrentSlideIndexDebounced(currentSlideIndex + shift);
        }

        /*
            Обработчики событий свайпа
        */

        //  Начальные значения координат
        const intialCoords = {  X: 0, Y: 0 };

        //  Сдвиги индекса слайда
        const shift = { X: 0, Y: 0};

        //  Флаг поднятия события 
        let propagateForward = false;


        //  Обработчик начала свайпа
        const handleTouchStart = (event) => {
            event.stopPropagation();

            //  Получаем координаты из объекта события
            const eventCoords = event.touches[0] ?? event;

            //  Фиксируем начальные координаты
            intialCoords.Y = eventCoords.clientY;
            intialCoords.X = eventCoords.clientX;

            //  Сбрасываем флаг поднятия
            propagateForward = false;
        }
        

        //  Обработчик перемещения свайпа
        const handleTouchMove = (event) => {

            //  Получаем координаты из объекта события
            const eventCoords = event.touches[0] ?? event;

            //  Вычисляем изменение движения свайпа по осям
            const delta = {
                X: intialCoords.X - eventCoords.clientX,
                Y: intialCoords.Y - eventCoords.clientY
            }
            
            //  Фиксируем координаты
            intialCoords.X =  eventCoords.clientX;
            intialCoords.Y =  eventCoords.clientY;
            
            //  Определяем направление сдвига индекса слайда
            shift.X = Math.sign(delta.X);
            shift.Y = Math.sign(delta.Y);
            
            //  Если прокрутка горизонтальная, но свайп вертикальный
            if (!isVertical && Math.abs(delta.Y) > Math.abs(delta.X))
            {
                //  Устанавливаем флаг поднятия события
                propagateForward = true;
                //  Завершаем обработку
                return;
            }
        
            //  Не даём событию всплыть,
            //  чтобы избежать нежелательных пересечений
            event.stopPropagation();
        }


        //  Обработчик окончания свайпа
        const handleTouchEnd = (event) => {

            //  Не даём событию всплыть, 
            //  если не установлен соответсвующий флаг
            if (!propagateForward) event.stopPropagation();
        
            //  Проверяем граничные условия
            if (
                isVertical  && shift.Y < 0 && currentSlideIndex == 0 ||
                isVertical  && shift.Y > 0 && currentSlideIndex == slidesCount - 1 ||
                !isVertical && shift.X < 0 && currentSlideIndex == 0 ||
                !isVertical && shift.X > 0 && currentSlideIndex == slidesCount - 1
            ) return;
            
            //  Если прокрутка вертикальная
            if (isVertical)
                //  Меняем иднекс слайда согласно сдвигу по оси Y
                setCurrentSlideIndex(currentSlideIndex + shift.Y);
            //  Если прокрутка горизонтальная, и событие не поднимается
            else if (!propagateForward)
                //  Меняем индекс слайда согласно сдвигу по оси X
                setCurrentSlideIndex(currentSlideIndex + shift.X);
        }


         /*
            Отображение компонента
        */

        return (
            <React.Fragment>

                <div 
                    className={rootContainerClasses} 
                    
                    onWheel={handleWheelScroll}

                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}

                    ref={refRootContainer}
                >
                    {/* Генерируем блок-обёртку для каждого слайда */}
                    {React.Children.map(children, (slideContent) => (
                        <div className={cx('item')}>
                            {slideContent}
                        </div>
                    ))}
                </div>

                <Control
                    value={currentSlideIndex}
                    name={options.name}
                    labels={slidesLabels}
                    maxValue={slidesCount} 
                    onChange={handleControlValueChange} 
                />

            </React.Fragment>
        )
    }
}

export default withControl;