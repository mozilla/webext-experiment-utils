/* eslint-env commonjs */
/* eslint no-logger: off */
/* eslint no-unused-vars: off */
/* global ExtensionAPI */

this.experiments.foo = class extends ExtensionAPI {
  getAPI(context) {
    const { Services } = ChromeUtils.import(
      "resource://gre/modules/Services.jsm",
      {},
    );

    const { ExtensionCommon } = ChromeUtils.import(
      "resource://gre/modules/ExtensionCommon.jsm",
      {},
    );

    const { EventManager, EventEmitter } = ExtensionCommon;

    const { ExtensionUtils } = ChromeUtils.import(
      "resource://gre/modules/ExtensionUtils.jsm",
      {},
    );
    const { ExtensionError } = ExtensionUtils;

    const apiEventEmitter = new EventEmitter();
    return {
      experiments: {
        foo: {
          /* Do something with the given payload. */
          doSomething: async function doSomething(payload) {
            console.log("Called doSomething(payload)", payload);
            return "undefined";
          },

          // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
          /* Fires when deemed appropriate */
          onFoo: new EventManager(context, "experiments.foo:onFoo", fire => {
            const listener = (eventReference, arg1) => {
              fire.async(arg1);
            };
            apiEventEmitter.on("foo", listener);
            return () => {
              apiEventEmitter.off("foo", listener);
            };
          }).api(),
        },
      },
      fooDebug: {
        /* Reset the foo internal state, for debugging purposes. */
        reset: async function reset() {
          console.log("Called reset()");
          return undefined;
        },
      },
    };
  }
};
