import { get, isFunction, isObject, isString } from "lodash-es";
// import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
// import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
/**
 *
 * @param key {string}
 */
window.aaaaabbbbbccccc = (key: string): string => {
  console.log("aaaaabbbbbccccc", key);
  return `${key}_aaaaabbbbbccccc`;
};

export interface JqEventListenerObject {
  data: any | undefined;
  guid: number;
  // eslint-disable-next-line ts/no-unsafe-function-type
  handler: Function;
  namespace: string;
  needsContext: any | undefined;
  origType: string;
  selector: any | undefined;
  type: string;
}

export type JqEventListenersDataType = Record<string, JqEventListenerObject[]>;
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export function getEventListenersFromJqNode(node: ReturnType<typeof $>): JqEventListenersDataType {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  return $._data(node[0], "events");
}

export interface LinkTypeData {
  count: number;
  external: boolean;
  isLink: boolean;
  link: string;
  setFn: any | undefined;
  text: string;
}

export function isLinkTypeData(o: any): o is LinkTypeData {
  return isObject(o) && isString(get(o, "link")) && isString(get(o, "text"));
}

const logger = window.modUtils.getLogger();

export function ModWebpackExampleTs_patchLinkButton(
  MacroRef: typeof Macro,
  ScriptingRef: typeof Scripting,
) {
  const link = MacroRef.get("link");

  if (!link) {
    console.error("patchLinkButton() cannot find macro [icon]");
    logger.error(`patchLinkButton() cannot find macro [icon]`);
    return;
  }
  // eslint-disable-next-line ts/no-unsafe-function-type
  const h: Function = link.OriginHandlerPassageQBalance;
  if (!h && !isFunction(h)) {
    console.error("patchLinkButton() cannot find macro [icon] handle", [link, h]);
    logger.error(`patchLinkButton() cannot find macro [icon] handle`);
    return;
  }

  MacroRef.delete("button");
  MacroRef.delete("link");
  MacroRef.add(["button", "link"], {
    isAsync: true,
    tags: null,

    handler() {
      // eslint-disable-next-line ts/no-this-alias
      const thisPtr = this;
      console.log("patchLinkButton handler", [thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);

      // eslint-disable-next-line prefer-rest-params
      const r = h.apply(this as any, arguments);

      const needHook = (
        (
          typeof thisPtr.args[0] === "object"
          && typeof thisPtr.args[1] === "object"
        )
        || typeof thisPtr.args[2] === "object"
      );

      if (needHook) {
        const hookData = thisPtr.args[2] || thisPtr.args[1];
        if (!isLinkTypeData(hookData)) {
          console.error("patchLinkButton() hookData invalid", [thisPtr, thisPtr.name, thisPtr.args, hookData]);
          return r;
        }
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        const outputRef = $(this.output);

        const children = outputRef.children();
        const node = children.last();

        const events = getEventListenersFromJqNode(node);

        const hookKeyList = ["keypress", "click"];

        for (const key of hookKeyList) {
          const eventList = events[key];
          if (eventList) {
            for (const event of eventList) {
              const handler = event.handler;
              event.handler = function () {
                console.log("patchLinkButton output jq events", [key, thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);
                const testR = ScriptingRef.evalTwineScript(hookData.text.trim());
                if (testR) {
                  // need filter
                  console.log("patchLinkButton filter event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                  if (hookData.text.trim() !== hookData.link.trim()) {
                    console.log("patchLinkButton run custom event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                    ScriptingRef.evalTwineScript(hookData.link.trim());
                  }
                }
                else {
                  // allow
                  console.log("patchLinkButton allow event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                  // eslint-disable-next-line prefer-rest-params
                  handler.apply(this, arguments);
                }
              };
            }
          }
        }

        // const clickH = events['click']?.[0]?.handler;
        // if (clickH) {
        //     console.log('patchLinkButton handler events', [events, events['click'], clickH.toString()]);
        //     events['click'][0].handler = function () {
        //         console.log('patchLinkButton output jq events click', [thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);
        //         // clickH.apply(this, arguments);
        //     }
        // }
      }

      return r;
    },
  });

  console.log("patchLinkButton() success");
  logger.log("patchLinkButton() success");
}

window.ModWebpackExampleTs_patchLinkButton = ModWebpackExampleTs_patchLinkButton;
