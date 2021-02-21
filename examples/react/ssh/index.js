"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh_1 = require("node-ssh");
const ssh = new node_ssh_1.NodeSSH();
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
                console.log('stdoutChunk', chunk.toString('utf8'));
            },
            onStderr(chunk) {
                console.log('stderrChunk', chunk.toString('utf8'));
            },
        });
    }
    catch (error) {
        console.error(error);
    }
    console.log('Attempting Success');
};
init();
function default_1() { }
exports.default = default_1;
//# sourceMappingURL=index.js.map