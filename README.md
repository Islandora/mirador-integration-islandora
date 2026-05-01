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
npm install
```

### Vite

Vite is used to build the app for use by Islandora.

```sh
npm run build
```

The output folder `dist` should now contain `main.js`, which you can place in your Drupal installation under `[webroot]/libraries/mirador/dist`.

You can then go to /admin/config/media/mirador and set it to use the local version after clearing your site's cache.

The release workflow also copies `dist/main.js` to the repository root as `main.js`, commits it to `main`, and attaches that file to the GitHub Release so it can be loaded directly from a GitHub-backed CDN.

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

`mirador-textoverlay` is intentionally not included in this build yet. The published package currently targets Mirador 3 and React 16; add it back after the Mirador 4-compatible release from the `mirador4` branch is available.
