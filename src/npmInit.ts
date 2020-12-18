import fs from 'fs';
import execa from 'execa';
import ora, { Ora } from 'ora';
import chalk from 'chalk';
import path from 'path';
import { AnyARecord } from 'dns';

const installDependencies = (
    start: string,
    succes: string,
    fail: string,
    dev: boolean,
    packageManager: string,
    dependencies: string[]
) => {
    const spinner = ora().start(start);
    execa(
        packageManager,
        packageManager === 'yarn'
            ? dev
                ? ['add', '-D', ...dependencies]
                : ['add', ...dependencies]
            : dev
            ? ['install', '-D', ...dependencies]
            : ['install', ...dependencies]
    )
        .then(() => {
            spinner.succeed(succes);
        })
        .catch(() => {
            spinner.fail(chalk.red.bold('ERROR: ') + fail);
        });
};

export const npmInit = (configOpts: any, args: any, dir: string) => {
    // const configOpts: any = args.path ? args.path : config(path);
    //node_cmd.runSync('npm init --yes');
    const packageManager: string = args.overwrite
        ? args.packageManager
        : configOpts.package_manager;
    // Dependencies
    const dependencies: string[] = configOpts._dependencies;
    //Dev Dependencies
    const dev_dependencies: string[] = configOpts._devDependencies;

    const package_json: string = path.join('package.json');
    const allowedNames = [
        'author',
        'name',
        'bin',
        'src',
        'license',
        'dependencies',
        'version',
        'main',
        'scripts',
    ];

    if (packageManager === 'yarn' || packageManager === 'npm') {
        // Create package.json.
        const package_json_create_task = ora().start(
            'Creating package.json...'
        );

        if (!fs.existsSync(package_json)) {
            execa.sync(packageManager, ['init', '--yes']);
            package_json_create_task.succeed('Created package.json!');
        } else package_json_create_task.info('Found package.json');

        // Initialize package.json

        const package_json_init_task = ora().start(
            'Initializing package.json...'
        );
        // Get data from package.json
        const package_data = JSON.parse(fs.readFileSync(package_json, 'utf-8'));

        // Set values.
        for (const [key, value] of Object.entries(configOpts)) {
            package_data[key] = allowedNames.includes(key)
                ? value
                : package_data[key];
            //  console.log(package_data[key]);
        }

        // Overwrite package.json
        fs.writeFileSync(
            package_json,
            JSON.stringify(package_data, null, 2),
            'utf-8'
        );

        package_json_init_task.succeed('Initialized package.json');

        if (dependencies && dependencies.length != 0) {
            installDependencies(
                `Installing dependencies with ${packageManager}...`,
                `Installed dependencies with ${packageManager}`,
                `Installing dependencies failed.`,
                false,
                packageManager,
                dependencies
            );
        }

        if (dev_dependencies && dev_dependencies.length != 0) {
            installDependencies(
                `Installing dev dependencies with ${packageManager}...`,
                `Installed dev dependencies with ${packageManager}`,
                `Installing dev dependencies failed.`,
                true,
                packageManager,
                dev_dependencies
            );
        }
    } else {
        console.log(chalk.red.bold('ERROR: ') + 'Package manager not valid.');
    }
};
