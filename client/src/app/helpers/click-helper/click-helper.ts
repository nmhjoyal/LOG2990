import { ControlPoints } from 'src/app/drawing-view/components/tools/assets/constants/selector-constants';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
// tslint:disable-next-line: no-implicit-dependencies
import * as svgIntersections from 'svg-intersections';

export default class ClickHelper {
    // Adapt to Firefox
    static getXPosition(event: MouseEvent): number {
        return event.layerX > event.offsetX ? event.layerX : event.offsetX;
    }

    static getYPosition(event: MouseEvent): number {
        return event.layerY > event.offsetY ? event.layerY : event.offsetY;
    }

    static getClickAreaPoints(positionX: number, positionY: number): string {
        let coordinates = String(positionX) + ',' + String(positionY);
        coordinates += ' ' + String(positionX + 1) + ',' + String(positionY);
        coordinates += ' ' + String(positionX) + ',' + String(positionY + 1);
        coordinates += ' ' + String(positionX + 1) + ',' + String(positionY + 1);
        coordinates += ' ' + String(positionX - 1) + ',' + String(positionY);
        coordinates += ' ' + String(positionX) + ',' + String(positionY - 1);
        coordinates += ' ' + String(positionX - 1) + ',' + String(positionY - 1);
        coordinates += ' ' + String(positionX - 1) + ',' + String(positionY + 1);
        coordinates += ' ' + String(positionX + 1) + ',' + String(positionY - 1);
        return coordinates;
    }

