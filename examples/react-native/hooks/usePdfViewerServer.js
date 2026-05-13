import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Server, { extractBundledAssets, getActiveServer, resolveAssetsPath } from '@dr.pogodin/react-native-static-server';
import { documentDirectory } from 'expo-file-system/legacy';

/**
 * Hook to manage a local static server for serving the bundled PDF viewer.
 * Handles platform-specific asset extraction and server lifecycle.
 * @returns {{ serverUrl: string | null, isReady: boolean, error: Error | null }}
 */
export function usePdfViewerServer() {
  const [serverUrl, setServerUrl] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const serverRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startServer = async () => {
      try {
        // Reuse existing server if already running (e.g., from hot reload)
        const activeServer = getActiveServer();
        if (activeServer) {
          setServerUrl(activeServer.origin);
          setIsReady(true);
          return;
        }

        let fileDir;

        if (Platform.OS === 'android') {
          // Android: Extract assets from APK to writable directory
          const docDir = documentDirectory.replace('file://', '');
          const destPath = `${docDir}pdf-viewer`;
          await extractBundledAssets(destPath, 'pdf-viewer');
          fileDir = destPath;
        } else {
          // iOS: Assets are directly accessible from bundle
          fileDir = resolveAssetsPath('pdf-viewer');
        }

        const server = new Server({
          fileDir,
          port: 0, // Auto-assign available port
          hostname: '127.0.0.1', // Use loopback for better compatibility
        });

        const origin = await server.start();

        if (mounted) {
          serverRef.current = server;
          setServerUrl(origin);
          setIsReady(true);
        } else {
          // Component unmounted during startup; clean up
          server.stop();
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      }
    };

    startServer();

    // Cleanup; stop server on unmount
    return () => {
      mounted = false;
      if (serverRef.current) {
        try {
          serverRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
        serverRef.current = null;
      }
    };
  }, []);

  return { serverUrl, isReady, error };
}
