import { DrawTool, LineString, VectorLayer } from 'maptalks';
import { getLines } from './linesService';

let _drawTool: any = null;

export function createDrawTool(map: any, layer: VectorLayer) {
    _drawTool = new DrawTool({
        mode: 'LineString',
        symbol: {
            'lineColor': '#87c4f0',
            'lineWidth': 4,
        },
    }).addTo(map).disable();

    const drawFunc = (param: any) => {
        const route = param.geometry as LineString;
        layer.addGeometry(route);
        getLines().push(route);
        _drawTool.disable();
    };

    _drawTool.on('drawend', drawFunc);

    return _drawTool;
}

export function getDrawTool() {
    return _drawTool;
}

export default (createDrawTool);

