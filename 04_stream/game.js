#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const readline = require('readline');

const input = readline.createInterface(process.stdin);
const exit = process.exit;
const logsDirName = 'logs';

yargs(hideBin(process.argv))
    .usage('Игра "Орел или решка". Для запуска введите "$0 [command] <option>".')
    .command(
        'start',
        'Начать игру',
        (yargs) => {
            return yargs.options({
                'file': {
                    alias: 'f',
                    type: 'string',
                    description: 'Название файла для хранения результатов [fileName].json',
                    demandOption: true
                }
            });
        },
        (argv) => onStart(argv)
    )
    .demandCommand(1)
    .version(false)
    .help()
    .alias('h', 'help')
    .argv;

async function onStart(argv) {
    const fileName = argv.file;
    const filePath = await initLogFile(fileName);

    console.log('Испытайте удачу, введите 1 или 2:');
    const targetNumber = getRandomNumber(1, 3);
    input.on('line', async (data) => {
        const number = +data;
        if (number !== 1 && number !== 2) {
            console.log('Ошибка! Введите 1 или 2.');
            return;
        }

        const gameId = Date.now();
        const gameResult = number === targetNumber;
        console.log(gameResult ? 'Вы выиграли, поздравляем!' : 'Вы проиграли, повезет в следующий раз!');
        await updateLogFile(filePath, gameId, gameResult);
        console.log(`Результаты сохранены в файл "${fileName}".`);
        exit(0);
    });
}


async function initLogFile(fileName) {
    const dirPath = path.join(__dirname, logsDirName);
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
        await fsPromises.mkdir(dirPath);
    }

    const filePath = path.join(dirPath, fileName);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
        await fsPromises.appendFile(filePath, '[]');
    }

    return new Promise((resolve, reject) => resolve(filePath));
}

async function updateLogFile(filePath, gameId, gameResult) {
    const fileData = await fsPromises.readFile(filePath);
    const logs = JSON.parse(fileData);
    const newLog = { gameId, gameResult };
    logs.push(newLog);
    const newFileData = JSON.stringify(logs, null, 2);
    await fsPromises.writeFile(filePath, newFileData);
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}