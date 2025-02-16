import extract from 'pdf-extract';
import { SummarizerManager } from 'node-summarizer';
import logger from '../../helper/logger.helper.js';

const summarizerStage = async (filePath, sentencesNumber = 5) => {
    logger('Summarizer stage started.');

    const options = { type: 'text' };

    const processor = extract(filePath, options, (err) => {
        if (err) {
            throw new Error('Error starting PDF extraction: ' + err);
        }
    });

    return new Promise((resolve, reject) => {
        processor.on('complete', async (data) => {
            try {
                const pdfText = data.text_pages.join('\n');
                
                const summarizer = new SummarizerManager(pdfText, sentencesNumber);
                const summary = await summarizer.getSummaryByRank();

                const cleanedSummary = cleanText(summary.summary);
                resolve(cleanedSummary);

                logger('Summarizer stage completed.');
            } catch (error) {
                logger('Error during summarization: ' + error, true);
                reject(error);
            }
        });

        processor.on('error', (err) => {
            logger('Error processing PDF: ' + err, true);
            reject(err);
        });
    });
};

const cleanText = (text) => {
    return text
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/[\n\f]/g, ' ') // Replace newlines and form feeds with a space
        .replace(/[^a-zA-Z0-9.,!? ]/g, '') // Remove special characters except punctuation
        .trim(); // Trim leading and trailing whitespace
};

export default summarizerStage;