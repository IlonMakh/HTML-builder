const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output, stdout } = require('process');

const filePath = path.resolve(__dirname, 'new_file.txt');

fs.writeFile(
    filePath,
    '',
    (err) => {
        if (err) throw err;
    }
);

const rl = readline.createInterface({ input, output });
stdout.write('Приветствую! Введите текст и он появится в файле.\n ');

rl.on('line', (input) => {
    if (input.toString().trim() === 'exit') process.exit();
    fs.appendFile(
        filePath,
        `${input} \n`,
        (err) => {
          if (err) throw err;
      }
    );
  });

  process.on('exit', () => stdout.write('\nCпасибо за проверку, хорошего дня!'));
  process.on('SIGINT', () => stdout.write('\nCпасибо за проверку, хорошего дня!'));






