import env from 'dotenv';
import { QdrantVectorStore } from "@langchain/qdrant";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { AzureOpenAI } from "openai";


env.config();

export const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

export const vectorStore = async () => {
    return await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
    });
};

export const azureOpenAI = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_CHAT_API_KEY,
    endpoint: process.env.AZURE_OPENAI_CHAT_API_ENDPOINT,
    deployment: "gpt-4o-mini",
    apiVersion: "2024-04-01-preview",
});

