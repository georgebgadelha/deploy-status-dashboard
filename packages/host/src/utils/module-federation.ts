/**
 * Module Federation utilities for dynamically loading remote components.
 */

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: any;

async function loadRemoteScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[MF] Loading remote script from:', url);
    
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('[MF] Remote script loaded successfully');
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('[MF] Failed to load remote script:', url, error);
      reject(new Error(`Failed to load remote script: ${url}`));
    };
    
    document.head.appendChild(script);
  });
}

async function initializeSharedScope(): Promise<void> {
  console.log('[MF] Initializing shared scope...');
  if (!__webpack_init_sharing__) {
    throw new Error('Webpack shared scope not available');
  }
  await __webpack_init_sharing__('default');
  console.log('[MF] Shared scope initialized successfully');
}

async function getRemoteModule(scope: string, moduleName: string) {
  console.log(`[MF] Getting remote module: scope="${scope}", moduleName="${moduleName}"`);
  
  const container = (window as any)[scope];
  if (!container) {
    console.error(`[MF] Remote container not found on window. Available:`, Object.keys(window).filter(k => typeof (window as any)[k] === 'object'));
    throw new Error(`Remote container "${scope}" not found on window`);
  }

  if (!__webpack_share_scopes__) {
    throw new Error('Webpack share scopes not available');
  }

  console.log(`[MF] Initializing container "${scope}"...`);
  await container.init(__webpack_share_scopes__.default);
  
  console.log(`[MF] Getting module "${moduleName}" from container...`);
  const factory = await container.get(moduleName);
  
  console.log(`[MF] Module "${moduleName}" retrieved successfully`);
  return factory();
}

/**
 * Load a remote module dynamically via Module Federation.
 * @param url URL to the remote entry point (remoteEntry.js)
 * @param scope Module federation container name
 * @param moduleName Exposed module (e.g., './MetricsWidget')
 * @returns Promise resolving to the loaded module
 */
export async function loadRemoteModule(
  url: string,
  scope: string,
  moduleName: string
): Promise<any> {
  try {
    console.log('[MF] Loading:', { url, scope, moduleName });
    
    await loadRemoteScript(url);
    await initializeSharedScope();
    const module = await getRemoteModule(scope, moduleName);
    
    console.log('[MF] Loaded successfully!');
    return module;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[MF] Failed:', { url, scope, moduleName, message });
    throw new Error(`Failed to load remote module from ${url}: ${message}`);
  }
}
