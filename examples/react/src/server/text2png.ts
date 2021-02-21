import { registerFont, createCanvas } from 'canvas';
import { sumBy } from 'lodash';

interface Options {
    font: string;
    textAlign: string;
    color: string;
    bgColor: string;
    backgroundColor: string;
    lineSpacing: number;
    strokeWidth: number;
    textColor: string;
    strokeColor: string;
    padding: number;
    paddingLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    borderWidth: number;
    borderLeftWidth: number;
    borderTopWidth: number;
    borderRightWidth: number;
    borderBottomWidth: number;
    localFontPath: string;
    localFontName: string;
    borderColor: string;
    output: 'buffer' | 'stream' | 'dataURL' | 'canvas';
}

type Text = {
    text: string;
    font?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: number;
    color?: string;
};

const text2png = (texts: Text[], options: Partial<Options>) => {
    // Options
    const parsedOptions = parseOptions(options);

    // Register a custom font
    if (parsedOptions.localFontPath && parsedOptions.localFontName) {
        registerFont(parsedOptions.localFontPath, {
            family: parsedOptions.localFontName,
        });
    }

    const canvas = createCanvas(0, 0);
    const ctx = canvas.getContext('2d');

    const max = {
        left: 0,
        right: 0,
        ascent: 0,
        descent: 0,
    };

    let lastDescent;
    const lineProps = texts.map((text) => {
        // ctx.font = parsedOptions.font
        ctx.font = text.font ?? parsedOptions.font;
        const metrics = ctx.measureText(text.text);

        const left = -1 * metrics.actualBoundingBoxLeft;
        const right = metrics.actualBoundingBoxRight;
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;

        max.left = Math.max(max.left, left);
        max.right = Math.max(max.right, right);
        max.ascent = Math.max(max.ascent, ascent);
        max.descent = Math.max(max.descent, descent);
        // lastDescent = descent
        return {
            left,
            right,
            ascent,
            max,
            descent,
            height: ascent + descent,
            ...text,
        };
    });

    const lineHeight = max.ascent + max.descent + parsedOptions.lineSpacing;

    const contentWidth = max.left + max.right;
    const contentHeight = lineHeight + sumBy(lineProps, ({ height }) => height);
    // -
    // parsedOptions.lineSpacing -
    // (max.descent - lastDescent)

    canvas.width =
        contentWidth +
        parsedOptions.borderLeftWidth +
        parsedOptions.borderRightWidth +
        parsedOptions.paddingLeft +
        parsedOptions.paddingRight;

    canvas.height =
        contentHeight +
        parsedOptions.borderTopWidth +
        parsedOptions.borderBottomWidth +
        parsedOptions.paddingTop +
        parsedOptions.paddingBottom;

    const hasBorder =
        false ||
        parsedOptions.borderLeftWidth ||
        parsedOptions.borderTopWidth ||
        parsedOptions.borderRightWidth ||
        parsedOptions.borderBottomWidth;

    if (hasBorder) {
        ctx.fillStyle = parsedOptions.borderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (parsedOptions.backgroundColor) {
        ctx.fillStyle = parsedOptions.backgroundColor;
        ctx.fillRect(
            parsedOptions.borderLeftWidth,
            parsedOptions.borderTopWidth,
            canvas.width -
                (parsedOptions.borderLeftWidth +
                    parsedOptions.borderRightWidth),
            canvas.height -
                (parsedOptions.borderTopWidth + parsedOptions.borderBottomWidth)
        );
    } else if (hasBorder) {
        ctx.clearRect(
            parsedOptions.borderLeftWidth,
            parsedOptions.borderTopWidth,
            canvas.width -
                (parsedOptions.borderLeftWidth +
                    parsedOptions.borderRightWidth),
            canvas.height -
                (parsedOptions.borderTopWidth + parsedOptions.borderBottomWidth)
        );
    }

    // ctx.font = parsedOptions.font
    ctx.fillStyle = parsedOptions.textColor;
    ctx.antialias = 'gray';
    ctx.textAlign = parsedOptions.textAlign;
    ctx.lineWidth = parsedOptions.strokeWidth;
    ctx.strokeStyle = parsedOptions.strokeColor;

    let offsetY = parsedOptions.borderTopWidth + parsedOptions.paddingTop;
    lineProps.forEach((lineProp) => {
        // Calculate Y
        let x = 0;
        const y = max.ascent + offsetY + (lineProp.padding || 0);

        // Calculate X
        switch (lineProp.textAlign ?? parsedOptions.textAlign) {
            case 'start':
            case 'left':
                x =
                    lineProp.left +
                    parsedOptions.borderLeftWidth +
                    parsedOptions.paddingLeft;
                break;

            case 'end':
            case 'right':
                x =
                    canvas.width -
                    lineProp.right -
                    parsedOptions.borderRightWidth -
                    parsedOptions.paddingRight;
                break;

            case 'center':
                x =
                    contentWidth / 2 +
                    parsedOptions.borderLeftWidth +
                    parsedOptions.paddingLeft;
                break;
        }

        ctx.font = lineProp.font ?? parsedOptions.font;
        ctx.fillStyle = lineProp.color || 'white';
        ctx.fillText(lineProp.text, x, y);

        if (parsedOptions.strokeWidth > 0) {
            ctx.strokeText(lineProp.text, x, y);
        }

        offsetY += lineHeight;
    });

    switch (parsedOptions.output) {
        case 'buffer':
            return canvas.toBuffer('raw');
        case 'stream':
            return canvas.createPNGStream();
        case 'dataURL':
            return canvas.toDataURL('image/png');
        case 'canvas':
            return canvas;
        default:
            throw new Error(
                `output type:${parsedOptions.output} is not supported.`
            );
    }
};

function parseOptions(options: Partial<Options>) {
    return {
        font: or(options.font, '30px sans-serif'),
        textAlign: or(options.textAlign, 'left'),
        textColor: or(options.textColor, options.color, 'black'),
        backgroundColor: or(options.bgColor, options.backgroundColor, null),
        lineSpacing: or(options.lineSpacing, 0),

        strokeWidth: or(options.strokeWidth, 0),
        strokeColor: or(options.strokeColor, 'white'),

        paddingLeft: or(options.paddingLeft, options.padding, 0),
        paddingTop: or(options.paddingTop, options.padding, 0),
        paddingRight: or(options.paddingRight, options.padding, 0),
        paddingBottom: or(options.paddingBottom, options.padding, 0),

        borderLeftWidth: or(options.borderLeftWidth, options.borderWidth, 0),
        borderTopWidth: or(options.borderTopWidth, options.borderWidth, 0),
        borderBottomWidth: or(
            options.borderBottomWidth,
            options.borderWidth,
            0
        ),
        borderRightWidth: or(options.borderRightWidth, options.borderWidth, 0),
        borderColor: or(options.borderColor, 'black'),

        localFontName: or(options.localFontName, null),
        localFontPath: or(options.localFontPath, null),

        output: or(options.output, 'buffer'),
    };
}

function or(...args) {
    for (const arg of args) {
        if (typeof arg !== 'undefined') {
            return arg;
        }
    }
    return args[arguments.length - 1];
}

export default text2png;
