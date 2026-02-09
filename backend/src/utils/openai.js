const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "Personal Finance Tracker",
  },
});

const generateFinancialInsight = async (data) => {
  const { income, expense, savings, month, year } = data;

  const prompt = `
  You are a financial advisor.
  Analyze the following monthly financial data and give suggestions.

  Month: ${month}
  Year: ${year}
  Total Income: ${income}
  Total Expense: ${expense}
  Savings: ${savings}

  Give:
  - Short summary
  - Financial advice
  - Risk warning if needed
  Keep response under 150 words.
  `;

  const response = await client.chat.completions.create({
    model: "mistralai/mistral-7b-instruct",  // FREE model
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

module.exports = { generateFinancialInsight };
