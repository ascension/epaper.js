import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
// @ts-ignore
import { init, devices, getBitcoinPrice } from 'epaperjs';
import text2png from './text2png';

function setUpDisplay(screen) {
    screen.driver.dev_init();
    screen.init();
    screen.driver.clear();
}

async function draw() {
    const display = devices.waveshare7in5bHD;
    setUpDisplay(devices.waveshare7in5bHD);
    const result = await getBitcoinPrice();
    console.log({ result });
    const {
        data: { displayName, priceDate, formattedPrice },
    } = result;
    const img = text2png(
        [
            {
                text: `${displayName}`,
                font: `${120 / 2}px Futura`,
                color: 'red',
            },
            { text: `${formattedPrice}`, color: 'black' },
            {
                text: `Price as of ${priceDate}`,
                font: `${36 / 2}px Futura`,
                textAlign: 'right',
                padding: -120 / 2,
                color: 'black',
            },
            {
                text: `source blockforge.io`,
                font: `${36 / 2}px Futura`,
                textAlign: 'right',
                padding: -320 / 2,
                color: 'black',
            },
        ],
        {
            font: `${240 / 2}px Futura`,
            color: 'white',
            backgroundColor: 'white',
            lineSpacing: 10,
            paddingLeft: 160 / 2,
            paddingTop: 120 / 2,
            paddingRight: 160 / 2,
            paddingBottom: 120 / 2,
            textAlign: 'left',
        }
    );

    await display.displayPNG(img);
}

draw();

// init({
//     screen: devices.waveshare7in5bHD,
//     staticDirectory: 'dist',
//     url: 'http://localhost:3000',
// });

// const app: Express = express();

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

// const port: number = Number(process.env.PORT) || 8050;

// app.use(express.static('dist'));
// app.get('/', (req: Request, res: Response) => {
//     console.log('sending index.html');
//     res.sendFile('/dist/index.html');
// });

// app.listen(port);
// console.log(`App listening on ${port}`);
