const { withXcodeProject, withAppBuildGradle } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const ASSET_FOLDER_NAME = 'pdf-viewer';

/**
 * Expo config plugin to add pdf-viewer assets to both iOS and Android builds.
 *
 * Android: Adds sourceSets config to include assets directory in the APK.
 * iOS: Adds folder reference to Xcode project for bundle inclusion.
 *
 * @param {object} config - Expo config object
 * @returns {object} Modified config
 */
function withPdfViewerAssets(config) {
  config = withPdfViewerAssetsAndroid(config);
  config = withPdfViewerAssetsIOS(config);
  return config;
}

/**
 * Android: Adds sourceSets configuration to include assets in the APK.
 */
function withPdfViewerAssetsAndroid(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    // Check if already configured
    if (contents.includes("assets.srcDirs += ['../../assets']")) {
      console.log('[withPdfViewerAssets] Android sourceSets already configured');
      return config;
    }

    // Insert sourceSets block after "android {" line
    const androidBlockRegex = /(android\s*\{)/;
    const sourceSetConfig = `$1
    // Include pdf-viewer assets for local HTTP serving
    sourceSets {
        main {
            assets.srcDirs += ['../../assets']
        }
    }
`;

    if (androidBlockRegex.test(contents)) {
      config.modResults.contents = contents.replace(androidBlockRegex, sourceSetConfig);
      console.log('[withPdfViewerAssets] Added Android sourceSets configuration');
    } else {
      console.warn('[withPdfViewerAssets] Could not find android {} block in build.gradle');
    }

    return config;
  });
}

/**
 * iOS: Adds folder reference to Xcode project.
 *
 * Xcode Project Structure:
 * - PBXFileReference: Describes a file or folder in the project
 * - PBXBuildFile: Links a file reference to a build phase
 * - PBXGroup: Organizes files in the project navigator
 * - PBXResourcesBuildPhase: Specifies resources to copy into the app bundle
 */
function withPdfViewerAssetsIOS(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.projectRoot;
    const platformProjectRoot = config.modRequest.platformProjectRoot;
    const projectName = config.modRequest.projectName;

    const sourceAssetsPath = path.join(projectRoot, 'assets', ASSET_FOLDER_NAME);
    const targetAssetsPath = path.join(platformProjectRoot, projectName, ASSET_FOLDER_NAME);

    // Copy assets from project root to iOS project directory
    if (!fs.existsSync(sourceAssetsPath)) {
      console.warn(`[withPdfViewerAssets] Source assets not found: ${sourceAssetsPath}`);
      return config;
    }

    try {
      if (fs.existsSync(targetAssetsPath)) {
        fs.rmSync(targetAssetsPath, { recursive: true });
      }
      fs.cpSync(sourceAssetsPath, targetAssetsPath, { recursive: true });
      console.log(`[withPdfViewerAssets] Copied assets to: ${targetAssetsPath}`);
    } catch (err) {
      console.error(`[withPdfViewerAssets] Failed to copy assets: ${err.message}`);
      throw err;
    }

    // Check if folder reference already exists in Xcode project
    const pbxFileRef = xcodeProject.pbxFileReferenceSection();
    const alreadyExists = Object.values(pbxFileRef).some(
      (ref) => ref && typeof ref === 'object' && ref.name === ASSET_FOLDER_NAME
    );

    if (alreadyExists) {
      console.log(`[withPdfViewerAssets] Xcode reference already exists`);
      return config;
    }

    // Generate unique IDs for Xcode project entries
    const fileRefUuid = xcodeProject.generateUuid();
    const buildFileUuid = xcodeProject.generateUuid();

    // Add PBXFileReference - describes the folder in the project
    pbxFileRef[fileRefUuid] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'folder',
      name: ASSET_FOLDER_NAME,
      path: `${projectName}/${ASSET_FOLDER_NAME}`,
      sourceTree: '"<group>"',
    };
    pbxFileRef[`${fileRefUuid}_comment`] = ASSET_FOLDER_NAME;

    // Add PBXBuildFile - links the folder to the build process
    const pbxBuildFile = xcodeProject.pbxBuildFileSection();
    pbxBuildFile[buildFileUuid] = {
      isa: 'PBXBuildFile',
      fileRef: fileRefUuid,
      fileRef_comment: ASSET_FOLDER_NAME,
    };
    pbxBuildFile[`${buildFileUuid}_comment`] = `${ASSET_FOLDER_NAME} in Resources`;

    // Add to main group so it appears in Xcode's project navigator
    const mainGroupKey = xcodeProject.getFirstProject().firstProject.mainGroup;
    const mainGroup = xcodeProject.getPBXGroupByKey(mainGroupKey);
    if (mainGroup && mainGroup.children) {
      mainGroup.children.push({
        value: fileRefUuid,
        comment: ASSET_FOLDER_NAME,
      });
    }

    // Add to Resources build phase so assets are copied into app bundle
    const pbxProject = xcodeProject.hash.project.objects;
    const resourcesBuildPhases = pbxProject['PBXResourcesBuildPhase'];
    if (resourcesBuildPhases) {
      for (const key of Object.keys(resourcesBuildPhases)) {
        if (!key.endsWith('_comment') && resourcesBuildPhases[key].files) {
          resourcesBuildPhases[key].files.push({
            value: buildFileUuid,
            comment: `${ASSET_FOLDER_NAME} in Resources`,
          });
          break; // Add to first (main) target only
        }
      }
    }

    console.log(`[withPdfViewerAssets] Added folder reference to Xcode project`);

    return config;
  });
}

module.exports = withPdfViewerAssets;
