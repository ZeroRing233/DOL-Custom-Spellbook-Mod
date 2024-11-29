import type { ModBootJsonAddonPlugin } from "../types/boot.types";

export const TweeReplacer: ModBootJsonAddonPlugin = {
  modName: "TweeReplacer",
  addonName: "TweeReplacerAddon",
  modVersion: "1.0.0",
  params: [
    {
      "passage": "StoryCaption",
      "findString": "<<if $options.sidebarStats isnot \"disabled\">>",
      "replace": "<<SpellBookMobile>><<if $options.sidebarStats isnot \"disabled\">>"
    },
    {
      "passage": "overlayReplace",
      "findString": "<<switch _key>>",
      "replaceFile": "additionFile/overlayReplace.txt"
    }
  ],
};
