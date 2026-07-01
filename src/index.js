import './process-shim';
import Mirador from 'mirador';
import { miradorImageToolsPlugin } from 'mirador-image-tools';
import miradorDownloadPlugins from 'mirador-dl-plugin';
import textOverlayPlugin from 'mirador-textoverlay';

window.Mirador = Mirador;

window.miradorPlugins = [
  ...miradorImageToolsPlugin,
  ...textOverlayPlugin,
  ...miradorDownloadPlugins,
];
