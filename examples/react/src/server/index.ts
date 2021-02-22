// @ts-ignore
import { devices } from 'epaperjs';
import { getBitcoinPrice } from './graphql';
import text2png from './text2png';
import cron from 'node-cron';

function setUpDisplay(screen: any) {
    screen.driver.dev_init();
    screen.init();
    screen.driver.clear();
}

async function render(display) {
    const result = await getBitcoinPrice();
    const {
        data: {
            asset: { displayName, priceDate, formattedPrice },
        },
    } = result;
    const img = text2png(
        [
            {
                text: `${displayName}`,
                font: `${120 / 2}px Futura`,
                color: 'red',
            },
            { text: `${formattedPrice}`, color: 'black' },
        ],
        {
            font: `${240 / 2}px Futura`,
            color: 'white',
            backgroundColor: 'white',
            lineSpacing: 10,
            paddingLeft: 160 / 2,
            paddingTop: 150 / 2,
            paddingRight: 160 / 2,
            paddingBottom: 150 / 2,
            textAlign: 'left',
            height: display.height,
            width: display.width,
        }
    );

    await display.displayPNG(img);
}

async function draw() {
    const display = devices.waveshare7in5bHD;
    setUpDisplay(display);

    await render(display);
    cron.schedule('*/5 * * * *', async () => {
        await render(display);
    });
}

draw();
