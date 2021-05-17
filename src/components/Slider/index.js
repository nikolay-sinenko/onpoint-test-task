import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind'
import style from './index.scss'
const cx = classNames.bind(style)


/*
    Контрол-слайдер
*/

const Slider = ({ 
    value,      //  Начальное значение
    maxValue,   //  Максимальное значение
    labels,     //  Подписи к точкам слайда
    onChange,   //  Callback компонента-родителя
    name        //  Опциональное свойство для генерации key-аттрибута у подписей
}) => {

    //  Расстояние между точками слайдера
    const pointsDistance = Math.floor(100 / (maxValue - 1 || 1));
    //  Радиус привязки ползунка к точке
    const threshold = pointsDistance / 2;
 
    //  Стейт для хранения текущего значения
    const [currentValue, setCurrentValue] = useState(value);

    //  Ссылка на DOM-элемент ползунка
    const refThumb = useRef();
    //  Ссылка на DOM-элемент всего слайдера
    const refSlider = useRef();

    //  Хук, который срабатывает при изменении занчения контрола
    //  из компонента-родителя
    useEffect(() => {
        //  Привязываем ползунок к точке,
        //  которая соответствует значению компонента-родителя
        snapThumbToPoint(value);
    }, [value]);

    //  Хук, который срабатывает при изменении значения контрола
    //  в контексте самого компонента
    useEffect(() => {
        //  Вызывем callback компонента-родителя
        onChange(currentValue);
    }, [currentValue])

    /*
        Обработчики событий drag'а
    */

    //  Обработчик начала drag'а
    const handleDragStart = (event) => {
        event.stopPropagation();

        //  Перемещаем ползунок и вычисляем новое значение
        const newValue = changeThumbPosition(event);

        //  Привязываем ползунок к новой точке
        snapThumbToPoint(newValue);

        //  Меняем значение контрола на новое
        setCurrentValue(newValue);

        //  Добавляем глобально обработчики drag'а
        //  для событий мыши
        window.onmouseup = handleDragEnd;
        window.onmousemove = handleDragMove;
    }

    //  Обработчик окончания
    const handleDragEnd = (event) => {
        event.stopPropagation();

        //  Перемещаем ползунок и вычисляем новое значение
        const newValue = changeThumbPosition(event);

        //  Привязываем ползунок к новой точке
        snapThumbToPoint(newValue);

        //  Меняем значение контрола на новое
        setCurrentValue(newValue);

        //  Удаляем обработчики
        window.onmouseup = null;
        window.onmousemove = null;
    };


    //  Обработчик перемещения
    const handleDragMove = (event) => {
        event.stopPropagation();

        //  Перемещаем ползунок и вычисляем новое значение
        const newValue = changeThumbPosition(event);

        //  Меняем значение контрола на новое
        setCurrentValue(newValue);
    };

    /*
        Вспомогательные функции
    */

    //  Функиця для перемещения ползунка
    //  и расчёта нового значения контрола
    const changeThumbPosition = (event) => {

        //  Получаем DOM-элемент слайдера
        const slider = refSlider.current;
   
        //  Получаем координату по оси X из объекта события
        let x = event.clientX || event.changedTouches[0].clientX;
        //  Вычитаем отступ слайдера от левого края
        x -= slider.offsetLeft;
      
        //  Нормализуем координату
        if (x < 0) x = 0;
        if (x > slider.clientWidth) x = slider.clientWidth;

        //  Расчитываем новое положение ползунка
        const newPosition = Math.floor(x / slider.clientWidth * 100);
        
        //  Перемещаем его
        moveThumb(newPosition);

        //  Рассчитываем новое значение контрола
        const newValue = findPointIndex(newPosition);

        //  Если полузнок не попал в область ни одной точки
        if (newValue < 0) 
        {
            //  Привязываем его к текущему значению
            snapThumbToPoint(currentValue);
            //  Возвращаем текущее значение
            return currentValue;
        }
        //  Возвращаем новое значение
        return newValue;
    };

    //  Функиця привязки ползунка к точке с плавной анимацией
    const snapThumbToPoint = (pointIndex) => {
        moveThumb(pointIndex * pointsDistance, "var(--transition-snap)");
    }

    //  Функция перемещения ползунка по треку (по муолчанию без анимации)
    const moveThumb = (position, transition = null) => {
        refThumb.current.style.transition = transition;
        refSlider.current.style.setProperty('--position', position);
    };

    //  Функция для расчёта индекса точки, в области которой находится ползунок
    const findPointIndex = (position) => {
        
        // Итерируем по всем точкам
        for(var index = 0; index < maxValue; index++)
        {
            // Ищем первую, в чью область попал ползунок
            if (
                position >= index * pointsDistance - threshold &&
                position <= index * pointsDistance + threshold
            ) return index;
        }

        //  Если область не найдена, 
        //  возвращаем отрицательное значение
        return -1;
    }
    
    /*
        Отображение компонента
    */

    return(
        <div 
            ref={refSlider} 
            className={cx('container')} 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            <div className={cx('track')}>
                <div ref={refThumb} className={cx('thumb')}></div>
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