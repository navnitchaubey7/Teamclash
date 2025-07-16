// backend/controllers/aiController.js
const openai = require('../services/openaiClient');

exports.generateTaskDescription = async (req, res) => {
  const { shortTitle } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a detailed task description for: "${shortTitle}"`,
        },
      ],
    });

    const description = completion.choices[0].message.content;
    console.log("AI Response:", description);

    res.json({ description });
  } catch (err) {
    console.error("❌ OpenAI Error:", err); // 👈 This will show exact cause
    res.status(500).json({ message: 'Failed to generate description' });
  }
};
