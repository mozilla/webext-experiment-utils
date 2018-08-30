/* eslint-env commonjs */
/* eslint no-logger: off */
/* global ExtensionAPI */

ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionUtils.jsm");

/* eslint-disable no-undef */
const { EventManager } = ExtensionCommon;
const EventEmitter =
  ExtensionCommon.EventEmitter || ExtensionUtils.EventEmitter;

this.foo = class extends ExtensionAPI {
  getAPI(context) {
    const apiEventEmitter = new EventEmitter();
    return {
      foo: {
        /* Do something with the given payload. */
        doSomething: async function doSomething(payload) {
          console.log("Called doSomething(payload)", payload);
          return "undefined";
        },

        // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
        /* Fires when deemed appropriate */
        onFoo: new EventManager(context, "foo:onFoo", fire => {
          const listener = (eventReference, arg1) => {
            fire.async(arg1);
          };
          apiEventEmitter.on("foo", listener);
          return () => {
            apiEventEmitter.off("foo", listener);
          };
        }).api(),
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
