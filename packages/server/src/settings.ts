import fsPromises from 'fs/promises';
import path from 'path';
import type { Settings } from '@sky-time/shared';

const settingsFolder = './data/settings';

const defaultSettings: Settings = {
  main: {},
  recurring: [],
};

fsPromises.mkdir(settingsFolder, { recursive: true });

export const readSettings = async () => {
  try {
    const settingsFile = path.join(settingsFolder, 'main.json');
    const settings = await fsPromises.readFile(settingsFile, 'utf8');
    return JSON.parse(settings);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      writeSettings(defaultSettings);
      return defaultSettings;
    }
    throw e;
  }
};

//TODO: add versioning
export const writeSettings = async (settings: Settings) => {
  const settingsFile = path.join(settingsFolder, 'main.json');
  await fsPromises.writeFile(settingsFile, JSON.stringify(settings, null, 2));
};
