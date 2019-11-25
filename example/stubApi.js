/* eslint-env commonjs */
/* eslint no-unused-vars: off */
/* eslint no-console: ["warn", { allow: ["info", "warn", "error"] }] */
/* global ExtensionAPI */

this.foo = class extends ExtensionAPI {
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
            try {
              console.log("Called doSomething(payload)", payload);
              return "undefined";
            } catch (error) {
              // Surface otherwise silent or obscurely reported errors
              console.error(error.message, error.stack);
              throw new ExtensionError(error.message);
            }
          },

          // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
          /* Fires when deemed appropriate */
          onFoo: new EventManager({
            context,
            name: "experiments.foo:onFoo",
            register: fire => {
              const listener = async (eventReference, arg1) => {
                await fire.async(arg1);
              };
              apiEventEmitter.on("foo", listener);
              return () => {
                apiEventEmitter.off("foo", listener);
              };
            },
          }).api(),
        },
      },
      fooDebug: {
        /* Reset the foo internal state, for debugging purposes. */
        reset: async function reset() {
          try {
            console.log("Called reset()");
            return undefined;
          } catch (error) {
            // Surface otherwise silent or obscurely reported errors
            console.error(error.message, error.stack);
            throw new ExtensionError(error.message);
          }
        },
      },
    };
  }
};
