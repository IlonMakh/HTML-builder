const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, '\secret-folder');

async function readDir(folder) {
    let files = await fs.promises.readdir(folder);
    await files.forEach(file => {
        fs.stat(path.join(folder, file), (err, stats) => {
            if (err) {
                throw err;
            }
            
            if (stats.isFile()) {
                console.log (`${path.basename(file, path.extname(file))} - ${path.extname(file).slice(1)} - ${stats.size}b`);
            }
        })
    })
};

readDir(folderPath);

