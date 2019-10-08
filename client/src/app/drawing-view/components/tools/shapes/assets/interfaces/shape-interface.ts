export interface IPreviewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IShape extends IPreviewBox {
    primaryColor: string;
    secondaryColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number;
}
