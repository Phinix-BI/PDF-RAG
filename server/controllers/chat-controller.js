import { embeddings, vectorStore, azureOpenAI as client } from "../azure/index.js";

const chatController = async (req, res) => {

    try {
        const { question } = req.body;

        console.log("Received question:", question);

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Get the vectorStore instance
        const store = await vectorStore();

        const retriever = store.asRetriever({
            k: 2,
        });

        const result = await retriever.invoke(question);

        const SYSTEM_PROMPT = `You are a helpful assistant. Answer the question based on the provided context PDFs."
        ${JSON.stringify(result)}
        `;

        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: question }
            ]
        });

        console.log("Response from OpenAI:", response);

        // For demonstration, we'll just echo the question back
        res.status(200).json({ 
            message: response.choices[0].message.content,
            context: result
        });

    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default chatController;