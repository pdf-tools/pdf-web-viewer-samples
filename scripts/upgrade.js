import shell from 'shelljs'

if (!shell.which('yarn'))
  throw new Error('Yarn not found. Yarn is required for this script to run.')

const branchName = process.argv[2]
const packageVersion = process.argv[3]

if (!branchName)
  throw new Error(
    'Please provide branch name as first argument in order to update README.'
  )
if (!packageVersion)
  throw new Error(
    'Please provide new package version as second argument in order to update examples.'
  )

shell.sed('-i', 'tree/.*/', `tree/${branchName}/`, 'README.md')

const exampleRootFolders = [
  'vanilla-typescript-examples',
]

const exampleDirectoryPaths = []

exampleRootFolders.forEach((exampleRootFolder) => {
  shell.cd(exampleRootFolder)

  const directories = shell.ls()

  exampleDirectoryPaths.push(...directories.map((directory) => `${exampleRootFolder}/${directory}`))
  
  shell.cd('..')
})

exampleDirectoryPaths.forEach((exampleDirectoryPath) => {
  shell.cd(exampleDirectoryPath)
  shell.exec(`yarn upgrade @pdf-tools/four-heights-pdf-web-viewer@${packageVersion}`)
  shell.cd('../..')
})
