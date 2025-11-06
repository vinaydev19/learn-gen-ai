import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function indexingTheDocu(filePath) {
    const loader = new PDFLoader(filePath, { splitPages: false })
    const dou = await loader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const texts = await textSplitter.splitText(dou[0].pageContent);

    console.log(texts);
}