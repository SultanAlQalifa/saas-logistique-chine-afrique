import routesManifest from '../../routes.manifest.json'

interface LinkCheckResult {
  url: string
  status: 'success' | 'error' | 'warning'
  statusCode?: number
  error?: string
  component?: string
  critical: boolean
}

interface LinkCheckReport {
  timestamp: string
  totalLinks: number
  successCount: number
  errorCount: number
  warningCount: number
  results: LinkCheckResult[]
  criticalErrors: LinkCheckResult[]
}

/**
 * Link checker utility for build-time validation
 */
export class LinkChecker {
  private results: LinkCheckResult[] = []
  private baseUrl: string

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  /**
   * Check all routes defined in manifest
   */
  async checkAllRoutes(): Promise<LinkCheckReport> {
    this.results = []
    
    const routes = Object.entries(routesManifest.routes)
    
    for (const [name, route] of routes) {
      await this.checkRoute(name, route.path, route.component)
    }

    return this.generateReport()
  }

  /**
   * Check specific route
   */
  private async checkRoute(name: string, path: string, component: string): Promise<void> {
    // Skip parameterized routes for now (would need test data)
    if (path.includes(':')) {
      this.results.push({
        url: path,
        status: 'warning',
        error: 'Parameterized route - skipped',
        component,
        critical: false
      })
      return
    }

    const url = `${this.baseUrl}${path}`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      this.results.push({
        url: path,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        component,
        critical: !response.ok && this.isCriticalRoute(name)
      })
    } catch (error) {
      this.results.push({
        url: path,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        component,
        critical: this.isCriticalRoute(name)
      })
    }
  }

  /**
   * Determine if route is critical for application functionality
   */
  private isCriticalRoute(routeName: string): boolean {
    const criticalRoutes = [
      'dashboard',
      'packages',
      'auth.signin',
      'auth.signup',
      'track',
      'home'
    ]
    
    return criticalRoutes.includes(routeName)
  }

  /**
   * Generate comprehensive report
   */
  private generateReport(): LinkCheckReport {
    const successCount = this.results.filter(r => r.status === 'success').length
    const errorCount = this.results.filter(r => r.status === 'error').length
    const warningCount = this.results.filter(r => r.status === 'warning').length
    const criticalErrors = this.results.filter(r => r.status === 'error' && r.critical)

    return {
      timestamp: new Date().toISOString(),
      totalLinks: this.results.length,
      successCount,
      errorCount,
      warningCount,
      results: this.results,
      criticalErrors
    }
  }

  /**
   * Check for broken internal links in components
   */
  async checkInternalLinks(componentPath: string): Promise<LinkCheckResult[]> {
    // This would analyze component files for hardcoded links
    // Implementation would use AST parsing to find href attributes
    // For now, return empty array as placeholder
    return []
  }
}

/**
 * CLI utility for build-time link checking
 */
export async function runLinkCheck(): Promise<void> {
  console.log('🔍 Starting link check...')
  
  const checker = new LinkChecker()
  const report = await checker.checkAllRoutes()
  
  console.log(`\n📊 Link Check Report (${report.timestamp})`)
  console.log(`Total routes checked: ${report.totalLinks}`)
  console.log(`✅ Success: ${report.successCount}`)
  console.log(`❌ Errors: ${report.errorCount}`)
  console.log(`⚠️  Warnings: ${report.warningCount}`)
  
  if (report.criticalErrors.length > 0) {
    console.log(`\n🚨 Critical Errors (${report.criticalErrors.length}):`)
    report.criticalErrors.forEach(error => {
      console.log(`  - ${error.url}: ${error.error || `HTTP ${error.statusCode}`}`)
    })
    
    // Exit with error code for CI/CD
    process.exit(1)
  }
  
  if (report.errorCount > 0) {
    console.log(`\n❌ All Errors:`)
    report.results
      .filter(r => r.status === 'error')
      .forEach(error => {
        console.log(`  - ${error.url}: ${error.error || `HTTP ${error.statusCode}`}`)
      })
  }
  
  console.log('\n✅ Link check completed successfully!')
}

// Export for use in build scripts
if (require.main === module) {
  runLinkCheck().catch(console.error)
}
