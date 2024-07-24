
const promptfoo = require('promptfoo');

const matchesSimilarity  =promptfoo.assertions.matchesSimilarity;
// const { matchesSimilarity, matchesLlmRubric } = assertions;

module.exports.extendExpect = function () {
  expect.extend({
    async toMatchSemanticSimilarity(received, expected, threshold = 0.8, gradingConfig) {
      const result = await matchesSimilarity(received, expected, threshold,0, gradingConfig);
      const pass = received === expected || result.pass;
      if (pass) {
        return {
          message: () => `expected ${received} not to match semantic similarity with ${expected}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to match semantic similarity with ${expected}, but it did not. Reason: ${result.reason}`,
          pass: false,
        };
      }
    },
  });
}
const providers = [{
    id: 'https://phi3-airoadshow.apps.cluster-7zqkl.sandbox1499.opentlc.com:443/v1/chat/completions',
    config: {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: {
         model: "phi3",
         messages : [   
           {
             content: 'You are a helpful assistant.',
             role: 'system'
           },
           {
             content: '{{prompt}}',
             role: 'user'
           }
           ]
        },
        responseParser: 'json.choices[0].message.content'
    }
   
}];

module.exports.usePrompt = async function (prompt) {
    const response = await promptfoo.evaluate({
      prompts: [prompt],
      providers:providers
    });

    return response.results[0].response.output;

}
