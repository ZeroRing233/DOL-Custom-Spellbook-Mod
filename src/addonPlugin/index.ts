import type { ModBootJsonAddonPlugin } from "../types/boot.types.ts";
import { TweeReplacer } from "./twee-replacer.ts";

export const addonPlugin: ModBootJsonAddonPlugin[] = [
  TweeReplacer,
];
