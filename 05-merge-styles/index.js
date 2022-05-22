const fs = require('fs');
const path = require('path');
const {stdout, stdin} = process;

const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const stylePath = path.resolve(__dirname, 'styles');

async function createBundle() {
    await fs.writeFile(bundlePath, '', (err) => { 
        if (err) throw err;
        stdout.write('bundle.css создан!')
    });
        
        let files = await fs.promises.readdir(stylePath);
        await files.forEach(file => {
            let rs = fs.createReadStream(path.resolve(stylePath, file), 'utf-8');
            let fileData = '';
            rs.on('data', chunk => fileData += chunk);
            rs.on('end', () =>
                fs.stat(path.join(stylePath, file), (err, stats) => {
                    if (err) {
                        throw err;
                    }
                    if (stats.isFile() && path.extname(file) === '.css') {
                        fs.appendFile(
                            bundlePath,
                            fileData,
                            (err) => {
                                if (err) throw err;
                            }
                        )
                    }
                })
            )
        })
    
}

createBundle();