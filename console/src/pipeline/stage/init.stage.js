import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import logger from '../../helper/logger.helper.js';

const validatePageRange = async (pdfPath, startPage, endPage) => {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    if (startPage < 1 || endPage > totalPages || startPage > endPage) {
        return {
            isValid: false,
            totalPages,
        };
    }

    return {
        isValid: true,
        totalPages,
    };
}

const createTemporaryPdf = async (pdfPath, startPage, endPage) => {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const newPdfDoc = await PDFDocument.create();
    const pages = await newPdfDoc.copyPages(pdfDoc, Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i));

    pages.forEach((page) => {
        newPdfDoc.addPage(page);
    });

    const newPdfBytes = await newPdfDoc.save();
    const tempPdfPath = path.resolve(`data/temp/pdf_temp_${startPage}_to_${endPage}.pdf`);
    fs.writeFileSync(tempPdfPath, newPdfBytes);

    logger(`Temp PDF created at: ${tempPdfPath}`);

    return tempPdfPath;
};


const initStage = async (pdfItem, startPage, endPage) => {

    logger(`Init stage started.`);

    const { isValid, totalPages } = await validatePageRange(pdfItem, startPage, endPage);

    if (!isValid) {
        throw `Invalid page range. The document has ${totalPages} pages.`;
    }

    const tempPdfPath = await createTemporaryPdf(pdfItem, startPage, endPage);

    logger(`Init stage completed.`);

    return tempPdfPath;
}

export default initStage;