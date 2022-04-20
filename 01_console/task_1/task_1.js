#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
    .usage('$0 <cmd> [args]')
    .command(
        'current',
        'Get the current date in ISO format',
        function (yargs) {
            return yargs.options({
                'year': {
                    alias: 'y',
                    type: 'boolean',
                    description: 'Current year',
                    conflicts: ['month', 'date']
                },
                'month': {
                    alias: 'm',
                    type: 'boolean',
                    description: 'Current month',
                    conflicts: ['year', 'date']
                },
                'date': {
                    alias: 'd',
                    type: 'boolean',
                    description: 'Current date',
                    conflicts: ['year', 'month']
                },
            })
        },
        function (argv) {
            const date = new Date();
            if (argv.year) {
                console.log(date.getFullYear());
            } else if (argv.month) {
                console.log(date.getMonth() + 1);
            } else if (argv.date) {
                console.log(date.getDate());
            } else {
                console.log(date);
            }
        })
    .command(
        'add',
        'Add date to the current date in ISO format',
        yargs => {
            yargs
                .option('year', {
                    alias: 'y',
                    type: 'number',
                    description: 'Add years to current date'
                })
                .option(
                    'month', {
                    alias: 'm',
                    type: 'number',
                    description: 'Add month to current date'
                })
                .option('date', {
                    alias: 'd',
                    type: 'number',
                    description: 'add days to current date'
                })
                .check(({ date, month, year }) => {
                    if (!month && !year && !date) {
                        throw new Error('One of month, year or date is required');
                    }
                    return true
                })
        },
        argv => {
            let date = new Date();
            if (argv.year) {
                date.setFullYear(date.getFullYear() + argv.year);
            } else if (argv.month) {
                date.setMonth(date.getMonth() + argv.month);
            } else if (argv.date) {
                date.setDate(date.getDate() + argv.date);
            }
            console.log(date);
        })
    .command(
        'sub',
        'substract days from current date',
        yargs =>
            yargs
                .option('year', {
                    alias: 'y',
                    type: 'number',
                    description: 'Substract years from current date',
                })
                .option('month', {
                    alias: 'm',
                    type: 'number',
                    description: 'Substract month from current date',
                })
                .option('date', {
                    alias: 'm',
                    type: 'number',
                    description: 'Substract month from current date',
                })
                .check(({ date, month, year }) => {
                    if (!month && !year && !date) {
                        throw new Error('One of month, year or date is required');
                    }
                    return true
                }),
        argv => {
            let date = new Date();
            if (argv.year) {
                date.setFullYear(date.getFullYear() - argv.year);
            } else if (argv.month) {
                date.setMonth(date.getMonth() - argv.month);
            } else if (argv.date) {
                date.setDate(date.getDate() - argv.date);
            }
            console.log(date);
        }
    )
    .version(false)
    .help('help')
    .showHelpOnFail(true, 'Specify --help for available options')
    .argv;

