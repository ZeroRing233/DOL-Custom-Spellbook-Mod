import type { ModBootJsonAddonPlugin } from "../types/boot.types";
import { TweeReplacer } from "./twee-replacer";

export const addonPlugin: ModBootJsonAddonPlugin[] = [
  TweeReplacer,
];
