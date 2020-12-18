import arg, { Spec } from 'arg';
import chalk from 'chalk';
import Table from 'cli-table';

const commands: Spec = {
    '--project': Boolean,
    '--package-manager': String,
    '--config': Boolean,
    '--overwrite': Boolean,
    '--yes': Boolean,
    '--help': Boolean || String,
    '--path': String,
    '--version': Boolean,
    '-c': '--config',
    '-p': '--package-manager',
    '-o': '--overwrite',
    '-y': '--yes',
    '-h': '--help',
    '-v': '--version',
};

export interface HelperSpecs {
    name: String;
    alias: String;
    args: String[];
    describe: String;
}

export const Helper: Function = (helpers: Array<HelperSpecs>) => {
    const table = new Table({
        chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: ' ',
        },
        style: { 'padding-left': 1, 'padding-right': 1 },
        head: [
            chalk.bold.blueBright('Name'),
            chalk.bold.blueBright('Alias'),
            chalk.bold.blueBright('Arguments'),
            chalk.bold.blueBright('Description'),
        ],
    });

    // HEAD
    for (let helper of helpers) {
        let arg_string: string = '';
        for (let arg of helper.args) {
            arg_string += `<${arg}> `;
        }

        table.push([
            helper.name,
            helper.alias,
            helper.args.length == 0 ? 'none' : arg_string,
            helper.describe,
        ]);
    }
    console.log(table.toString());
};

export const ParseArgs: Function = (rawArgs: string[]) => {
    const args = arg(commands, { argv: rawArgs.slice(2), permissive: true });

    return {
        config: args['--config'] || false,
        projectName: args['--project'] || false,
        packageManager: args['--package-manager'] || null,
        overwrite: args['--overwrite'] || false,
        skipPrompt: args['--yes'] || false,
        help: args['--help'] || false,
        path: args['--path'] || null,
        version: args['--version'] || null,
    };
};
