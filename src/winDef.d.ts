export { };

declare global {
  interface Window {
    modUtils: ModUtils;
    modSC2DataManager: SC2DataManager;

    modImgLoaderHooker: ImgLoaderHooker;

    jQuery: jQuery;
  }

  let Macro: {
    add: (name: string | string[], def) => any;
    delete: (name: string) => any;
    isEmpty: () => any;
    has: (name: string) => any;
    get: (name: string) => any;
  };

  interface Window {
    aaaaabbbbbccccc: (key: string) => string;
    ModWebpackExampleTs_patchLinkButton: (
      MacroRef: typeof Macro,
      ScriptingRef: typeof Scripting,
    ) => void;
    // 自定义函数
    spellBookMobileClicked: () => void;
    saveDataToIndexDB: (data: any) => any;
  }

  // AI告诉我要这样改
  interface V {
    spellBookOpening?: boolean;
  }
  declare var V: V;

  class Renderer {
    static lastModel?: any; // Assuming lastModel can be null or undefined

    static refresh(model: any): void {
      // ... implementation ...
    }
  }

  const Wikifier: WikifierAPI;
  const Scripting: ScriptingAPI;

}

export interface WikifierAPI {
  new(destination: OutputDestination | null, source: string, options?: WikifierOptions): unknown;

  createExternalLink: (destination: OutputDestination, url: string, text: string) => HTMLAnchorElement;

  createInternalLink: (
    destination: OutputDestination,
    passage: string,
    text: string,
    callback: () => void,
  ) => HTMLAnchorElement;

  isExternalLink: (link: string) => boolean;

  wikifyEval: (text: string) => DocumentFragment;
}

export interface ScriptingAPI {
  parse: (rawCodeString: string) => string;

  /**
   * Evaluates the given JavaScript code and returns the result, throwing if there were errors.
   */
  evalJavaScript: (code: string) => any;

  /**
   * Evaluates the given TwineScript code and returns the result, throwing if there were errors.
   */
  evalTwineScript: (code: string) => any;
}
