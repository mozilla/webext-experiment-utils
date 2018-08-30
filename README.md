# WebExtension Experiment Utils

Tools for rapid development of WebExtension Experiments based on a `schema.json` API definition.

- generateStubApi - generates a stub api.js based on `schema.json`
- documentSchema - generates documentation in Markdown based on `schema.json`
- verifyWeeSchema - verifies that `schema.json` is a valid WebExtension Experiments schema

For a usage example, see the `npm run generate` command in [./package.json](./package.json) and the example files in [./example/](./example/).

## Installation

```shell
npm install --save-dev mozilla/webext-experiment-utils#develop
```

## Hints

1.  Put all the privileged code of your add-on in `src/privileged` as a best practice
2.  The 'Firefox privileged' modules cannot use WebExtension apis (`browserAction`, `management`, etc.). Use a `background.js` script (using messages and events) to co-ordinate multiple privileged modules.

## A note on automatic testing of WebExtension Experiments

WebExtension Experiments can not be automatically tested in the same manner as the official (in-tree) WebExtension APIs. Partially, such testing could work by copying over source files into the Firefox source tree and then building from source, but doing so would not let us catch the specific issues associated with bundling WebExtension Experiments (which have different life-cycle behavior than in-tree WebExtension APIs).

Instead, we can leverage Selenium for functional testing in a way that mimics unit testing of our experiment APIs.

The [SHIELD utils test add-on](https://github.com/mozilla/shield-studies-addon-utils/tree/master/test-addon) currently accomplishes this by opening an [extension page](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/user_interface/Extension_pages), switching to that tab/window and executing javascript using driver.executeAsyncScript().

Check this helper method for more information and an initial implementation: https://github.com/mozilla/shield-studies-addon-utils/blob/develop/testUtils/executeJs.js

Tests can then be written as such:

```
  it("should be able to access window.browser from the extension page for tests", async () => {
    const hasAccessToWebExtensionApi = await utils.executeJs.executeAsyncScriptInExtensionPageForTests(
      driver,
      async callback => {
        callback(typeof browser === "object");
      },
    );
    assert(hasAccessToWebExtensionApi);
  });
```

This way, WebExtension APIs that are only exposed in background scripts can be accessed directly in automated tests.

For an example of such a testing set-up, see https://github.com/mozilla/shield-studies-addon-utils/blob/master/test/functional/browser.study.api.js
