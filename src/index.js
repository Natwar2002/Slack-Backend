import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullboardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import MessageChannelHandler from './controllers/channelSocketController.js';
import MessageSocketHandler from './controllers/messageSocketController.js';
import { verifyTokenController } from './controllers/userController.js';
import apiRouter from './routes/apiRouter.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/verify/:token', verifyTokenController);

app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({ message: 'pong' });
});

io.on('connection', (socket) => {
    // console.log('A user connected ', socket.id);
    MessageSocketHandler(socket, io);
    MessageChannelHandler(socket, io);
});

server.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
    // const mailResponse = await mailer.sendMail({
    //     from: 'natvarp6062@gmail.com',
    //     to: 'natvarp6062@gmail.com',
    //     subject: 'Welcome Email',
    //     text: "Welcome to Slack App"
    // });   
});
