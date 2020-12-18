#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import { Helper, ParseArgs } from './ParseArguments';
import { npmInit } from './npmInit';
import { tree } from './tree';
import * as HelpSpecs from './help';
import { config } from './config';
import { promptForConfig, createConfiguration } from './promptForConfig';
import { Answers } from 'inquirer';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { version } from '../package.json';
// @ts-ignore
import { defaultSettings } from '../default.json';
import arg from 'arg';

const title: string = chalk.blueBright.bold(figlet.textSync('DEFAULTS'));
const args: any = ParseArgs(process.argv);

const configOpts = args.path ? config(args.path) : defaultSettings;

const HELP = args.help
    ? args.help
    : process.argv.slice(2).length == 0
    ? true
    : false;

if (HELP) {
    // HELP
    console.log(title);
    Helper(HelpSpecs.all);
} else if (args.version) {
    //const version = fs.readFileSync(path.join(__dirname, '../VERSION'));
    console.log(chalk.bold(version));
} else if (args.config) {
    console.log(title);
    if (args.skipPrompt) {
        // Skip Config.
        const spinner = ora().start(chalk.bold('Creating configuration file!'));
        const answers: Answers = {
            configName: '',
            default: false,
            _devDependencies: [],
            _dependencies: [],
            package_manager: 'npm',
            scripts: {},
            tree: [],
        };

        createConfiguration(answers, 'config.json')
            .then(() => {
                spinner.succeed(chalk.bold('Created configuration file!'));
            })
            .catch(() => {
                spinner.fail('Failed to create configuration file!');
            });
    } else {
        promptForConfig().then((answers: Answers) => {
            const spinner = ora().start(
                chalk.bold('Creating configuration file!')
            );
            createConfiguration(answers, 'config.json')
                .then(() => {
                    spinner.succeed(chalk.bold('Created configuration file!'));
                })
                .catch(() => {
                    spinner.fail('Failed to create configuration file!');
                });
        });
    }
} else if (args.projectName) {
    console.log(title);
    console.log(chalk.blueBright.bold('PROCESS'));
    tree(configOpts, '');
    npmInit(configOpts, args, '');
} else {
    console.log(title);
    Helper(HelpSpecs.all);
    let args_string = '';
    for (const arg of process.argv.slice(2)) {
        args_string += `'${arg}' `;
    }

    console.log(
        '\n' +
            chalk.red.bold('ERROR: ') +
            'Unknown or unexpected command' +
            (process.argv.slice(2).length >= 2
                ? `s ${args_string}`
                : ` ${args_string}`)
    );
}
