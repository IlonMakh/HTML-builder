const fs = require('fs');
const path = require('path');
const {stdout, stdin} = process;

const projectPath = path.resolve(__dirname, 'project-dist');
const projectStylePath = path.resolve(__dirname, 'project-dist', 'style.css');
const projectHTMLPath = path.resolve(__dirname, 'project-dist', 'index.html');
const projectAssetsPath = path.resolve(__dirname, 'project-dist', 'assets');
const templateFilePath = path.resolve(__dirname, 'template.html');
const assetsPath = path.resolve(__dirname, 'assets');
const stylePath = path.resolve(__dirname, 'styles');
const componentsPath = path.resolve (__dirname, 'components');


async function buildPage() {
    await fs.promises.rm(projectPath, {recursive:true, force:true});
    await fs.promises.mkdir(projectPath, {recursive:true}, stdout.write('Проект создан!\n'));

    let templateContent = await fs.promises.readFile(templateFilePath, 'utf-8');
    let components = await fs.promises.readdir(componentsPath);
        for(let i = 0; i < components.length; i++) {
            if(path.extname(components[i]) === '.html') {
                let componentContent = await fs.promises.readFile(path.resolve(componentsPath, components[i]), 'utf-8');
                let componentName = path.basename(components[i], path.extname(components[i]));
                var htmlContent = templateContent.replace(`{{${componentName}}}`, componentContent);
                templateContent = htmlContent;
            }
        }
    await fs.writeFile(
        projectHTMLPath,
        htmlContent,
        (err) => {
            if (err) throw err;
            stdout.write('index.html готов!\n');
        }
    );

    await fs.writeFile(projectStylePath, '', (err) => { 
        if (err) throw err;
        stdout.write('style.css готов! \n');
    });
    
        let styles = await fs.promises.readdir(stylePath);
            styles.forEach(style => {
                let rs = fs.createReadStream(path.resolve(stylePath, style), 'utf-8');
                let styleData = '';
                rs.on('data', chunk => styleData += chunk);
                rs.on('end', () =>
                    fs.stat(path.join(stylePath, style), (err, stats) => {
                        if (err) {
                            throw err;
                        }
                        if (stats.isFile() && path.extname(style) === '.css') {
                            fs.appendFile(
                                projectStylePath,
                                styleData,
                                (err) => {
                                    if (err) throw err;
                                }
                            )
                        }
                    })
                )
            })

   

    await (function copyDir(from, to) { 
        fs.promises.mkdir(to, {recursive:true});
        fs.readdir(from, (err, files) => {
            if (err) throw err;

            else {
                files.forEach(file => {
                    fs.stat(path.join(from, file), (err, stats) => {
                        if (err) {
                            throw err;
                        }
                        if (stats.isFile()) {
                            fs.promises.copyFile(path.join(from, file), path.join(to,file));
                        }
        
                        else copyDir(path.join(assetsPath,file), path.join(projectAssetsPath,file));
                    })
                }) 
            }
        })    
    })(assetsPath, projectAssetsPath);

}

buildPage();