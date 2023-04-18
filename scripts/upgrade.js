import shell from 'shelljs';

if (!shell.which('yarn')) throw new Error('Yarn not found. Yarn is required for this script to run.');

const branchName = process.argv[2];
const packageVersion = process.argv[3];

if (!branchName) throw new Error('Please provide branch name as first argument in order to update README.');
if (!packageVersion) throw new Error('Please provide new package version as second argument in order to update examples.');

shell.sed('-i', 'tree/.*/', `tree/${branchName}/`, 'README.md');

const exampleDirectoryNames = shell.ls("-d", "example-*");

exampleDirectoryNames.forEach((exampleDirectoryName) => {
    shell.cd(exampleDirectoryName);
    shell.exec(`yarn upgrade @pdf-tools/four-heights-pdf-web-viewer@${packageVersion}`);
    shell.cd('..');
});