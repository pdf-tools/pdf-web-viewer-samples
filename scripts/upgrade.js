import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

const branchName = process.argv[2];
const packageVersion = process.argv[3];

if (!branchName)
  throw new Error(
    'Please provide branch name as first argument in order to update README.'
  );
if (!packageVersion)
  throw new Error(
    'Please provide new package version as second argument in order to update examples.'
  );

shell.sed('-i', /tree\/[^\/]*/g, `tree/${branchName}`, 'README.md');

const exampleDirectories = [];

for (const exampleDirectory of findExampleDirectoriesRecursive('examples')) {
  exampleDirectories.push(exampleDirectory);
}

const rootDirectory = process.cwd();

exampleDirectories.forEach((exampleDirectory) => {
  shell.cd(exampleDirectory);
  shell.echo(`\n=== Updating example in directory ${exampleDirectory} ===\n`);
  shell.exec(
    `npm install @pdftools/four-heights-pdf-web-viewer@${packageVersion} --save --save-exact`
  );
  shell.cd(rootDirectory);
});

function* findExampleDirectoriesRecursive(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory() && file.name !== 'node_modules') {
      yield* findExampleDirectoriesRecursive(path.join(dir, file.name));
    } else {
      if (file.name === 'package.json') {
        yield dir;
      }
    }
  }
}
