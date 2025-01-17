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
    saveItemToIndexDB: (spellbookItem: SpellbookItem) => void;
    saveItemToIndexDB_new: (spellbookItem: SpellbookItem) => void;
    exportSpellBookItem: (spellbookItem: SpellbookItem) => void;
    getIdbSpellBookItems: (spellbookItem: SpellbookItem) => void;
    getSpellBookItem: (spellbookItem: SpellbookItem) => void;
    loadSpellBookItem: () => void;
    mutableSpellBookItem: () => void;
    immutableSpellBookItem: () => void;
    spellBookItemShowView: (id: string) => void;
    spellBookItemEdit: (id: string) => void;
    spellBookItemDelete: (id: string) => void;
    spellBookItemAddContent: () => void;
    spellBookItemDeleteAll: () => void;
    renameSpellBookItem: () => void;
    hideRenameItem: () => void;
    confirmRenameItem: () => void;
    hideAddContent: () => void;
    confirmAddContent: (option: string) => void;
    hideTextArea: (id: string) => void;
    saveTextArea: (id: string) => void;
    copyIdbSpellBookItem: (spellbookItem: SpellbookItem) => void;
    deleteIdbSpellBookItem: (SpellbookItem: SpellbookItem) => void;
    deleteNormalSpellBookItem: (SpellbookItem: SpellbookItem) => void;
    uploadSpellBookItem: (file_input) => void;
    createSpellBookItem: (itemName: string) => void;
    spellBookTabClicked_common: (id: string) => void;
    spellBookTabClicked_normal: (id: string) => void;
    searchSpellBookItem: (searchString: string, searchId: string) => void;
    clearSpellBookItemSearchResult: () => void;
    jumpToResult_common: (searchResult: string) => void;
    jumpToResultFromCover_common: (id: string, searchResult: string) => void;
    jumpToResult_normal: (searchResult: string, option: string) => void;
    jumpToResultFromCover_normal: (id: string, searchResult: string, option: string) => void;
    dealWithCccheat: (option: string) => void;
    jumpToSpellBookItemList: () => void;
    zoom: (number) => void;// zoom为原有函数
  }

  // 存档内新增数据
  interface V {
    spellBookOpening?: boolean; // 判断当前魔法书是否打开
    spellBook?: { [key: string]: SpellbookItem }; // 本地存档中的魔法书
    cccheat?: string[]; // 展示在侧边栏的模组列表，需与其他模组联动
    cccheat_name?: string[]; //作弊拓展的言灵别名
    options: any;
  }
  declare var V: V;

  interface T {
    content?: string[]
    name?: string
    spellBookCommon?: { [key: string]: SpellbookItem }; //公共魔法书数据展示
    searchResults?: []
    spellBookSearchTextbox?: "";
    spellBookRenameTextbox?: "";
    spellBookNewNameTextbox?: "";
    uuid?: stiring;
    tab: Tab;//原版自带的tab
  }
  declare var T: T;

  interface SpellbookItem {
    uuid?: string;
    name?: string;
    content?: string[];
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
