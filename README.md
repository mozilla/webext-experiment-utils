# WebExtension Experiment Utils

Tools for rapid development of WebExtension Experiments based on a `schema.json` API definition.

- generateStubApi - generates a stub api.js based on `schema.json`
- documentSchema - generates documentation in Markdown based on `schema.json`
- verifyWeeSchema - verifies that `schema.json` is a valid WebExtension Experiments schema

For a usage example, see the `npm run generate` command in [./package.json](./package.json) and the example files in [./example/](./example/).

## Installation

```shell
npm install --save-dev motin/webext-experiment-utils#develop
```

## Hints

1.  Put all the privileged code of your add-on in `src/privileged` as a best practice
2.  The 'Firefox privileged' modules cannot use WebExtension apis (`browserAction`, `management`, etc.). Use a `background.js` script (using messages and events) to co-ordinate multiple privileged modules.
