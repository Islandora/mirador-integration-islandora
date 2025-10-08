const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
    let browser;
    let exitCode = 0;

    try {
        console.log('Starting Mirador integration test...');

        // Check if main.js exists
        const mainJsPath = path.resolve(__dirname, '../webpack/dist/main.js');
        if (!fs.existsSync(mainJsPath)) {
            console.error('❌ Error: main.js not found at', mainJsPath);
            console.error('Please run "npm run webpack" to build main.js first');
            process.exit(1);
        }
        console.log('✓ Found main.js at', mainJsPath);

        // Launch browser
        browser = await chromium.launch({
            headless: true
        });
        console.log('✓ Browser launched');

        const context = await browser.newContext();
        const page = await context.newPage();

        // Capture console messages
        const consoleMessages = [];
        const consoleErrors = [];

        page.on('console', msg => {
            const text = msg.text();
            consoleMessages.push(text);
            if (msg.type() === 'error') {
                consoleErrors.push(text);
            }
        });

        // Capture page errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
        });

        // Intercept manifest fetch and return it directly
        await page.route('**/test-manifest.json', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    "@context": "http://iiif.io/api/presentation/2/context.json",
                    "@id": "http://localhost/test-manifest.json",
                    "@type": "sc:Manifest",
                    "label": "Test Manifest",
                    "description": "Minimal manifest for integration testing",
                    "sequences": [{
                        "@type": "sc:Sequence",
                        "canvases": [{
                            "@id": "http://localhost/canvas/1",
                            "@type": "sc:Canvas",
                            "label": "Test Canvas",
                            "height": 100,
                            "width": 100,
                            "images": [{
                                "@type": "oa:Annotation",
                                "motivation": "sc:painting",
                                "resource": {
                                    "@id": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                                    "@type": "dctypes:Image",
                                    "format": "image/png",
                                    "height": 100,
                                    "width": 100
                                },
                                "on": "http://localhost/canvas/1"
                            }]
                        }]
                    }]
                })
            });
        });

        // Load the test page
        const testHtmlPath = 'file://' + path.resolve(__dirname, 'test.html');
        console.log('Loading test page:', testHtmlPath);

        await page.goto(testHtmlPath, {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        console.log('✓ Test page loaded');

        // Wait longer for Mirador to initialize and load the manifest
        await page.waitForTimeout(5000);

        // Debug: Check what's in the DOM
        const domSnapshot = await page.evaluate(() => {
            const container = document.getElementById('mirador');
            return {
                hasContainer: !!container,
                childCount: container ? container.children.length : 0,
                innerHTML: container ? container.innerHTML.substring(0, 500) : 'no container'
            };
        });
        console.log('DOM snapshot:', domSnapshot);

        // Check if Mirador loaded successfully
        const miradorLoaded = await page.evaluate(() => {
            return window.miradorLoadedSuccessfully === true;
        });

        const miradorDefined = await page.evaluate(() => {
            return typeof window.Mirador !== 'undefined';
        });

        const miradorInstanceExists = await page.evaluate(() => {
            return typeof window.miradorInstance !== 'undefined';
        });

        // Get captured console errors from the page
        const capturedErrors = await page.evaluate(() => {
            return window.consoleErrors || [];
        });

        // Check if Mirador container has content
        const miradorContainerHasContent = await page.evaluate(() => {
            const container = document.getElementById('mirador');
            return container && container.children.length > 0;
        });

        // Check if Mirador actually loaded the manifest by looking for canvas/window elements
        const manifestLoaded = await page.evaluate(() => {
            const container = document.getElementById('mirador');
            // Look for Mirador's window component which indicates manifest was processed
            // Mirador uses MUI classes, so check for various possible indicators
            const hasWindow = container && (
                container.querySelector('[class*="Window"]') ||
                container.querySelector('[class*="window"]') ||
                container.querySelector('[class*="MuiPaper"]') ||
                container.querySelector('div[role="region"]')
            );
            return !!hasWindow;
        });

        // Display results
        console.log('\n=== Test Results ===');
        console.log('Mirador defined on window:', miradorDefined ? '✓' : '✗');
        console.log('Mirador instance created:', miradorInstanceExists ? '✓' : '✗');
        console.log('Mirador loaded successfully:', miradorLoaded ? '✓' : '✗');
        console.log('Mirador container populated:', miradorContainerHasContent ? '✓' : '✗');
        console.log('IIIF manifest loaded in viewer:', manifestLoaded ? '✓' : '✗');

        if (pageErrors.length > 0) {
            console.log('\n⚠️  Page Errors:');
            pageErrors.forEach(err => console.log('  -', err));
        }

        if (capturedErrors.length > 0) {
            console.log('\n⚠️  Console Errors:');
            capturedErrors.forEach(err => console.log('  -', err));
        }

        if (consoleErrors.length > 0) {
            console.log('\n⚠️  Browser Console Errors:');
            consoleErrors.forEach(err => console.log('  -', err));
        }

        // Determine test success
        const hasErrors = pageErrors.length > 0 || capturedErrors.length > 0;
        const testPassed = miradorDefined && miradorLoaded && miradorContainerHasContent && manifestLoaded && !hasErrors;

        if (testPassed) {
            console.log('\n✅ All tests passed! Mirador loaded successfully.');
        } else {
            console.log('\n❌ Tests failed!');
            exitCode = 1;
        }

    } catch (error) {
        console.error('❌ Test error:', error.message);
        exitCode = 1;
    } finally {
        if (browser) {
            await browser.close();
            console.log('\n✓ Browser closed');
        }
        process.exit(exitCode);
    }
}

// Run the test
runTest();
