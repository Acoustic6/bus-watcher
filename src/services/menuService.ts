import { control, DrawTool, VectorLayer } from 'maptalks';
import { showRoutes, hideRoutes, addRoute, undoEdit } from './linesService';

function createMenu(layer: VectorLayer, map: any, drawTool: DrawTool) {
  const items = [
    [
      'Маршруты',
      () => showRoutes(layer),
      () => hideRoutes(),
      () => addRoute(drawTool),
      () => undoEdit(),
    ],
  ].map(function (value) {
    return {
      item: value[0],
      children: [
        {
          item: 'Отобразить',
          click: value[1],
        },
        {
          item: 'Скрыть',
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
      ],
    };
  });
  
  new control.Toolbar({
    items,
  }).addTo(map);
}

export default(createMenu);