import { config } from './config';
import ora, { Ora } from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import PATH from 'path';

export const awaitAll = (tree: any, dir: string) => {
    const promises = [];

    for (let obj of tree) {
        promises.push(createFilesAndDirs(dir, obj));
    }

    const spinner = ora().start();

    Promise.all(promises)
        .then(() => {
            spinner.succeed(
                `Created files and directories to ${
                    dir == '' ? 'root directory' : `${dir}`
                }.`
            );
        })
        .catch(() => {
            spinner.fail(
                chalk.red.bold('ERROR: ') +
                    `Failed to create files and directories to ${
                        dir == '' ? 'root directory' : `${dir}`
                    }.`
            );
        });
};

const createFilesAndDirs = (dir: string, obj: any) => {
    return new Promise((resolve, reject) => {
        const path = PATH.join(process.cwd(), dir, obj.name);

        if (!fs.existsSync(path) && dir == '.vscode') {
            fs.mkdirSync(dir);
        }

        if (obj.isFile) {
            if (!fs.existsSync(path)) {
                fs.appendFile(
                    path,
                    JSON.stringify(obj.json, null, 2) || obj.content || '',
                    (err) => {
                        if (err) reject();
                        resolve('done');
                        //  console.log(chalk.redBright(err));
                    }
                );
                //     console.log('Path not exist', path);
            } else {
                fs.writeFile(path, obj.content || '', (err) => {
                    if (err) reject();
                    resolve('done');
                    //   console.log(chalk.bold(path));
                });
                //console.log('Path exist:', path);
            }
        } else {
            if (!obj.tree) {
                // DIRECTORY
                // console.log(path);
                if (!fs.existsSync(path)) {
                    fs.mkdir(path, (err) => {
                        if (err) reject();
                        resolve('done');
                    });
                }
            } else {
                // RECURSIVE
                // console.log(obj.tree[0]);
                if (!fs.existsSync(path)) {
                    fs.mkdir(path, (err) => {
                        if (err) reject();
                        awaitAll(obj.tree, `${dir}/${obj.name}`);
                        resolve('done');
                    });
                } else {
                    awaitAll(obj.tree, `${dir}/${obj.name}`);
                    resolve('done');
                }
            }
        }
    });
};

export const tree = (configOpts: any, path: string) => {
    // const configOpts: any = config(path);

    //console.log(chalk.blueBright.bold('Create Files And Directories'));
    if (configOpts.tree && configOpts.tree.length != 0) {
        //  const spinner = ora().start();
        awaitAll(configOpts.tree, path);
    }
};
