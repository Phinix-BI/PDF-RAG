import { embeddings, vectorStore } from "../azure/index.js";

const chatController = async (req, res) => {

    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Get the vectorStore instance
        const store = await vectorStore();
        
        const retriever = store.asRetriever({
            k: 2,
        });

        const result = await retriever.invoke(question);

        

        // For demonstration, we'll just echo the question back
        res.status(200).json({result});

    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default chatController;