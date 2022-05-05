const http = require('http');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


yargs(hideBin(process.argv))
    .usage('Прогноз погоды. Для запуска введите "$0 [command] <option>".')
    .command(
        'weather',
        ' Узнать погоду',
        (yargs) => {
            return yargs.options({
                'city': {
                    type: 'string',
                    description: 'Город, в котором требуется узнать погоду',
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
    const city = argv.city;
    const URL = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${city}`;
    console.log(URL)

    http.get(URL, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) console.error(`Status Code: ${statusCode}`);

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            const parsedData = JSON.parse(rawData);
            console.log(`${parsedData.location.region}. Температура: ${parsedData.current.temperature}, Ощущается как: ${parsedData.current.feelslike}, Скорость ветра: ${parsedData.current.wind_speed}`);
        });
    }).on('error', (err) => console.error(`Got error: ${err.message}`));
}

