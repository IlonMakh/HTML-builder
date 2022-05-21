const fs = require('fs');
const path = require('path');
const {stdout, stdin} = process;

const newFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

async function copyDir(from, to) {
    await fs.promises.rm(to, {recursive:true, force:true});
    await fs.promises.mkdir(to, {recursive:true}, stdout.write('Копия папки с файлами создана!'));
    let files = await fs.promises.readdir(from);
    await files.forEach(file => {
        fs.promises.copyFile(path.join(from, file), path.join(to,file));
    })
}

copyDir(folderPath, newFolderPath);
