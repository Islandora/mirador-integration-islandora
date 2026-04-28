import Mirador from 'mirador';
import { miradorImageToolsPlugin } from 'mirador-image-tools';
import { miradorDownloadPlugin, miradorDownloadDialogPlugin } from 'mirador-dl-plugin';


window.Mirador = Mirador;

window.miradorPlugins = [
  ...miradorImageToolsPlugin,
  miradorDownloadPlugin,
  miradorDownloadDialogPlugin,
];

