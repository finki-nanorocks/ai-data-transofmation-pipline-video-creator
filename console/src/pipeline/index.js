import path from 'path';
import fs from 'fs';
import initStage from './stage/init.stage.js';
import logger from './../helper/logger.helper.js';
import summarizerStage from './stage/summarizer.stage.js';
import configurationStage from './stage/configuration.stage.js';
import aiStage from './stage/ai.stage.js';

export const pipelineRun = async () => {
  logger("Pipeline is running");

  const pdfFilePath = 'data/atomicHabits.pdf';
  const startPage = 116;
  const endPage = 121;

  const pdfItem = path.resolve(pdfFilePath);

  try {
    const pipelineInitStage = await initStage(pdfItem, startPage, endPage);

    const tempPdfFilePath = pipelineInitStage;

    const summarizerStageCleanedSummary = await summarizerStage(tempPdfFilePath);

    const summary = summarizerStageCleanedSummary;

    const configurationResult = await configurationStage(summary);

    const configurationAndSummaryForAI = configurationResult;

    const aiResult = await aiStage(configurationAndSummaryForAI);

    const aiResultWithSummary = aiResult;

    // Write the result to output.json file
    const outputFilePath = path.resolve('data/dist/output.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(aiResultWithSummary, null, 2));

    logger(`Result written to ${outputFilePath}`);

  } catch (error) {
    logger(`Error in pipeline: ${error}`, true);
  }
}

export default pipelineRun;