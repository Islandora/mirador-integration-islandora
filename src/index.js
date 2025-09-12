import Mirador from 'mirador/dist/es/src/index';
import MiradorDownload from 'mirador-dl-plugin';
import MiradorDownloadDialogPlugin from 'mirador-dl-plugin';


import { miradorImageToolsPlugin } from 'mirador-image-tools';
import textOverlayPlugin from 'mirador-textoverlay/es';

window.Mirador = Mirador;

window.miradorPlugins = [
  ...miradorImageToolsPlugin,
  ...textOverlayPlugin,
  MiradorDownload.miradorDownloadPlugin,
  MiradorDownload.MiradorDownloadDialogPlugin,

];

