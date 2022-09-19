#This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm run start-local`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build-local`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject-local`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).


### Core map functionality was provided by <a href="http://maptalks.org">maptalks</a> powerded with &copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>

# Инструкция по работе с приложением Bus Watcher
## Работа с остановками

Один из способов оценить качество работы транспорта – это оценить затраты пассажира на передвижение между некоторыми двумя точками. 
Затраты складываются из времени поездки, стоимости билетов, уровня дискомфорта из-за пересадок или забитых салонов и т.д.
Для простоты будем считать, что начальная и конечная точки маршрута – это остановки (игнорируем время пешей прогулки до начальной остановки и от конечной).

Приложение представляет из себя интерактивную веб-карту, позволяющую исследовать затраты на передвижение:

1. На карте отображаются остановки. Изначально ни одна остановка не выбрана.
2. При наведении курсора мыши на остановку появляется подсказка с id и 
названием этой остановки.
3. При клике на остановке она становится выбранной:
* все остальные остановки окрашиваются в цвет, показывающий затраты на перемещение от выбранной до неё;
* при наведении на остальные остановки появляется подсказка. На 
подсказке показано: id и название этой остановки; параметры перемещения: агрегированные затраты, время ожидания, время в салоне, 
число пересадок, штраф за пересадки;
* клик на другой остановке делает её выбранной (т.е. меняет выбранную остановку);
* клик на любом свободном участке карты отменяет выбор (т.е. возвращает карту в исходное состояние).

Карта поддерживает зуминг. Остановки показыватся на фоне карты &copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>

Для раскраски остановок используется параметр "cost" (Агрегированные затраты на передвижение (мин.)).
Выбранная остановка становится начальной, а  все остальные - конечными.
Соблюдается следующая зависимость цвета от параметра "cost" : 
*5 минут и менее — зеленый.
*5-15 минут — желтый
*15-30 минут - красный
*больше 30-ти минут - тёмно-фиолетовый
*нельзя доехать - чёрный.

Для более комфортной работы с остановками настоятельно рекомендуется немного приблизить карту, чтобы остановки отчетливо различались.

## Работа с маршрутами

Улицы и дороги Москвы постоянно меняются: запускаются эстакады,
переделываются перекрёстки, для автобусов создаются выделенки, дороги с
переделываются перекрёстки, для автобусов создаются выделенки, дороги с
двусторонним движением становятся односторонними и наоборот, и т.д. Маршруты общественного транспорта, которые ходят по этим дорогам и улицам, нужно обновлять. В простых случаях это можно сделать автоматически, в сложных
приходится исследовать детали и исправлять маршрут вручную.

Для работы с инструментом "Маршруты" оператору предоставляются функции:
Отобразить все маршруты на карте.
Скрыть все маршруты на карте (вновь отображаются при нажатии на кнопку "Отобразить").
Добавить новый маршрут.
Отменить последнее внесённое в маршрут изменение.
Отобразить/Скрыть инструкцию.
Ими можно воспользоваться, нажав на выпадающее меню "Маршруты" в верхнем правом углу карты.

## Инструкция по работе с инструментом "Маршруты":
1. Нажмите кнопку "Отобразить Маршруты".
На карте появится тренировочный маршрут "Ул. Достоевского" - "Миусский парк".
Покрутите колесико мыши для приближения карты, чтобы лучше рассмотреть его.
Перемещение по карте осуществляется нажатием колесика или левой кнопки мыши на карте и перемещением курсора.

2. Чтобы скрыть маршруты, нажмите на любой свободный участок карты или еще раз на "Маршруты"->"Инструкция",

3. Нажмите кнопку "Добавить маршрут".
Теперь нажатием левой кнопки мыши на любом участке карты Вы зададите начальную точку нового маршрута.
Последующими нажатиями левой кнопки мыши можно продлевать маршрут на карте.
Для завершения создания маршрута совершите двойное нажатие левой кнопки мыши.

4. Продлевать маршрут более удобно в режиме редактирования.
Для входа в режим редактирования маршрута нажмите на него левой кнопкой мыши.
На концах прямых участков маршрута можно заметить значки в виде белых ромбов с черной окантовкой.
Их можно перемещать левой кнопкой мыши, тем самым изменяя длину и расположение этих участков.
В середине каждого прямого участка находятся такие же полупрозрачные значки.
Нажав на них, можно создать новый узел маршрута и перемещать его.
После создания одного или нескольких новых узлов, их создание можно отменить, нажав кнопку "Отменить изменение".
Для сохранения изменений нажмите на любой свободный участок карты.
