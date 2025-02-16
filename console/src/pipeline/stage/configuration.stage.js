import fs from 'fs';
import path from 'path';
import logger from '../../helper/logger.helper.js';

const configurationStage = async (summary) => {
    logger('Configuration stage started.');

    try {
        const configFilePath = path.resolve('data/script.json');
        const configData = fs.readFileSync(configFilePath, 'utf8');
        const config = JSON.parse(configData);

        // Amend the summary with configuration data
        const configuration = {
            example: { ...config },
            summary,
        };

        logger('Configuration stage completed.');

        return JSON.stringify(configuration);

    } catch (error) {
        logger(`Error during configuration stage: ${error}`, true);
        throw error;
    }
}

export default configurationStage;