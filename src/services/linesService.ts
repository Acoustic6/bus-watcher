import { Coordinate, DrawTool, LineString, VectorLayer } from 'maptalks';

const _lines: LineString[] = [
    new LineString([
        [37.61021584018113, 55.78323668567296],
        [37.606371648912614, 55.784546639250124],
        [37.60464283996055, 55.78530082243097],
        [37.604478246869576, 55.78533387461593],
        [37.60421868602498, 55.78533326907862],
        [37.6028078940667, 55.78524652934934],
        [37.60173135096147, 55.78516889603938],
        [37.601593308958854, 55.785035075887464],
        [37.60144673482671, 55.78494013195072],
        [37.60121972637626, 55.784863068590795],
        [37.600865807734294, 55.78479921527159],
        [37.60081672875958, 55.784893006453586],
        [37.600761343325075, 55.78508198506975],
        [37.60090206700261, 55.78510231535759],
        [37.60089359667006, 55.785142807013614],
        [37.60088056952327, 55.785238279178856],
        [37.60074656887093, 55.78547142956066],
        [37.599963081970714, 55.78531122638785],
        [37.59982435382631, 55.78520170332044],
        [37.59947425224027, 55.78508817835777],
        [37.59884493702839, 55.78491315537232],
        [37.59895107447335, 55.78457979486879],
        [37.59899381104583, 55.7844913943521],
        [37.59707213182037, 55.78417868599516],
        [37.59684840900877, 55.78411485554486],
        [37.59296566157104, 55.78145935201732],
        [37.592072934854286, 55.780910563150286],
    ],
    {
        arrowStyle: null,
        arrowPlacement: 'vertex-last',
        visible: true,
        editable: true,
        cursor: null,
        shadowBlur: 0,
        shadowColor: 'black',
        draggable: false,
        dragShadow: false,
        drawOnAxis: null,
        symbol: {
            'lineColor': '#87c4f0',
            'lineWidth': 4,
        },
    }),
];

function getEdittingLine() {
    return getAddedLines().find(line => line.isEditing());
}

function getAddedLines() {
    return _lines.filter(line => line.getLayer());
}

function getNotAddedLines() {
    return _lines.filter(line => !line.getLayer());
}

export function getClickedRoute(point: Coordinate) {
    return getAddedLines().find(line => line.containsPoint(point));
}

export function getLines(): LineString[] {
    return _lines;
}

export function endEditForAllLines(): void {
    getAddedLines().forEach(line => line.endEdit());
}

export function addLinesToLayer(layer: VectorLayer) {
    getNotAddedLines().forEach(line => line.addTo(layer));
}

export function showRoutes(layer: VectorLayer) {
    addLinesToLayer(layer);
}

export function hideRoutes() {
    getEdittingLine()?.endEdit();
    getAddedLines().forEach(line => line.remove());
}

export function addRoute(drawTool: DrawTool) {
    drawTool.enable();
}

export function undoEdit() {
    getEdittingLine()?.undoEdit();
}

export function startEdit(line: LineString) {
    getAddedLines().forEach(line => line.endEdit());
    line.startEdit();
}

export default (getLines);
