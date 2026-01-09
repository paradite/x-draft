A drafting command line tool for X to create tweets that perform well on X.

## Features

Fetch tweets (optional, might not be possible can be done manually)

- Fetch popular tweets on X
- Fetch user's tweets on X

Draft

- Analyze popular tweets on X
- Create draft tweets based on the popular tweets and the style of the user's tweets (mimic how the user writes)
- Drafts should be created using multiple models (Claude 4.5 Opus and Gemini 2.5 Pro) with different prompts to allow experimentation

Review

- Review drafts using model as evaluator and pick the best draft based on criteria / reference tweets
