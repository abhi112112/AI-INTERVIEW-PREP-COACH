// Official Anthropic SDK for interacting with Claude 3 / 3.5 models
const { Anthropic } = require('@anthropic-ai/sdk');

/**
 * Explanation for beginners:
 * Why do we use system prompts enforcing JSON output?
 * LLMs (Large Language Models) generate natural language by default. When building web applications,
 * backends need machine-readable structured data (like JSON objects with keys: score, strengths, suggestion)
 * so the frontend can render specific UI elements like progress bars, badge lists, and charts smoothly.
 */

// Instantiate Anthropic API client using environment key
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return null;
  }
  return new Anthropic({ apiKey });
};

/**
 * Safely parses raw JSON output from LLM response, stripping markdown backticks if present.
 */
const parseJSONFromLLM = (text) => {
  try {
    // Strip markdown code fence markers ```json ... ``` if Claude outputs them
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('[Claude Service] JSON parse error on output:', text);
    throw new Error('Failed to parse structured JSON response from LLM');
  }
};

/**
 * Generates 5 interview questions based on category or Job Description using Claude API.
 * @param {string} category - Behavioral, Technical/DSA, Project Walkthrough, etc.
 * @param {string} jobDescription - Custom job description text (optional)
 */
const generateQuestions = async (category, jobDescription = '') => {
  const anthropic = getAnthropicClient();

  // Prompt construction requesting strict JSON format
  const promptText = `
You are an expert tech hiring manager and interview coach.
Generate exactly 5 distinct, high-quality interview questions for the category: "${category}".
${jobDescription ? `Context Job Description:\n${jobDescription}\n` : ''}

Output Requirement:
Return ONLY a valid JSON array of 5 question objects. Do not include any introductory or concluding text.
Each object MUST have the following schema:
[
  {
    "id": "q1",
    "questionText": "Detailed question string...",
    "category": "${category}",
    "difficulty": "Easy" | "Medium" | "Hard"
  }
]
`;

  if (!anthropic) {
    console.log('[Claude Service] ANTHROPIC_API_KEY missing or placeholder. Using intelligent fallback generator.');
    return getFallbackQuestions(category, jobDescription);
  }

  try {
    // Call Claude API (claude-3-5-sonnet or claude-3-haiku)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.7,
      system: 'You are a professional technical interviewer API engine that responds strictly in valid JSON arrays.',
      messages: [{ role: 'user', content: promptText }],
    });

    const contentText = response.content[0]?.text;
    const questions = parseJSONFromLLM(contentText);

    if (Array.isArray(questions) && questions.length > 0) {
      return questions.slice(0, 5).map((q, index) => ({
        id: q.id || `q${index + 1}`,
        questionText: q.questionText || q.question || 'Describe a scenario from your past experience.',
        category: category,
        difficulty: q.difficulty || 'Medium',
      }));
    } else {
      throw new Error('LLM output was not a non-empty array');
    }
  } catch (err) {
    console.error('[Claude Service Error] Question generation failed:', err.message);
    // Graceful error recovery: Return curated fallback questions instead of crashing the backend
    return getFallbackQuestions(category, jobDescription);
  }
};

/**
 * Evaluates a candidate's interview answer using Claude API.
 * Uses the STAR method rubric (Situation, Task, Action, Result) for behavioral evaluation.
 */
