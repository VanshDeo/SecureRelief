'use client';

/**
 * CSP Debugger Utility
 * Helps debug Content Security Policy violations in development
 * Client-side only (Next.js safe)
 */

type CSPViolation = {
  timestamp: string;
  blockedURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
  sample: string;
};

class CSPDebugger {
  private violations: CSPViolation[] = [];
  private isDebugMode: boolean;

  constructor() {
    this.isDebugMode = process.env.NODE_ENV === 'development';

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    this.setupViolationListener();
  }

  private setupViolationListener() {
    if (!this.isDebugMode) return;

    document.addEventListener(
      'securitypolicyviolation',
      (event: SecurityPolicyViolationEvent) => {
        this.handleViolation(event);
      }
    );

    console.log('🛡️ CSP Debugger initialized (development mode)');
  }

  private handleViolation(event: SecurityPolicyViolationEvent) {
    const violation: CSPViolation = {
      timestamp: new Date().toISOString(),
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      effectiveDirective: event.effectiveDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      sample: event.sample ?? ''
    };

    this.violations.push(violation);

    console.group('🚫 CSP Violation Detected');
    console.error('Blocked URI:', violation.blockedURI);
    console.error('Violated Directive:', violation.violatedDirective);
    console.error('Effective Directive:', violation.effectiveDirective);
    console.error(
      'Source:',
      `${violation.sourceFile}:${violation.lineNumber}:${violation.columnNumber}`
    );
    console.error('Sample:', violation.sample);
    console.error('Full Policy:', violation.originalPolicy);
    console.groupEnd();

    this.provideSuggestions(violation);
  }

  private provideSuggestions(violation: CSPViolation) {
    const { blockedURI, effectiveDirective, violatedDirective } = violation;

    console.group('💡 CSP Fix Suggestions');

    if (
      blockedURI.includes('chrome-extension:') ||
      blockedURI.includes('moz-extension:')
    ) {
      console.info('🦊 Web3 Wallet Extension Detected');
      console.info(
        'Suggested CSP:',
        `${effectiveDirective} chrome-extension: moz-extension:;`
      );
    }

    if (effectiveDirective === 'script-src' && blockedURI.startsWith('https')) {
      console.info('🌐 External Script Blocked');
      console.info(
        'Suggested CSP:',
        `script-src 'self' ${blockedURI
          .split('/')
          .slice(0, 3)
          .join('/')};`
      );
    }

    if (
      violatedDirective.includes("'unsafe-inline'") &&
      effectiveDirective === 'script-src'
    ) {
      console.info('📝 Inline Script Blocked');
      console.info('Use nonces or external scripts instead');
    }

    if (effectiveDirective === 'style-src') {
      console.info('🎨 Style Blocked');
      console.info("Suggested CSP: style-src 'self' 'unsafe-inline';");
    }

    if (effectiveDirective === 'font-src') {
      console.info('🔤 Font Blocked');
      console.info(
        "Suggested CSP: font-src 'self' https://fonts.gstatic.com;"
      );
    }

    if (effectiveDirective === 'connect-src') {
      console.info('🔗 Network Request Blocked');
      console.info(
        'Suggested CSP:',
        `connect-src 'self' ${blockedURI
          .split('/')
          .slice(0, 3)
          .join('/')};`
      );
    }

    console.groupEnd();
  }

  // ===== Public API =====

  public getViolations(): CSPViolation[] {
    return this.violations;
  }

  public clearViolations() {
    this.violations = [];
    console.info('🧹 CSP violations cleared');
  }

  public getViolationSummary() {
    const summary: Record<string, string[]> = {};

    this.violations.forEach((v) => {
      if (!summary[v.effectiveDirective]) {
        summary[v.effectiveDirective] = [];
      }
      summary[v.effectiveDirective].push(v.blockedURI);
    });

    return summary;
  }

  public generateCSPFix() {
    const summary = this.getViolationSummary();
    const fixes: Record<string, string[]> = {};

    Object.entries(summary).forEach(([directive, uris]) => {
      fixes[directive] = [...new Set(uris)].map((uri) => {
        if (uri.startsWith('https://') || uri.startsWith('http://')) {
          return uri.split('/').slice(0, 3).join('/');
        }
        return uri;
      });
    });

    console.group('🔧 Generated CSP Fixes');
    Object.entries(fixes).forEach(([dir, sources]) => {
      console.info(`${dir}: ${sources.join(' ')}`);
    });
    console.groupEnd();

    return fixes;
  }

  public checkCSP() {
    if (typeof document === 'undefined') return false;

    const metaCSP = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    );

    if (metaCSP) {
      console.group('🛡️ Current CSP');
      console.info('Source: Meta tag');
      console.info('Policy:', metaCSP.getAttribute('content'));
      console.groupEnd();
      return true;
    }

    console.warn('⚠️ No CSP policy detected');
    return false;
  }

  public testWeb3Resources() {
    if (!this.isDebugMode || typeof window === 'undefined') return;

    console.group('🧪 Testing Web3 Resource Access');

    if ((window as any).ethereum) {
      console.info('✅ Web3 provider detected');
    } else {
      console.warn('❌ No Web3 provider found');
    }

    console.groupEnd();
  }
}

// ===== Global Dev Instance =====

let cspDebugger: CSPDebugger | null = null;

if (
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined'
) {
  cspDebugger = new CSPDebugger();

  (window as any).cspDebugger = cspDebugger;

  window.addEventListener('load', () => {
    cspDebugger?.checkCSP();
    cspDebugger?.testWeb3Resources();
  });
}

export default CSPDebugger;
