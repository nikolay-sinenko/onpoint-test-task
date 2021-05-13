# Onpoint Test Task

## Задача

**ТЗ:** В качестве тестового задания необходимо сверстать слайдер в соответствии с [демо-роликом](https://www.youtube.com/watch?v=bH9zEDcMlBA) по предоставленному макету. Слайдер будет тестироваться в Chrome в режиме совместимости с iPad (только 1024 x 768)

**Требования:** Не использовать библиотеки `jQuery`, `fullpagescroll`, etc.

---
## Решение

Основной идеей стало использование CSS-свойств `scroll-snap-type` и `scroll-snap-align` для реализации fullpage-прокрутки. Если есть встроенные в браузер инструменты, позволяющее сделать это, почему бы ими не воспользоваться, правда? Особенно если учесть, что они неплохо сочетаются с методами `scrollTo`, `scrollBy` и `scrollIntoView`.

Основу составляют два блока контента: **главный** (скроллится по вертикали) и **внутренний** (по горизонтали). Каждому из них соответсвует свой **контрол** - круглые кнопки сбоку для главного блока и слайдер для внутреннего.

Очевидно, что у обоих блоков одинаковая логика взаимодействия со своим контролом: при скролле блока контрол меняет своё значение, и наоборот - при изменении значения контрола блок скроллится до нужного слайда.

Таким образом, можно выделить их в единую сущность **"Блок+Контрол"**, внутри которой действует интерфейс взаимодействия: `onScroll` и `onChange`

В случае со слайдером, его значение - номер слайда, который расчитывается из положения ползунка в треке. Сам слайдер реализован следующим образом:

- **Трек** - flex-элемент, внутри которого располагается ползунок и псевдо-элемент, который имитирует заполнение трека перед ползунком.
- **Ползунок** - позиционируется отступом от правого края трека свойством `margin-right`, которое рассчитывается по формуле `100% - Pos * 1%`, где `Pos` это число от 0 до 100, которое задаётся кастомным CSS-свойством `--position`.
- **Псевдо-элемент** - заполняет всё доступное пространство (свойство `flex: 1`)

Соответственно, изменяя в скрипте `--position`, можно двигать сам ползунок. Помимо этого, при необходимости можно дополнительно переключать свойство `transition`, чтобы ползунок перемещался плавно (например, когда меняется слайд при скролле)

Расчёт же номера слайда идёт исходя из количества самих слайдов. Весь трек делится на равные отрезки `[x - treshhold, x + treshhold]`, где `treshhold` это радиус отрезка. При изменении позиции ползунка вычисляется, попадает ли тот в какой либо отрезок, и когда это происходит, ползунок "магнитися" к центру отрезка и блок скроллится к слайду, которому данный отрезок соответствует.

> **Примечание:** Поскольку события `scroll` и `mousemove` / `touchmove` (при drag'е ползунка) вызываются очень часто, чтобы уменьшить количество обрабатываемых событий, я применял ***deboucing*** к callback-ам. Чтобы не изобретать свой велосипед, воспользовался готовым решением - `_.debounce` из utility-библиотеки `lodash`

С остальными же деталями реализации можно ознакомиться непосредственно в файлах проекта.

---
## Стэк

Для разработки и сборки проекта я использовал следующий инструментарий:

- `Webpack` + `Babel`
- `SCSS` + `PostCSS` + `CSS-Modules` + `BEM`
- `React`

Концепцию `CSS-Modules` мне ещё не доводилось использовать на практике, поэтому было довольно интересно попробовать реализовать её в связке с `SCSS`. А с помощью `Webpack` получилось дополнить эту связку тем, что при сборке имена классов приводятся к `BEM`-нотации.

Однако, стоит понимать, что проект довольно маленький, поэтому тот же `PostCSS` присутствует скорее формально

Так что, увы, использовать потенциал всех этих технологий прям по полной не предоставилось возможности(

---
## Структура проекта

### **/components**

В данной директории собраны логически неделимые элементы, которые могут быть переиспользованы. Каждый компонент состоит из `index.js` - файл с логикой, и `index.scss` со стилями, имеющими отношение только к данному компоненту (`CSS 
Модуль`)

- **Pagination** - контрол для вертикального блока контента (круглые кнопки сбоку)
- **Slider** - контрол для горизонтального скролла
- **SkrollBox** - непосредственно сам блок. Возвращает ad-HOC обёртку над абстрактным контролом
- **Point** - пульсирующая точка с подписью с первого экрана
- **Schema** - блок-схема с заголовком из горизонтального блока контента

### **/layouts**

Здесь собраны компоненты более высокого порядка, которые фактически являются композициями базовых компонентов, и которые будут использованы в проекте только один раз. Они так же представляют собой `React`-компонент с `CSS Модулем`

- **Page** - само приложение
- **Intro** - первый экран
- **Filler** - второй экран

### **/styles**

В этой папке собраны общие для проекта файлы стилей с ресетами, подключением шрифтов, переменными и т.д. При сборке эти файлы воспринимаются не как `CSS Модули`, а как обычные `SCSS` файлы.

### **/assets**

Ресурсы проекта - шрифты `/fonts` и изображения `/img`. При сборке бандла меняются только ссылки, сами файлы не копируются. Рутину по обработке ресурсов я делал в полу-ручном режиме, т.к. пока не настолько хорошо дружу с `Webpack`'ом, чтобы полностью автоматизировать эти процессы, однако, как говорится, мы работаем над этим.

#### **/fonts**

Шрифты, представленные в макете, я нашёл в интернете в формате `.ttf`, однако суммарный размер составил около 3.2 Мб (что прям дофига), поэтому прогнал их через утилиту `glyphhanger` с кастомным сабсеттингом (латиница + кириллица), чтобы "отбросить" ненужные символы

<br/>
<details>
<summary>Команда для glyphhanger</summary>
<pre>
glyphhanger --subset=*.ttf --formats=woff-zopfli,woff2 --whitelist=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116
</pre>
</details>
<br/>

Таким образом, не смотря на то, что для каждого начертания я генерировал 2 файла - `woff` с zpofli-сжатием и `woff2` (brotli), удалось сжать файлы шрифтов до ~360 Кб суммарно, т.е. примерно в 9 раз. А если учесть, что при загрузке страницы будет отдаваться только первый поддерживаемый формат, то эффективность сжатия на самом деле вырастает вдвое. В рамках данного проекта, по-моему, приемлемо.

<img width="50%" src="https://sun9-73.userapi.com/impg/Vh_a4-LgjPLwhRZ7QXxCfivg0lOl2A7r08k3Og/tVszQEOm-FE.jpg?size=1080x1015&quality=96&sign=3a5c491c23b07d4f44123ac26b865c58&type=album" />

#### **/img**

Изображения я перегонял в `.webp` через сервис [Squoosh](https://squoosh.app/), и в итоге картинки ужались с 6.5 Мб до 650 Кб, что тоже довольно неплохо.

---
## P.S.

Это оказалось на удивление интересное задание, с кучей неочевидных подводных камней и тем к размышлению, поэтому независимо от дальнейшего развития событий, я от всей души благодарю компанию **`Onpoint`** за отклик на моё резюме и предоставленное тестовое задание :heart: