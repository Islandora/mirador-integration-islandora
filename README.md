## Islandora Additions

This is a fork of the demonstration project at https://github.com/ProjectMirador/mirador-integration. This project adapts the
code to work within [Drupal](https://drupal.org/) for the [Islandora](https://github.com/islandora/documentation) project.

The main differences are

1. Adding a few more plugins, and
2. Invoking Mirador is done in the islandora_mirador Drupal module.

## Integrating Mirador

This repository is designed to show integrating Mirador 4 with modern frontend build systems.

### Dependencies

The dependencies are listed in package.json.

To install them, run:

```sh
npm ci
```

### Vite

Vite is used to build the app for use by Islandora.

```sh
npm run build
```

The output folder `dist` should now contain `main.js`, which you can place in your Drupal installation under `[webroot]/libraries/mirador/dist`.

You can then go to /admin/config/media/mirador and set it to use the local version after clearing your site's cache.

The release workflow also copies `dist/main.js` to the repository root as `main.js`, commits it to `main`, and attaches that file to the GitHub Release so it can be loaded directly from a GitHub-backed CDN.

### Testing the bundle

To test the generated JavaScript locally:

```sh
npm ci
npm run build
npx playwright install --with-deps chromium
npm run test:only
```

The integration test loads `test/test.html`, imports `dist/main.js`, and initializes Mirador with `window.miradorPlugins`.

For branch builds, the `Integration Test` workflow uploads the generated bundle as a `mirador-main-js` artifact. Open the workflow run in GitHub Actions, download the artifact, unzip it, and use the included `main.js` in Drupal the same way you would use `dist/main.js` from a local build.

### Bundled plugins

The build exposes `window.miradorPlugins` for the Drupal module to pass as the second argument to `Mirador.viewer(config, window.miradorPlugins)`. This bundle currently includes:

- `mirador-image-tools`
- `mirador-dl-plugin`
- `mirador-textoverlay`

`mirador-dl-plugin` can be configured through the Mirador config object:

```js
Mirador.viewer({
  id: 'mirador',
  miradorDownloadPlugin: {
    restrictDownloadOnSizeDefinition: true,
  },
}, window.miradorPlugins);
```

### Updating Islandora after a release

After publishing a new release here, update the `mirador` library entry in the Islandora Mirador module:

https://github.com/Islandora/islandora_mirador/blob/2.x/islandora_mirador.libraries.yml

The downstream library definition is where Islandora records the Mirador version and external JavaScript URL. Update the `mirador.version`, the CDN URL under `mirador.js`, and the SRI `integrity` value for the released asset. The current 2.x entry uses this shape:

```yaml
mirador:
  version: 3.3.0
  remote: https://projectmirador.org
  license:
    name: Apache license
    url: https://github.com/ProjectMirador/mirador/blob/master/LICENSE
    gpl-compatible: true
  js:
    https://cdn.jsdelivr.net/gh/islandora/mirador-integration-islandora@gh-pages/islandora-mirador-0.1.1.js:
      type: external
      minified: true
      attributes:
        integrity: sha384-H5YQxUhUbKfpBiKCSX4CVhogXKAWLM31Wj3STZe4TIhc4F1DzfOpGJUo8Qav7eoa
        crossorigin: anonymous
```

### Mirador 4 plugin notes

`mirador-textoverlay` is included through the published 1.x package, which supports Mirador 4 and React 18/19.
