/* eslint-disable */

ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
ChromeUtils.import("resource://gre/modules/ExtensionUtils.jsm");

// eslint-disable-next-line no-undef
const { EventManager } = ExtensionCommon;
// eslint-disable-next-line no-undef
const { EventEmitter } = ExtensionUtils;

this.foo = class extends ExtensionAPI {
  getAPI(context) {
    return {
      foo: {
        /* Do something with the given payload.
 */
        doSomething: async function doSomething(payload) {
          console.log("called doSomething payload");
          return "undefined";
        },

        // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
        /* Fires when deemed appropriate */
        onFoo: new EventManager(context, "foo:onFoo", fire => {
          const callback = value => {
            fire.async(value);
          };
          // RegisterSomeInternalCallback(callback);
          return () => {
            // UnregisterInternalCallback(callback);
          };
        }).api(),
      },
    };
  }
};
this.fooDebug = class extends ExtensionAPI {
  getAPI(context) {
    return {
      fooDebug: {
        /* Reset the foo internal state, for debugging purposes.
 */
        reset: async function reset() {
          console.log("called reset ");
          return undefined;
        },
      },
    };
  }
};
