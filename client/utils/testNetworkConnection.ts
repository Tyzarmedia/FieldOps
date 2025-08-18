/**
 * Network connection testing utility to diagnose fetch issues
 * This can be used in the browser console for debugging
 */

/**
 * Test basic fetch functionality
 */
export async function testBasicFetch() {
  console.log('🌐 Testing basic fetch functionality...');
  
  try {
    // Test 1: Basic ping endpoint
    console.log('1. Testing /api/ping...');
    const pingResponse = await fetch('/api/ping');
    console.log('Ping status:', pingResponse.status);
    const pingData = await pingResponse.json();
    console.log('Ping data:', pingData);
    
    // Test 2: Job management endpoint
    console.log('2. Testing /api/job-mgmt/jobs/technician/tech001...');
    const jobsResponse = await fetch('/api/job-mgmt/jobs/technician/tech001');
    console.log('Jobs status:', jobsResponse.status);
    const jobsData = await jobsResponse.json();
    console.log('Jobs data:', jobsData);
    
    // Test 3: Full URL test
    console.log('3. Testing with full URL...');
    const fullUrlResponse = await fetch(`${window.location.origin}/api/ping`);
    console.log('Full URL status:', fullUrlResponse.status);
    const fullUrlData = await fullUrlResponse.json();
    console.log('Full URL data:', fullUrlData);
    
    console.log('✅ All network tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Network test failed:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}

/**
 * Test different fetch configurations
 */
export async function testFetchConfigurations() {
  console.log('🔧 Testing different fetch configurations...');
  
  const testCases = [
    {
      name: 'Basic fetch',
      config: {}
    },
    {
      name: 'With headers',
      config: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },
    {
      name: 'With method and headers',
      config: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    },
    {
      name: 'With full config',
      config: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-cache' as RequestCache
      }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing ${testCase.name}...`);
      const response = await fetch('/api/ping', testCase.config);
      console.log(`✅ ${testCase.name} - Status: ${response.status}`);
    } catch (error) {
      console.error(`❌ ${testCase.name} failed:`, error);
    }
  }
}

/**
 * Test browser environment and capabilities
 */
export function testBrowserEnvironment() {
  console.log('🔍 Testing browser environment...');
  
  const tests = {
    'fetch API': typeof fetch !== 'undefined',
    'Promise support': typeof Promise !== 'undefined',
    'JSON support': typeof JSON !== 'undefined',
    'Location object': typeof window.location !== 'undefined',
    'Origin': window.location.origin,
    'Current URL': window.location.href,
    'User Agent': navigator.userAgent,
    'Online status': navigator.onLine,
    'Service Worker': 'serviceWorker' in navigator,
    'Local Storage': typeof localStorage !== 'undefined'
  };
  
  Object.entries(tests).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    console.log(`${status} ${test}:`, result);
  });
  
  return tests;
}

/**
 * Test CORS and security headers
 */
export async function testCorsAndSecurity() {
  console.log('🔒 Testing CORS and security...');
  
  try {
    const response = await fetch('/api/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    return true;
  } catch (error) {
    console.error('CORS/Security test failed:', error);
    return false;
  }
}

/**
 * Run comprehensive network diagnostics
 */
export async function runNetworkDiagnostics() {
  console.log('🚀 Running comprehensive network diagnostics...\n');
  
  console.log('=== Browser Environment ===');
  testBrowserEnvironment();
  
  console.log('\n=== CORS and Security ===');
  await testCorsAndSecurity();
  
  console.log('\n=== Basic Fetch Tests ===');
  await testBasicFetch();
  
  console.log('\n=== Fetch Configuration Tests ===');
  await testFetchConfigurations();
  
  console.log('\n🎯 Diagnostics complete!');
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testBasicFetch = testBasicFetch;
  (window as any).testFetchConfigurations = testFetchConfigurations;
  (window as any).testBrowserEnvironment = testBrowserEnvironment;
  (window as any).testCorsAndSecurity = testCorsAndSecurity;
  (window as any).runNetworkDiagnostics = runNetworkDiagnostics;
  
  console.log('🛠️ Network testing utilities loaded!');
  console.log('Available functions:');
  console.log('- runNetworkDiagnostics() - Run all tests');
  console.log('- testBasicFetch() - Test basic fetch');
  console.log('- testBrowserEnvironment() - Check browser capabilities');
  console.log('- testCorsAndSecurity() - Test CORS headers');
}
