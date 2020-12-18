import inquirer, { Answers } from 'inquirer';
import fs from 'fs';
import PATH from 'path';

export const promptForConfig: Function = () => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: 'configName',
                    message: 'What is your configuration name:',
                    type: 'input',
                },
                {
                    name: 'default',
                    message: 'Set this config file default:',
                    type: 'confirm',
                },
                {
                    name: 'packageManager',
                    message: 'Which package manager do you want to use:',
                    type: 'list',
                    choices: ['npm', 'yarn'],
                },
                {
                    name: 'author',
                    message: "What is author's name:",
                    type: 'input',
                },
                {
                    name: 'main',
                    message: 'What is your main file:',
                    type: 'input',
                    default: 'index.js',
                },
                {
                    name: 'gitIgnore',
                    message: 'Create .gitignore file:',
                    type: 'confirm',
                },
                {
                    name: 'vscode',
                    message: 'Create vscode files:',
                    type: 'confirm',
                },
                {
                    name: 'dependencies',
                    message: 'Write your dependencies with spaces:',
                    type: 'input',
                },
                {
                    name: 'devDependencies',
                    message: 'Write your dev dependencies with spaces:',
                    type: 'input',
                },
                {
                    name: 'scripts',
                    message: 'Write your scripts with spaces:',
                    type: 'input',
                },
            ])
            .then((answers) => {
                if (answers.scripts != '') {
                    let scripts: [] = answers.scripts.split(' ');
                    let prompts: Answers = [];

                    for (let script of scripts) {
                        prompts.push({
                            name: `${script}`,
                            message: `What does '${script}' script do:`,
                            type: 'input',
                        });
                    }

                    answers.dependencies_work = answers.dependencies.split(' ');
                    answers.devDependencies_work = answers.devDependencies.split(
                        ' '
                    );

                    inquirer
                        .prompt(prompts)
                        .then((scr) => {
                            answers.scripts_work = scr;
                            resolve(answers);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    resolve(answers);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const createConfiguration: Function = (
    answers: Answers,
    path: string
) => {
    return new Promise((resolve, reject) => {
        console.log(answers);
        const tree = [];
        if (answers.gitIgnore) {
            tree.push({
                name: '.gitignore',
                isFile: true,
                content: '',
            });
        }

        if (answers.vscode) {
            tree.push({
                name: '.vscode',
                isFile: false,
                tree: [
                    {
                        name: 'settings.json',
                        isFile: true,
                        content: '// VS CODE SETTINGS',
                    },
                    {
                        name: 'launch.json',
                        isFile: true,
                        content: '// VS CODE LAUNCH',
                    },
                    {
                        name: 'tasks.json',
                        isFile: true,
                        content: '// VS CODE TASKS',
                    },
                ],
            });
        }

        const content = {
            name: answers.name,
            author: answers.author,
            main: answers.main,
            default: answers.default,
            gitIgnore: answers.gitIgnore,
            scripts: answers.scripts_work ? answers.scripts_work : {},
            package_manager: answers.packageManager,
            tree: tree,
            _dependencies: answers.dependencies_work,
            _devDependencies: answers.devDependencies_work,
        };

        if (!fs.existsSync(PATH.join(process.cwd(), answers.configName))) {
            fs.appendFile(
                PATH.join(process.cwd(), `${answers.configName}.json`),
                JSON.stringify(content, null, 2),
                (err) => {
                    if (err) reject();

                    resolve(null);
                }
            );
        } else {
            fs.writeFile(
                PATH.join(process.cwd(), answers.configName),
                JSON.stringify(content, null, 2),
                (err) => {
                    if (err) reject();

                    resolve(null);
                }
            );
        }
    });
};