const evaluateAnswer = async (questionText, category, userAnswer) => {
  const anthropic = getAnthropicClient();

  const isBehavioral = category.toLowerCase().includes('behavioral');

  const promptText = `
You are an expert interview coach evaluating a candidate's answer.

Question (${category}): "${questionText}"
Candidate's Answer: "${userAnswer}"

Evaluation Criteria:
1. Score out of 10 based on structure, depth, clarity, and relevance.
2. List 2-3 specific Strengths of the answer.
3. List 1-2 specific Weaknesses of the answer.
4. Provide 1 concise, actionable Suggestion for improvement.
${
  isBehavioral
    ? '5. Perform a STAR method analysis (Situation, Task, Action, Result) assessing how well each element was covered.'
    : ''
}

Output Requirement:
Return ONLY a valid JSON object matching this exact schema:
{
  "score": 8,
  "strengths": ["Clear context", "Quantified results"],
  "weaknesses": ["Lack of detail on individual contribution"],
  "suggestion": "Elaborate more on the specific tech stack choices you made.",
  "starAnalysis": {
    "situation": "Clearly stated the team size and challenge.",
    "task": "Defined responsibility well.",
    "action": "Needs more detail on specific technical actions taken.",
    "result": "Metrics were good but explain long-term impact."
  }
}
`;

  if (!anthropic) {
    console.log('[Claude Service] ANTHROPIC_API_KEY missing or placeholder. Using intelligent fallback evaluator.');
    return getFallbackEvaluation(questionText, category, userAnswer);
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      temperature: 0.3, // Lower temperature for more consistent, objective scoring
      system: 'You are an objective interview evaluator API engine that responds strictly in valid JSON objects.',
      messages: [{ role: 'user', content: promptText }],
    });

    const contentText = response.content[0]?.text;
    const evalData = parseJSONFromLLM(contentText);

    return {
      score: Math.min(Math.max(Number(evalData.score) || 7, 1), 10),
      strengths: Array.isArray(evalData.strengths) ? evalData.strengths : ['Good clear communication style'],
      weaknesses: Array.isArray(evalData.weaknesses) ? evalData.weaknesses : ['Could add more technical detail'],
      suggestion: evalData.suggestion || 'Try structuring your response with clear metrics and outcomes.',
      starAnalysis: evalData.starAnalysis || {
        situation: 'Context was established.',
        task: 'Core goal explained.',
        action: 'Steps outlined clearly.',
        result: 'Results provided.',
      },
    };
  } catch (err) {
    console.error('[Claude Service Error] Answer evaluation failed:', err.message);
    return getFallbackEvaluation(questionText, category, userAnswer);
  }
};

/**
 * Intelligent local fallback question provider when Claude API is unreachable or key is unconfigured.
 */
