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

  interface Swal {
    DismissReason: any;
  }
  declare var Swal: Swal;

  interface Window {
    aaaaabbbbbccccc: (key: string) => string;
    ModWebpackExampleTs_patchLinkButton: (
      MacroRef: typeof Macro,
      ScriptingRef: typeof Scripting,
    ) => void;
    // 自定义函数
    modSweetAlert2Mod: any;
    spellBookMobileClicked: () => void;
    initDefaultSpellBook: () => void;
    getAllSpellBookItems: () => void;
    saveDataToIndexDB: (spellbookItem: SpellbookItem) => void;
    myIndexDBTest: () => void;
    exportSpellBookItem: (spellbookItem: SpellbookItem) => void;
    getIdbSpellBookItems: (spellbookItem: SpellbookItem) => void;
    getSpellBookItem: (spellbookItem: SpellbookItem) => void;
    loadSpellBookItem: () => void;
    mutableSpellBookItem: () => void;
    immutableSpellBookItem: () => void;
    spellBookItemDeleteClicked: (element) => void;
    copyIdbSpellBookItem: (spellbookItem: SpellbookItem) => void;
    zoom: (number) => void;// zoom为原有函数
  }

  // 存档内新增数据
  interface V {
    spellBookOpening?: boolean; // 判断当前魔法书是否打开
    spellBook?: { [key: string]: SpellbookItem }; // 魔法书的主要数据
    cccheatList?: string[]; //需要展示在侧边栏的言灵集（搭配其他模组使用）
    cccheat?: string[]; // 展示在侧边栏的模组列表，可能需与其他模组联动
    options: any
  }
  declare var V: V;

  interface T {
    currContent?: string[] //当前言灵集的内容
    content?: string[]
  }
  declare var T: T;

  interface SpellbookItem {
    uuid?: string;
    name?: string;
    content?: string[];
    isCommon?: boolean; // 是否跨存档
  }

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
