import { createCanvas } from 'canvas';

export const RES_WIDTH = 880;
export const RES_HEIGHT = 528;
const RES_PIXEL_COUNT = RES_WIDTH * RES_HEIGHT;
const TARGET_COLOR_BUFFER_SIZE = RES_PIXEL_COUNT >> 3;
const SOURCE_COLOR_BUFFER_SIZE = RES_PIXEL_COUNT << 2;

function displayImageBuffer(buffer: Buffer) {
    if (buffer.length !== SOURCE_COLOR_BUFFER_SIZE) {
        throw new Error(
            'Invalid image buffer size. This module expects BGRA color buffer.'
        );
    }
    // Black/white buffer
    const bwBuffer = Buffer.alloc(TARGET_COLOR_BUFFER_SIZE, 0xff); // White pixels by default
    // Red buffer
    const redBuffer = Buffer.alloc(TARGET_COLOR_BUFFER_SIZE, 0xff);
    for (let i = 0; i < RES_PIXEL_COUNT; ++i) {
        const red = buffer[(i << 2) + 2];
        const blue = buffer[i << 2];
        if (red === 0) {
            bwBuffer[i >> 3] &= ~(0x80 >> (i % RES_WIDTH) % 8);
        } else if (blue === 0 && red > 0) {
            redBuffer[i >> 3] &= ~(0x80 >> (i % RES_WIDTH) % 8);
            // redBuffer[i >> 3] |= 0x80 >> (i % RES_WIDTH) % 8;
        }
    }

    return { bwBuffer, redBuffer };
}

const renderCanvas = ({
    price,
    displayName,
}: {
    price: string;
    displayName: string;
}) => {
    const canvas = createCanvas(RES_WIDTH, RES_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Draw something
    ctx.antialias = 'none';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, RES_WIDTH, RES_HEIGHT);
    ctx.font = '65px DejaVu';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'black';
    ctx.fillText('Hello World!', 5, 5);
    ctx.fillStyle = 'red';
    ctx.fillText('Hello World!', 5, 105);
    ctx.fillRect(5, 205, 500, 69);
    ctx.fillStyle = 'white';
    ctx.fillText('Hello World!', 5, 205);

    return displayImageBuffer(canvas.toBuffer('raw'));
};

module.exports = { renderCanvas, displayImageBuffer };
