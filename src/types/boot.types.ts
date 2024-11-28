export interface IBoot {
  name: string;
  version: string;
  scriptFileList: string[];
  scriptFileList_earlyload: string[];
  scriptFileList_inject_early: string[];
  scriptFileList_preload: string[];
  additionFile: string[];
  styleFileList: any[];
  tweeFileList: any[];
  imgFileList: string[];
  replacePatchList: any[];
  additionBinaryFile: any[];
  addonPlugin: ModBootJsonAddonPlugin[];
  dependenceInfo: DependenceInfo[];
}

export interface ModBootJsonAddonPlugin {
  modName: string;
  addonName: string;
  modVersion: string;
  params?: any[] | { [key: string]: any };
}

export interface DependenceInfo {
  modName: string;
  version: string;
}
