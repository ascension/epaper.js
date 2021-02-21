import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const init = async () => {
    console.log('Attempting Login');
    try {
        await ssh.connect({
            host: 'raspberrypi.local',
            username: 'pi',
            password: 'raspberry',
        });

        // Command
        ssh.execCommand('yarn server', {
            cwd: '/home/pi/epaper.js/examples/react/',
            onStdout(chunk) {
                console.log(chunk.toString('utf8'));
            },
            onStderr(chunk) {
                console.log(chunk.toString('utf8'));
            },
        });
    } catch (error) {
        console.error(error);
    }
    console.log('Attempting Success');
};

init();

export default function () {}