    static cursorTouchesControlPoint(selectorBox: IPreviewBox, positionX: number, positionY: number): ControlPoints {
        const selectorSquare = { x: positionX - 2, y: positionY - 2, width: 4, height: 4 };
        let intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x,
            cy: selectorBox.y, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.TOP_LEFT;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x + (selectorBox.width / 2),
            cy: selectorBox.y, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.TOP_MIDDLE;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x + selectorBox.width,
            cy: selectorBox.y, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.TOP_RIGHT;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x,
            cy: selectorBox.y + (selectorBox.height / 2), r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.MIDDLE_LEFT;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x + selectorBox.width,
            cy: selectorBox.y + (selectorBox.height / 2), r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.MIDDLE_RIGHT;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x,
            cy: selectorBox.y + selectorBox.height, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.BOTTOM_LEFT;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x + (selectorBox.width / 2),
            cy: selectorBox.y + selectorBox.height, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.BOTTOM_MIDDLE;
        }
        intersections = svgIntersections.intersect(svgIntersections.shape('circle', {
            cx: selectorBox.x + selectorBox.width,
            cy: selectorBox.y + selectorBox.height, r: 2,
        }), svgIntersections.shape('rect', selectorSquare));
        if (intersections.points.length > 0) {
            return ControlPoints.BOTTOM_RIGHT;
        }
        return ControlPoints.NONE;
    }

    static cursorTouchesObjectBorder(object: ITools, positionX: number, positionY: number): boolean {
        const selectorLine = { points: this.getClickAreaPoints(positionX, positionY) };
        switch (object.id) {
            case Id.RECTANGLE: case Id.TEXT:
                const rectIntersections = svgIntersections.intersect(svgIntersections.shape('rect',
                    { x: object.x, y: object.y, width: object.width, height: object.height }),
                    svgIntersections.shape('polyline', selectorLine));
                return rectIntersections.points.length > 0;
            case Id.CRAYON: case Id.PAINTBRUSH: case Id.LINE: case Id.PEN: case Id.QUILL:
                let lineIntersections;
                if (object.points) {
                    lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
                        svgIntersections.shape('polyline', selectorLine));
                    return lineIntersections.points.length > 0;
                }
                return false;
            case Id.ELLIPSE:
                const ellipseIntersections = svgIntersections.intersect(svgIntersections.shape('ellipse', {
                    cx: object.x, cy: object.y,
                    rx: object.width, ry: object.height,
                }),
                    svgIntersections.shape('polyline', selectorLine));
                return ellipseIntersections.points.length > 0;
            case Id.POLYGON:
                let polygonIntersections;
                if (object.vertices) {
                    polygonIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.vertices }),
                        svgIntersections.shape('polyline', selectorLine));
                    return polygonIntersections.points.length > 0;
                }
                return false;
            case Id.STAMP:
                const stampIntersections = svgIntersections.intersect(svgIntersections.shape('circle',
                    { cx: (object.x + (object.width / 2)), cy: (object.y + (object.height / 2)), r: object.width / 2 }),
                    svgIntersections.shape('polyline', selectorLine));
                return stampIntersections.points.length > 0;
            default:
                return false;
        }
    }

    static cursorInsideObject(object: ITools, positionX: number, positionY: number): boolean {
        switch (object.id) {
            case Id.RECTANGLE: case Id.TEXT:
                return (object.x <= positionX && object.y <= positionY && (object.x + object.width) >= positionX &&
                    (object.y + object.height) >= positionY);
            case Id.CRAYON: case Id.PAINTBRUSH: case Id.LINE: case Id.PEN: case Id.QUILL:
                return this.cursorTouchesObjectBorder(object, positionX, positionY);
            case Id.ELLIPSE:
                return (((positionX - object.x) * (positionX - object.x)) / (object.width * object.width)) +
                    (((positionY - object.y) * (positionY - object.y)) / (object.height * object.height)) <= 1;
            case Id.POLYGON:
                return (((positionX - object.x) * (positionX - object.x)) / (object.width * object.width)) +
                    (((positionY - object.y) * (positionY - object.y)) / (object.height * object.height)) <= 1;
            case Id.STAMP:
                return (Math.pow((positionX - (object.x + (object.width / 2))), 2) +
                    Math.pow((positionY - (object.y + (object.height / 2))), 2)) <= Math.pow(object.width / 2, 2);
            case Id.SPRAY_CAN:
                let isInside = false;
                // sprays cannot be undefined; all SPRAY_CAN drawings have sprays.
                // tslint:disable-next-line:no-non-null-assertion
                object.sprays!.forEach((circle) => {
                    if ( object.radius &&
                        Math.pow(positionX - circle.cx, 2) + Math.pow(positionY - circle.cy, 2) <= Math.pow(object.radius, 2) ) {
                        isInside = true;
                        return;
                    }
                });
                return isInside;
            default:
                return false;
        }
    }

    static objectSharesBoxArea(object: ITools, previewBox: IPreviewBox): boolean {
        let intersectionPoints = [];
        const selectorBox = { x: previewBox.x, y: previewBox.y, width: previewBox.width, height: previewBox.height };
        const objectIsInsideBox = (previewBox.x < object.x && previewBox.y < object.y
            && previewBox.width > (object.width - previewBox.x + object.x)
            && previewBox.height > (object.height - previewBox.y + object.y));
        let boxIsInsideObject = false;
        switch (object.id) {
            case Id.RECTANGLE: case Id.TEXT:
                const rectIntersections = svgIntersections.intersect(svgIntersections.shape('rect', {
                    x: object.x, y: object.y,
                    width: object.width, height: object.height,
                }),
                    svgIntersections.shape('rect', selectorBox));
                boxIsInsideObject = (previewBox.x > object.x && previewBox.y > object.y
                    && previewBox.width < (object.width - previewBox.x + object.x)
                    && previewBox.height < (object.height - previewBox.y + object.y));
                intersectionPoints = rectIntersections.points;
                break;
            case Id.CRAYON: case Id.PAINTBRUSH: case Id.LINE: case Id.PEN: case Id.QUILL:
                let lineIntersections;
                if (object.points) {
                    lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
                        svgIntersections.shape('rect', selectorBox));
                    intersectionPoints = lineIntersections.points;
                }
                break;
            case Id.ELLIPSE:
                const ellipseIntersections = svgIntersections.intersect(svgIntersections.shape('ellipse', {
                    cx: object.x, cy: object.y,
                    rx: object.width, ry: object.height,
                }),
                    svgIntersections.shape('rect', selectorBox));
                boxIsInsideObject = (previewBox.x > (object.x - object.width) && previewBox.y > (object.y - object.height)
                    && previewBox.width < ((object.width * 2) - previewBox.x + (object.x - object.width))
                    && previewBox.height < ((object.height * 2) - previewBox.y + (object.y - object.height)));
                intersectionPoints = ellipseIntersections.points;
                break;
            case Id.POLYGON:
                let polygonIntersections;
                if (object.vertices) {
                    polygonIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.vertices }),
                        svgIntersections.shape('rect', selectorBox));
                    intersectionPoints = polygonIntersections.points;
                }
                boxIsInsideObject = (previewBox.x > (object.x - object.width) && previewBox.y > (object.y - object.height)
                    && previewBox.width < ((object.width * 2) - previewBox.x + (object.x - object.width))
                    && previewBox.height < ((object.height * 2) - previewBox.y + (object.y - object.height)));
                break;
            case Id.STAMP:
                const stampIntersections = svgIntersections.intersect(svgIntersections.shape('circle',
                    { cx: (object.x + (object.width / 2)), cy: (object.y + (object.height / 2)), r: object.width / 2 }),
                    svgIntersections.shape('rect', selectorBox));
                boxIsInsideObject = (previewBox.x > object.x && previewBox.y > object.y
                    && previewBox.width < (object.width - previewBox.x + object.x)
                    && previewBox.height < (object.height - previewBox.y + object.y));
                intersectionPoints = stampIntersections.points;
                break;
            case Id.SPRAY_CAN:
                let sprayCanIntersections;
                // sprays cannot be undefined; all SPRAY_CAN drawings have sprays.
                // tslint:disable-next-line:no-non-null-assertion
                for ( const sprayPatch of object.sprays!) {
                    sprayCanIntersections = svgIntersections.intersect(
                        svgIntersections.shape('circle', { cx: sprayPatch.cx, cy: sprayPatch.cy, r: object.radius }),
                        svgIntersections.shape('rect', selectorBox));
                    if ( sprayCanIntersections.points.length ) {
                        break;
                    }
                }
                if ( !sprayCanIntersections.length &&
                    this.cursorInsideObject(object, selectorBox.x + selectorBox.width, selectorBox.y + selectorBox.height) ) {
                    boxIsInsideObject = true;
                }
                intersectionPoints = sprayCanIntersections.points;
                break;
        }
        return (intersectionPoints.length > 0) || objectIsInsideBox || boxIsInsideObject;
    }
}
