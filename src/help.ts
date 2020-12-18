import { HelperSpecs } from './ParseArguments';

export const version: HelperSpecs = {
    name: '--version',
    alias: '-v',
    args: [],
    describe: 'Show version of create-default',
};

export const help: HelperSpecs = {
    name: '--help',
    alias: '-h',
    args: ['command'],
    describe: 'Help Me!',
};

export const config: HelperSpecs = {
    name: '--config',
    alias: '-c',
    args: ['name'],
    describe: 'Configuration',
};

export const packageManager: HelperSpecs = {
    name: '--package-manager',
    alias: '-a',
    args: ['packageManager'],
    describe: 'Choose package manager.',
};

export const all: Array<HelperSpecs> = [version, help, config, packageManager];
