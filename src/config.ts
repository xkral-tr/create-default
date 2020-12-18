import fs from 'fs';
export const config = (path: string) => {
    if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path, 'utf-8'));
    else return false;
};
