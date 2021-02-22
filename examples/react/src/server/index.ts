// @ts-ignore
import { devices } from 'epaperjs';
import { getBitcoinPrice } from './graphql';
import text2png from './text2png';
// @ts-ignore
import cron from 'node-cron';

function setUpDisplay(screen: any) {
    screen.driver.dev_init();
    screen.init();
    screen.driver.clear();
}

async function render(display: any) {
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
    console.debug('Setting Up Display');
    setUpDisplay(display);

    console.debug('Initial Render Started');
    await render(display);

    cron.schedule('*/1 * * * *', () => {
        console.debug(`running a task every one minutes - ${new Date()}`);
    });

    cron.schedule('*/5 * * * *', async () => {
        console.debug(`Update Render Started - ${new Date()}`);
        await render(display);
    });
}

draw();
