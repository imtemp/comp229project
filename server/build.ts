/**
 * Removes old files.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';


try {
    // Remove current build
    fs.removeSync('./dist/');
} catch (err) {
    Logger.Err(err);
}
