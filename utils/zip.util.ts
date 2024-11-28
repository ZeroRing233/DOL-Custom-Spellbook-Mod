import type { IBoot } from "../src/types/boot.types.ts";
import { Buffer } from "node:buffer";
import { existsSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { walkSync } from "@nodelib/fs.walk";
import * as AdmZip from "adm-zip";
import { cryptoConfig } from "../config/crypto.ts";
import { name, version } from "../package.json";
import { addonPlugin } from "../src/addonPlugin";
import { dependenceInfo } from "../src/dependenceInfo";
import { encryptModZipFile } from "./encrypt.util.ts";

function getSrcFileList(filePath: string, srcDir: string, modZip: AdmZip) {
  const srcFilePath = resolve(srcDir, filePath);
  if (!existsSync(srcFilePath)) {
    return Object.fromEntries(
      [[
        filePath,
        [],
      ]],
    );
  }
  const srcScriptList = readdirSync(srcFilePath).filter(item => item !== ".gitkeep");
  if (srcScriptList.length) {
    modZip.addLocalFolder(srcFilePath, filePath, (filename) => {
      return !filename.endsWith(".gitkeep");
    });
  }

  return Object.fromEntries([
    [
      filePath,
      walkSync(
        srcFilePath,
        {
          basePath: filePath,
          pathSegmentSeparator: "/",
        },
      )
        .filter(item => item.name !== ".gitkeep" && item.dirent.isFile())
        .map(item => item.path),
    ],
  ]);
}

function loadOriginImage(srcDir: string, modZip: AdmZip) {
  const originImagePath = resolve(srcDir, "originImage");
  if (!existsSync(originImagePath)) {
    return [];
  }
  const originList = readdirSync(originImagePath)
    .filter(item => item !== ".gitkeep")
    .map(item => resolve(originImagePath, item));
  if (originList.length) {
    originList.forEach((item) => {
      const itemStat = statSync(item);
      if (itemStat.isDirectory()) {
        modZip.addLocalFolder(item, relative(originImagePath, item));
      }
      else if (itemStat.isFile()) {
        modZip.addLocalFile(item);
      }
    });
    return walkSync(
      originImagePath,
      {
        basePath: "",
        pathSegmentSeparator: "/",
      },
    )
      .filter(item => item.name !== ".gitkeep" && item.dirent.isFile())
      .map(item => item.path);
  }
  return [];
}

export async function createZip(_cwd: string, filename: string) {
  const scriptFileDir = new Set([
    "scriptFileList_earlyload",
    "scriptFileList_inject_early",
    "scriptFileList_preload",
    "scriptFileList",
  ]);
  const distDir = resolve(_cwd, "dist");
  const srcDir = resolve(_cwd, "src");
  const modZip = new AdmZip();
  const fileList = Object.fromEntries(readdirSync(distDir)
    .filter(item => scriptFileDir.has(item))
    .map((key) => {
      const scriptList = readdirSync(resolve(distDir, key)).filter(item => item.endsWith(".js")).map(_file => [key, _file].join("/"));
      if (scriptList.length) {
        modZip.addLocalFolder(resolve(distDir, key), key);
      }
      return [
        key,
        scriptList,
      ];
    }));
  const result: IBoot = {
    name,
    version,
    ...fileList,
    ...getSrcFileList("additionFile", srcDir, modZip),
    ...getSrcFileList("styleFileList", srcDir, modZip),
    ...getSrcFileList("tweeFileList", srcDir, modZip),
    ...getSrcFileList("imgFileList", srcDir, modZip),
    ...getSrcFileList("replacePatchList", srcDir, modZip),
    ...getSrcFileList("additionBinaryFile", srcDir, modZip),
    addonPlugin,
    dependenceInfo,
  } as IBoot;
  result.imgFileList.push(...loadOriginImage(srcDir, modZip));
  modZip.addFile("boot.json", Buffer.from(JSON.stringify(result, null, 2), "utf-8"));
  if (cryptoConfig.enabled) {
    const cryptoZip = new AdmZip();
    cryptoZip.addLocalFile(resolve(__dirname, "static/earlyload.js"));
    cryptoZip.addLocalFile(resolve(__dirname, "static/SimpleCryptWrapper.js"));
    cryptoZip.addFile(cryptoConfig.passwordHintFile, Buffer.from(cryptoConfig.passwordHint));
    const encryptModData = await encryptModZipFile(modZip.toBuffer(), cryptoConfig.password, filename);
    const cryptoBootFile = {
      name,
      version,
      ...getSrcFileList("additionFile", srcDir, cryptoZip),
      additionFile: [],
      styleFileList: [],
      tweeFileList: [],
      imgFileList: [],
      replacePatchList: [],
      scriptFileList_preload: [],
      scriptFileList: [],
      additionBinaryFile: [
        encryptModData.crypt.name,
        encryptModData.salt.name,
        encryptModData.nonce.name,
      ],
      scriptFileList_earlyload: [
        "earlyload.js",
      ],
      scriptFileList_inject_early: [
        "SimpleCryptWrapper.js",
      ],
      dependenceInfo: [
        {
          modName: "ModLoader",
          version: "^2.5.1",
        },
        {
          modName: "SweetAlert2Mod",
          version: "^1.0.0",
        },
      ],
    };
    (cryptoBootFile as any).additionFile.push(cryptoConfig.passwordHintFile);
    cryptoZip.addFile(encryptModData.crypt.name, Buffer.from(encryptModData.crypt.data));
    cryptoZip.addFile(encryptModData.salt.name, Buffer.from(encryptModData.salt.data));
    cryptoZip.addFile(encryptModData.nonce.name, Buffer.from(encryptModData.nonce.data));
    cryptoZip.addFile("boot.json", Buffer.from(JSON.stringify(cryptoBootFile, null, 2), "utf-8"));
    return cryptoZip;
  }
  return modZip;
}
