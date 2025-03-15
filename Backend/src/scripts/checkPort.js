const net = require('net');
const { exec } = require('child_process');

const checkPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer()
            .once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy`);
                    resolve(false);
                } else {
                    reject(err);
                }
            })
            .once('listening', () => {
                server.close();
                console.log(`Port ${port} is free`);
                resolve(true);
            })
            .listen(port);
    });
};

module.exports = checkPort;

// Run directly if called from command line
if (require.main === module) {
    const port = process.env.PORT || 5000;
    checkPort(port).then(isFree => {
        if (!isFree) {
            if (process.platform === 'win32') {
                exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                    if (stdout) {
                        console.log('Process using port:', stdout);
                    }
                });
            }
        }
    });
} 