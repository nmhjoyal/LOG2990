export interface ITool {
    id: string;
}

export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IShape extends IPreviewBox, ITool {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
}
