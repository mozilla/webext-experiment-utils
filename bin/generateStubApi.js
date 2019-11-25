#!/usr/bin/env node

/* eslint-env node */

/** Goal: create an Example (fake) Api from
 * a webExtension Experiment schema.json file
 *
 */
const path = require("path");

const FILEHEADER = `/* eslint-env commonjs */
/* eslint no-logger: off */
/* eslint no-unused-vars: off */
/* eslint no-console: off */
/* global ExtensionAPI */

`;

function schema2fakeApi(schemaApiJSON) {
  process.stdout.write(FILEHEADER);

  const firstNamespace = schemaApiJSON[0].namespace;

  process.stdout.write(`
this.${firstNamespace} = class extends ExtensionAPI {
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
    return {`);

  for (const i in schemaApiJSON) {
    const part = schemaApiJSON[i];
    const ns = part.namespace;

    const functionStrings = [];
    const eventStrings = [];
    // functions
    for (const j in part.functions) {
      const elem = part.functions[j];
      const args = (elem.parameters || []).map(x => x.name).join(", ");
      functionStrings.push(`
      /* ${elem.description.replace(/\n$/, "") ||
        "@TODO no description given"} */
      ${elem.name}: ${["", "async "][Boolean(elem.async) * 1]}function ${
  elem.name
}  ( ${args} ) {
        try {
          console.log("Called ${elem.name}(${args})", ${args});
          return ${JSON.stringify(elem.defaultReturn)};
        } catch (error) {
          // Surface otherwise silent or obscurely reported errors
          console.error(error.message, error.stack);
          throw new ExtensionError(error.message);
        }
      },`);
    }
    // events
    for (const j in part.events) {
      const elem = part.events[j];
      // TODO const args = (elem.parameters || []).map(x => x.name).join(", ");
      // assuming events are using naming convention "onFoo"
      const elemNameWithoutOn =
        elem.name.charAt(2).toLowerCase() + elem.name.slice(3);
      eventStrings.push(`
      // https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/events.html
      /* ${elem.description} */
      ${elem.name}: new EventManager(
        context,
        "${ns}:${elem.name}", fire => {
        const listener = (eventReference, arg1) => {
          fire.async(arg1);
        };
        apiEventEmitter.on("${elemNameWithoutOn}", listener);
        return () => {
          apiEventEmitter.off("${elemNameWithoutOn}", listener);
        };
      }).api(),
      `);
    }

    const namespaceObjectOpening = ns.replace(".", ": {");
    const namespaceObjectClosing = "}".repeat(ns.split(".").length);

    // put it all together
    process.stdout.write(`
      ${namespaceObjectOpening}: {
        ${functionStrings.join("\n")}

        ${eventStrings.join("\n")}
      ${namespaceObjectClosing},`);
  }

  process.stdout.write(`
    }
  }
}`);
}

schema2fakeApi(require(path.resolve(process.argv[2])));
