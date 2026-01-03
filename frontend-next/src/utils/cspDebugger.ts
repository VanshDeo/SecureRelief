/**
 * CSP Debugger Utility
 * Helps debug Content Security Policy violations in development
 */

class CSPDebugger {
  constructor() {
    this.violations = [];
    this.isDebugMode = process.env.NODE_ENV === 'development';
    this.setupViolationListener();
  }

  setupViolationListener() {
    if (!this.isDebugMode) return;

    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleViolation(event);
    });

    // Also listen for deprecated violation events
    window.addEventListener('securitypolicyviolation', (event) => {
      this.handleViolation(event);
    });

    console.log('🛡️ CSP Debugger initialized - watching for violations');
  }

  handleViolation(event) {
    const violation = {
      timestamp: new Date().toISOString(),
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      effectiveDirective: event.effectiveDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      sample: event.sample
    };

    this.violations.push(violation);

    // Log detailed information
    console.group('🚫 CSP Violation Detected');
    console.error('Blocked URI:', violation.blockedURI);
    console.error('Violated Directive:', violation.violatedDirective);
    console.error('Effective Directive:', violation.effectiveDirective);
    console.error('Source:', `${violation.sourceFile}:${violation.lineNumber}:${violation.columnNumber}`);
    console.error('Sample:', violation.sample);
    console.error('Full Policy:', violation.originalPolicy);
    console.groupEnd();

    // Provide helpful suggestions
    this.provideSuggestions(violation);
  }

  provideSuggestions(violation) {
    const { blockedURI, violatedDirective, effectiveDirective } = violation;

    console.group('💡 CSP Fix Suggestions');

    // Web3 wallet related suggestions
    if (blockedURI.includes('chrome-extension:') || blockedURI.includes('moz-extension:')) {
      console.info('🦊 Web3 Wallet Extension Detected');
      console.info('Add to CSP:', `${effectiveDirective} chrome-extension: moz-extension:;`);
      console.info('This is required for MetaMask, WalletConnect, and other Web3 wallets');
    }

    // External script suggestions
    if (effectiveDirective === 'script-src' && blockedURI.startsWith('https:')) {
      console.info('🌐 External Script Blocked');
      console.info('Add to CSP:', `script-src 'self' ${blockedURI.split('/').slice(0, 3).join('/')};`);
      console.warn('⚠️ Only add trusted domains to your CSP');
    }

    // Inline script suggestions
    if (violatedDirective.includes("'unsafe-inline'") && effectiveDirective === 'script-src') {
      console.info('📝 Inline Script Blocked');
      console.info('Options:');
      console.info('1. Add "unsafe-inline" to script-src (less secure)');
      console.info('2. Use nonces for specific inline scripts (more secure)');
      console.info('3. Move script to external file (most secure)');
    }

    // Style suggestions
    if (effectiveDirective === 'style-src') {
      console.info('🎨 Style Blocked');
      console.info('Add to CSP:', `style-src 'self' 'unsafe-inline';`);
      console.info('Consider using nonces for production');
    }

    // Font suggestions
    if (effectiveDirective === 'font-src' && blockedURI.includes('fonts.g')) {
      console.info('🔤 Google Fonts Blocked');
      console.info('Add to CSP:', `font-src 'self' https://fonts.gstatic.com;`);
    }

    // Connect suggestions
    if (effectiveDirective === 'connect-src') {
      console.info('🔗 Connection Blocked');
      console.info('Add to CSP:', `connect-src 'self' ${blockedURI.split('/').slice(0, 3).join('/')};`);
      
      if (blockedURI.includes('localhost')) {
        console.info('🏠 Local development connection');
        console.info('Add: http://localhost:* https://localhost:*');
      }
      
      if (blockedURI.includes('avax') || blockedURI.includes('avalanche')) {
        console.info('🏔️ Avalanche network connection');
        console.info('Add: https://api.avax-test.network https://api.avax.network');
      }
    }

    console.groupEnd();
  }

  getViolations() {
    return this.violations;
  }

  getViolationSummary() {
    const summary = {};
    this.violations.forEach(violation => {
      const key = violation.effectiveDirective;
      if (!summary[key]) summary[key] = [];
      summary[key].push(violation.blockedURI);
    });
    return summary;
  }

  generateCSPFix() {
    const summary = this.getViolationSummary();
    const fixes = {};

    Object.entries(summary).forEach(([directive, uris]) => {
      const uniqueUris = [...new Set(uris)];
      fixes[directive] = uniqueUris.map(uri => {
        if (uri.includes('chrome-extension:')) return 'chrome-extension:';
        if (uri.includes('moz-extension:')) return 'moz-extension:';
        if (uri.startsWith('https:')) return uri.split('/').slice(0, 3).join('/');
        if (uri.startsWith('http:')) return uri.split('/').slice(0, 3).join('/');
        return uri;
      });
    });

    console.group('🔧 Generated CSP Fixes');
    Object.entries(fixes).forEach(([directive, sources]) => {
      console.info(`${directive}: ${sources.join(' ')}`);
    });
    console.groupEnd();

    return fixes;
  }

  clearViolations() {
    this.violations = [];
    console.info('🧹 CSP violations cleared');
  }

  // Check if current page has CSP
  checkCSP() {
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const hasCSP = metaCSP || document.querySelector('meta[http-equiv="content-security-policy"]');
    
    if (hasCSP) {
      console.group('🛡️ Current CSP Policy');
      console.info('Source:', metaCSP ? 'Meta tag' : 'HTTP header');
      console.info('Policy:', metaCSP?.content || 'Check network tab for header');
      console.groupEnd();
    } else {
      console.warn('⚠️ No CSP policy detected');
    }

    return hasCSP;
  }

  // Test common Web3 resources
  testWeb3Resources() {
    if (!this.isDebugMode) return;

    console.group('🧪 Testing Web3 Resource Access');

    // Test MetaMask detection
    if (window.ethereum) {
      console.info('✅ MetaMask/Web3 provider detected');
    } else {
      console.warn('❌ No Web3 provider found');
    }

    // Test common external resources
    const testResources = [
      'https://api.avax-test.network',
      'https://api.pinata.cloud',
      'https://fonts.googleapis.com'
    ];

    testResources.forEach(url => {
      fetch(url, { mode: 'no-cors' })
        .then(() => console.info(`✅ Can connect to ${url}`))
        .catch(() => console.warn(`❌ Cannot connect to ${url}`));
    });

    console.groupEnd();
  }
}

// Create global instance in development
let cspDebugger;
if (process.env.NODE_ENV === 'development') {
  cspDebugger = new CSPDebugger();
  
  // Make available in console
  window.cspDebugger = cspDebugger;
  
  // Auto-check CSP on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cspDebugger.checkCSP();
      cspDebugger.testWeb3Resources();
    });
  } else {
    cspDebugger.checkCSP();
    cspDebugger.testWeb3Resources();
  }
}

export default CSPDebugger;

/**
 * Usage in development console:
 * 
 * // View all violations
 * cspDebugger.getViolations()
 * 
 * // Get violation summary
 * cspDebugger.getViolationSummary()
 * 
 * // Generate CSP fixes
 * cspDebugger.generateCSPFix()
 * 
 * // Clear violations
 * cspDebugger.clearViolations()
 * 
 * // Check current CSP
 * cspDebugger.checkCSP()
 * 
 * // Test Web3 resources
 * cspDebugger.testWeb3Resources()
 */
