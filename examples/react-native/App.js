import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePdfViewerServer } from './hooks/usePdfViewerServer';

/**
 * Main application component that sets up a `WebView` to display a PDF viewer served from a local static server.
 * The PDF viewer is initialized and served using the `usePdfViewerServer` hook,
 * which handles asset extraction and server management.
 * The `WebView` listens for messages from the viewer to handle events,
 * such as viewer readiness, document loading, and errors.
 * @returns {JSX.Element} The rendered application component.
 */
export default function App() {
  // Get the server URL and status from the custom hook
  const { serverUrl, isReady, error } = usePdfViewerServer();

  /**
   * A helper function that handles messages received from the `WebView`.
   * @param {Object} event - The event object containing message data from the `WebView`.
   * @returns {void}
   */
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', data);
    } catch (e) {
      // In case of JSON parsing error, log the raw message
      console.log('Message from WebView:', event.nativeEvent.data);
    }
  };

  /**
   * A helper function that handles errors from the `WebView`.
   * @param {Object} syntheticEvent - The event object containing error data from the `WebView`.
   * @returns {void}
   */
  const handleError = (syntheticEvent) => {
    if (syntheticEvent?.nativeEvent) {
      console.warn('WebView error:', syntheticEvent.nativeEvent);
    }
  };

  // In case of server error, show an error message
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>&#9888;</Text>
          <Text style={styles.errorTitle}>Failed to Start Viewer</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // In case the server is not ready, show a loading state
  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Starting PDF viewer...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Once the server is ready, render the `WebView` with the viewer
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>PDF Web Viewer</Text>
      </View>
      <WebView
        source={{ uri: serverUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        // Optionally, enable debugging in development
        webviewDebuggingEnabled={__DEV__}
      />
    </SafeAreaView>
  );
}

/**
 * Styles for the application components, including container layout,
 * header styling, `WebView` sizing, and error/loading states.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
