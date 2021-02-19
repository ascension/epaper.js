import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
// @ts-ignore
import { init } from 'epaperjs';

init({ staticDirectory: 'dist', url: 'http://localhost:3000' });

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
