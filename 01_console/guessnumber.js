#!/usr/bin/env node
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin
})


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
  }

const min = 0
const max = 100
const guessedNum = getRandomIntInclusive(min, max)


const ask = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input))
    })
}


const processAnswer = (answer) => {
    if (isNaN(answer) || !Number.isInteger(answer)) return `Введите чило между ${min} и ${max}: `

    if (answer > guessedNum)
        return 'Загаданное число меньше\n'
    else if (answer < guessedNum )
        return 'Загаданное число больше\n'
    else 
        return answer
}

async function start(answer) {
    if (typeof answer === 'number') {
        console.log(`Отгаданное число ${answer}`)
        rl.close()
        return
    }
    let num = await ask(answer ? answer : 'Введите число: ')
    start(processAnswer(+num))
}

console.log(`Загадано число в диапазоне ${min} до ${max}! `)
start()