# 自定义魔法书（言灵集）模组
（PS:尚未发布，只是先写下文档）

## 目录
1. [一句话简介](#一句话简介)
2. [安装方式说明](#安装方式说明)
3. [讨论与反馈方式](#讨论与反馈方式)
4. [详细功能介绍](#详细功能介绍)
   - [封面&目录](#封面目录)
   - [本存档言灵集](#本存档言灵集)
   - [侧边栏言灵集](#侧边栏言灵集)
   - [公共言灵集](#公共言灵集)
   - [言灵集对应关系说明](#言灵集对应关系说明)
5.  [侧边栏模组推荐](#侧边栏模组推荐)
6.  [打包方式与仓库代码说明](#打包方式与仓库代码说明)
7.  [致谢](#致谢)

## 一句话简介

本模组是DOL游戏的言灵管理工具，推荐受众为**已使用过任一侧边栏言灵模组的玩家**，主要功能包括：将言灵按照言灵集分类，通过文件/文本框导入/导出言灵集，跨存档保存言灵集，在全部或指定言灵集中查找言灵，对本存档言灵集中的言灵进行排序/编辑/批量删除/加入侧边栏等操作，欢迎大家按需下载~

## 安装方式说明
本模组基于0.5.2.x版本进行自测，旧版本会存在不兼容的问题，请确保您手上的游戏是最新版本，然后下载release下的（文件名），并使用平时游玩汉化版时使用的mod管理器加载完汉化模组后，再加载此模组。

模组加载时会弹出密码界面，密码为本仓库的名称：**DOL-Custom-Spellbook-Mod**
（直接复制后输入即可）

<details>
  <summary><strong>点击查看图片 1.输入密码</strong></summary>

  ![输入密码](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/1-password.jpg)
</details>

加载成功后，魔法书将出现在游戏的侧边栏（收纳状态下），点击即可体验本模组~

<details>
  <summary><strong>点击查看图片 2.魔法书位置</strong></summary>

  ![魔法书位置](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/2-spellbook.jpg)
</details>

## 讨论与反馈方式
（先预留一下，等发帖/建群后更新）

## 详细功能介绍

### 封面&目录：

打开魔法书后，会进入封面&目录页面，封面包含以下六部分：

- 【使用说明】：简单的使用说明，点击标题即可查看或折叠。
- 【搜索言灵】：在本存档和跨存档的所有言灵集中搜索指定言灵。
- 【当前跨存档言灵集】：显示当前跨存档言灵集。
- 【当前本存档言灵集】：显示当前本存档言灵集。
- 【新建空白言灵集】：创建一个空白言灵集。
- 【加载言灵集】：加载已导出的言灵集文件/已复制的文本框内容。

<details>
  <summary><strong>点击查看图片 3.封面</strong></summary>

  ![封面](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/3-cover.jpg)
</details>

在【搜索言灵】中，会显示所有[本存档](#本存档言灵集)（可查看或编辑）和[跨存档](#公共言灵集)（只能查看）言灵集的搜索结果。

<details>
  <summary><strong>点击查看图片 4.从封面搜索</strong></summary>

  ![从封面搜索](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/4-search.jpg)
</details>

在【当前跨存档言灵集】和【当前本存档言灵集】中，点击言灵集名称可以直接跳转到对应的言灵集页面。

<details>
  <summary><strong>点击查看图片 5.言灵目录</strong></summary>

  ![言灵目录](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/5-contents.jpg)
</details>

通过【新建空白言灵集】和【加载言灵集】可以创建新的或加载现有的言灵集。加载时，你可以直接在文件或文本框中编辑数据。

<details>
  <summary><strong>点击查看补充 1.文件/文本框内容的具体含义</strong></summary>

  *言灵集的基本格式如下*

  ```json
  {
    "name": "侧边栏言灵", 
    "uuid": "default",
    "content": []
  }
  ```
  
  *其中，name是言灵集的名称，uuid是唯一标识符，content是言灵集的具体内容。*

  *"default"是侧边栏言灵集专属的uuid，而其他言灵集的uuid则是随机生成的。*

 *本存档言灵集和其[对应](#言灵集对应关系说明)的跨存档言灵集具有相同的uuid。*

 *（补充内容结束)*
  <br><br>
</details>

如果待加载的言灵集已存在，你可以选择【覆盖】或【新增】。覆盖[侧边栏言灵](#侧边栏言灵集) 将同时更新左侧边栏内的言灵（需在游戏内进行段落跳转/点击任意选项后生效）

<details>
  <summary><strong>点击查看图片 6.确认弹窗</strong></summary>

  ![确认弹窗](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/6-confirm.jpg)
</details>

### 本存档言灵集：

在[封面&目录](#封面目录)中通过【新建空白言灵集】或【加载言灵集】可以创建一份本存档言灵集，本存档言灵集包含以下功能：

- 【搜索言灵】：搜索当前言灵集中的言灵。
- 【编辑言灵集】：删除或重命名当前言灵集。
- 【跨存档保存言灵集】：保存当前言灵集为[公共言灵集](#公共言灵集)。
- 【导出言灵集】：导出当前言灵集，便于后续加载。
- 【添加到侧边栏】（联动功能）：将当前言灵集中的内容添加至侧边栏（需要配合[侧边栏模组](#侧边栏模组推荐)使用）。
- 【言灵列表】：浏览和编辑当前言灵集的具体内容。

<details>
  <summary><strong>点击查看图片 7.本存档言灵集</strong></summary>

  ![本存档言灵集](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/7-normal.jpg)
</details>

<details>
  <summary><strong>点击查看图片 8.编辑言灵列表</strong></summary>

  ![编辑言灵集](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/8-edit.jpg)
</details>


注意【跨存档保存】中的操作**不可撤回**，所有更改将直接影响跨存档的公共言灵集，而【编辑言灵集】中的操作**不会**影响[对应](#言灵集对应关系说明)的公共言灵集。

<details>
  <summary><strong>点击查看补充 2.跨存档言灵集的原理</strong></summary>

  *跨存档言灵集存储于浏览器的indexDB中。如果卸载并重新安装游戏，可能会丢失该数据。*
  
  *跨存档言灵集与本存档言灵集通过uuid关联，所以在本存档言灵集点击【直接保存】会导致跨存档言灵集被更新。*
  
  *（补充内容结束）*
</details>

### 侧边栏言灵集：
魔法书中自带一份侧边栏言灵，这是**与当前侧边栏言灵保持同步的言灵集**，无法删除或更名。

在加载[侧边栏模组](#侧边栏模组推荐)的情况下，编辑该言灵集内容将直接影响游戏内的侧边栏（需要在游戏内进行段落跳转/点击任意选项后生效）。

侧边栏言灵集的功能与[本存档言灵集](#本存档言灵集)相似，注意【跨存档保存言灵集】后，生成的公共言灵集不会与侧边栏言灵保持同步。

<details>
  <summary><strong>点击查看图片 9.侧边栏言灵集</strong></summary>

  ![侧边栏言灵集](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/9-default.jpg)
</details>

### 公共言灵集：

公共言灵集通过在[本存档言灵集](#本存档言灵集)中点击【跨存档保存该言灵集】生成，公共言灵集包含以下功能：

- 【搜索言灵】：搜索当前言灵集中的言灵。
- 【编辑言灵集】：复制一份到当前存档/删除言灵集。
- 【导出言灵集】：导出数据，便于后续加载。
- 【添加到侧边栏】（联动功能）：将当前言灵集添加到侧边栏。
- 【言灵列表】（仅查看）：查看言灵集内容。

<details>
  <summary><strong>点击查看图片 10.公共言灵集</strong></summary>

  ![公共言灵集](https://github.com/ZeroRing233/DOL-Custom-Spellbook-Mod/blob/master/assets/10-common.jpg)
</details>

公共言灵集与本存档言灵集功能相似，但不支持直接编辑言灵集和言灵列表，编辑需要通过【复制到当前存档】功能完成。

对公共言灵集的修改无法回退，且可能在卸载重装游戏时丢失。

### 言灵集对应关系说明：

在公共言灵集中点击【复制一份到当前存档】，或者在本存档言灵集中点击【直接保存】，都会形成两者间的对应关系。

一份跨存档言灵集只能对应一份本存档言灵集，反之亦然。

修改本存档言灵集不会影响跨存档言灵集，删除跨存档言灵集也不会删除本存档言灵集。

## 侧边栏模组推荐
本模组的[侧边栏言灵集](#侧边栏言灵集)和【添加到侧边栏】功能依赖于现有的侧边栏模组，例如：

1. [作弊拓展模组](https://github.com/chris81605/Degrees-of-Lewdity_Cheat_Extended)，推荐理由：

- 在添加/删除等基础功能之外，还拥有言灵排序，言灵别名等特殊功能。

- 具有丰富的作弊选项。

- 依赖简易框架，具有良好的兼容性。

- 模组在持续维护/更新中。

2. [BCCM](https://github.com/Tony70124/BetterCheatCommandManagement-for-DOL/issues/2)，推荐理由：

-  在添加/删除等基础功能之外，还拥有言灵开关，场景建造等神奇又好用的特殊功能。

-  使用人数较多，会有（包括本模组作者在内的）热心玩家帮忙维护。


## 打包方式与仓库代码说明

## 致谢