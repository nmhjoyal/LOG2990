export class ColourConstants {
    static INITIAL_TRANSPARENCY = 1;
    static RGBTOHEX_FACTOR = 255;
    static COLOUR_PALETTE_SEPARATOR = 0.15;
    static HEX_LENGTH = 16;
    static HEX_NO_ALPHA = 7;
}

export enum GrayScale {
    BLACK = '#000000ff',
    GREY1 = '#222222ff',
    GREY2 = '#444444ff',
    GREY3 = '#666666ff',
    GREY4 = '#888888ff',
    GREY5 = '#aaaaaaff',
    GREY6 = '#bbbbbbff',
    GREY7 = '#ccccccff',
    GREY8 = '#eeeeeeff',
    WHITE = '#ffffffff',
}

export enum Rainbow {
    RED = 'rgba(255, 0, 0, 1)',
    ORANGE = 'rgba(255, 102, 0, 1)',
    YELLOW = 'rgba(255, 225, 55, 1)',
    GREEN = 'rgba(0, 200, 25, 1)',
    TEAL = 'rgba(0, 255, 255, 1)',
    BLUE = 'rgba(0, 0, 255, 1)',
    VIOLET = 'rgba(255, 0, 255, 1)',
}

export enum Transparancy {
    FULL = 'rgba(0, 0, 0, 1)',
    HALF = 'rgba(0, 0, 0, 0.5)',
    QUARTER = 'rgba(0, 0, 0, 0.25)',
    NONE = 'rgba(0, 0, 0, 0)',
    QUARTER_BLACK = 'rgba(255, 255, 255, 0.25)',
    HALF_BLACK = 'rgba(255, 255, 255, 0.5)',
    FULL_BLACK = 'rgba(255, 255, 255, 1)',
}
