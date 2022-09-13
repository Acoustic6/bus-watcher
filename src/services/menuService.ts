import { control, DrawTool, VectorLayer } from 'maptalks';
import { showRoutes, hideRoutes, addRoute, undoEdit } from './linesService';

function createMenu(layer: VectorLayer, map: any, drawTool: DrawTool, setInstructionZIndex: any) {
  const items = [
    [
      'Маршруты',
      () => showRoutes(layer),
      () => hideRoutes(),
      () => addRoute(drawTool),
      () => undoEdit(),
      () => toggleInstruction(setInstructionZIndex),
    ],
  ].map(function (value) {
    return {
      item: value[0],
      children: [
        {
          item: 'Отобразить маршруты',
          click: value[1],
        },
        {
          item: 'Скрыть маршруты',
          click: value[2],
        },
        {
          item: 'Добавить маршрут',
          click: value[3],
        },
        {
          item: 'Отменить изменение',
          click: value[4],
        },
        {
          item: 'Инструкция',
          click: value[5],
        },
      ],
    };
  });
  
  new control.Toolbar({
    items,
  }).addTo(map);
}

export function toggleInstruction(setInstructionZIndex: any) {
  const instructionDiv = document.getElementById('status');

  if (instructionDiv) {
    const instruction = [
      '',
      '',
      'Инструкция по работе с инструментом \'Маршруты\':',
      '',
      '1. Нажмите кнопку \'Отобразить Маршруты.\'. На карте появится тренировочный маршрут \'Ул. Достоевского\' - \'Миусский парк\'.',
      // eslint-disable-next-line max-len
      'Покрутите колесико мыши для приближения карты, чтобы лучше рассмотреть его.',
      'Перемещение по карте осуществляется нажатием колесика или левой кнопки мыши на карте и перемещением курсора мыши.',
      '',
      '2. Чтобы скрыть маршруты, нажмите на любой участок карты или еще раз на \'Маршруты\'->\'Инструкция\'',
      '',
      // eslint-disable-next-line max-len
      '3. Нажмите кнопку \'Добавить маршрут\'.',
      'Теперь нажатием левой кнопки мыши на любом участке карты Вы зададите начальную точку нового маршрута.',
      'Последующими нажатиями левой кнопки мыши можно продлевать маршрут на карте.',
      'Для завершения создания маршрута совершите двойное нажатие левой кнопки мыши.',
      '',
      // eslint-disable-next-line max-len
      '4. Продлевать маршрут более удобно в режиме редактирования.',
      'Для входа в режим редактирования маршрута нажмите на него левой кнопкой мыши.',
      // eslint-disable-next-line max-len
      'На концах прямых участков маршрута можно заметить значки в виде белых ромбов с черной окантовкой.',
      'Их можно перемещать левой кнопкой мыши, тем самым изменяя длину и расположение этих участков.',
      // eslint-disable-next-line max-len
      'В середине каждого прямого участка находятся такие же полупрозрачные значки.',
      'Нажав на них, можно создать новый узел маршрута и перемещать его.',
      'После создания одного или нескольких новых узлов, их создание можно отменить, нажав кнопку \'Отменить изменение\'.',
      'Для сохранения изменений нажмите на любой свободный участок карты.',
    ];
    // \'\'
    if (!instructionDiv.innerHTML) {
      instructionDiv.innerHTML = '<div>' + instruction.join('<br>') + '</div>';
      setInstructionZIndex(10);
    } else {
      instructionDiv.innerHTML = '';
      setInstructionZIndex(-1);
    }
  }
}

export default(createMenu);

