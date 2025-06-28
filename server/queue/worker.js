import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from '@langchain/core/documents';

const worker = new Worker('pdf-queue', async job => {

    const data = JSON.parse(job.data);
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    console.log(docs);

},{ concurrency:100, connection : {
    host: 'localhost', // Adjust if your Redis server is hosted elsewhere
    port: 6379, // Default Redis port
}});