function getFallbackQuestions(category, jobDescription) {
  if (category === 'Behavioral') {
    return [
      {
        id: 'q1',
        questionText: 'Tell me about a time you had a major conflict with a team member and how you resolved it.',
        category: 'Behavioral',
        difficulty: 'Medium',
      },
      {
        id: 'q2',
        questionText: 'Describe a situation where a project missed a deadline or failed. What did you learn?',
        category: 'Behavioral',
        difficulty: 'Hard',
      },
      {
        id: 'q3',
        questionText: 'Give an example of a time when you had to take initiative on a feature without clear requirements.',
        category: 'Behavioral',
        difficulty: 'Medium',
      },
      {
        id: 'q4',
        questionText: 'How do you handle receiving critical feedback from a senior colleague or manager?',
        category: 'Behavioral',
        difficulty: 'Easy',
      },
      {
        id: 'q5',
        questionText: 'Describe your most successful project. What was your role and why was it successful?',
        category: 'Behavioral',
        difficulty: 'Medium',
      },
    ];
  } else if (category === 'Technical/DSA') {
    return [
      {
        id: 'q1',
        questionText: 'How would you design a rate limiter middleware for a high-traffic REST API? What data structures would you use?',
        category: 'Technical/DSA',
        difficulty: 'Hard',
      },
      {
        id: 'q2',
        questionText: 'Explain the difference between SQL and NoSQL databases. When would you prefer MongoDB over PostgreSQL?',
        category: 'Technical/DSA',
        difficulty: 'Medium',
      },
      {
        id: 'q3',
        questionText: 'Explain how JWT authentication works. How do you handle token revocation or refresh tokens safely?',
        category: 'Technical/DSA',
        difficulty: 'Medium',
      },
      {
        id: 'q4',
        questionText: 'What is the Event Loop in Node.js, and how does asynchronous non-blocking I/O work under the hood?',
        category: 'Technical/DSA',
        difficulty: 'Medium',
      },
      {
        id: 'q5',
        questionText: 'Describe the Time and Space complexity of QuickSort vs MergeSort. In what scenarios is QuickSort preferred?',
        category: 'Technical/DSA',
        difficulty: 'Easy',
      },
    ];
  } else if (category === 'Project Walkthrough') {
    return [
      {
        id: 'q1',
        questionText: 'Walk me through the system architecture of the most complex web application you have built.',
        category: 'Project Walkthrough',
        difficulty: 'Hard',
      },
      {
        id: 'q2',
        questionText: 'What was the toughest technical bottleneck or performance issue you encountered in your project, and how did you debug it?',
        category: 'Project Walkthrough',
        difficulty: 'Hard',
      },
      {
        id: 'q3',
        questionText: 'How did you handle state management, authentication, and security in your application?',
        category: 'Project Walkthrough',
        difficulty: 'Medium',
      },
      {
        id: 'q4',
        questionText: 'If you had to rewrite your project from scratch today, what framework or architectural choices would you change and why?',
        category: 'Project Walkthrough',
        difficulty: 'Medium',
      },
      {
        id: 'q5',
        questionText: 'How did you test and deploy your application? What CI/CD or monitoring strategies did you use?',
        category: 'Project Walkthrough',
        difficulty: 'Easy',
      },
    ];
  } else {
    // Custom JD fallback questions
    return [
      {
        id: 'q1',
        questionText: `Based on the job description provided, how does your technical background align with the core requirements of this role?`,
        category: 'Custom Job Description',
        difficulty: 'Medium',
      },
      {
        id: 'q2',
        questionText: 'Describe a project where you solved a problem closely matching the responsibilities outlined in this JD.',
        category: 'Custom Job Description',
        difficulty: 'Hard',
      },
      {
        id: 'q3',
        questionText: 'What specific tools or frameworks mentioned in the job description are you most proficient in, and where do you need growth?',
        category: 'Custom Job Description',
        difficulty: 'Medium',
      },
      {
        id: 'q4',
        questionText: 'How do you prioritize competing tasks when delivering a tight feature deadline under this job role?',
        category: 'Custom Job Description',
        difficulty: 'Easy',
      },
      {
        id: 'q5',
        questionText: 'Why are you interested in this position, and what unique value will you bring to the engineering team?',
        category: 'Custom Job Description',
        difficulty: 'Medium',
      },
    ];
  }
}

/**
 * Intelligent local fallback evaluator when Claude API is unreachable.
 */
function getFallbackEvaluation(questionText, category, userAnswer) {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  const hasSTAR = /situation|task|action|result|when|because|achieved|improved/i.test(userAnswer);

  let score = 6;
  if (wordCount > 60) score += 2;
  if (hasSTAR) score += 1;
  score = Math.min(score, 9);

  return {
    score,
    strengths: [
      wordCount > 40 ? 'Sufficient detail provided in explanation' : 'Direct and concise response',
      hasSTAR ? 'Used action-oriented vocabulary to describe impact' : 'Addressed the question prompt directly',
    ],
    weaknesses: [
      wordCount < 50 ? 'Answer could be expanded with more concrete metrics and outcomes' : 'Could sharpen technical explanations',
    ],
    suggestion: 'Follow the STAR framework closely: explicitly describe the Situation, Task, Action taken, and measurable Result achieved.',
    starAnalysis: {
      situation: 'Context is present but can be highlighted clearer.',
      task: 'Responsibility is inferred.',
      action: 'Detailed steps described well.',
      result: 'Quantifiable metrics can be strengthened.',
    },
  };
}

module.exports = {
  generateQuestions,
  evaluateAnswer,
};
