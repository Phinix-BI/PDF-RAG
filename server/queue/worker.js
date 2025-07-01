import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { Document } from '@langchain/core/documents';
import env from 'dotenv';

env.config();

const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

const worker = new Worker('pdf-queue', async job => {

    const data = JSON.parse(job.data);

    if (!data || !data.path) {
        throw new Error("Invalid job data: Missing path");
    }

    try {
        const loader = new PDFLoader(data.path);
        const docs = await loader.load();

        const textSplitter = new CharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        // Use splitDocuments instead of splitText for Document objects
        const splitDocs = await textSplitter.splitDocuments(docs);

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "langchainjs-testing",
        });

        await vectorStore.addDocuments(splitDocs);

        console.log(`Processed ${splitDocs.length} documents from PDF: ${data.originalname}`);

    } catch (error) {
        console.error("Error processing PDF:", error);
        throw error; // Rethrow the error to mark the job as failed
    }



}, {
    concurrency: 100, connection: {
        host: 'localhost', // Adjust if your Redis server is hosted elsewhere
        port: 6379, // Default Redis port
    }
});