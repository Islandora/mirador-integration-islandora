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

### Mirador 4 plugin notes

`mirador-textoverlay` is intentionally not included in this build yet. The published package currently targets Mirador 3 and React 16; add it back after the Mirador 4-compatible release from the `mirador4` branch is available.
