# DoLModRspackExampleTS

## 运行

### 安装依赖

进入到工作区执行

```shell
pnpm install
```

### 开发执行

1. 在根目录创建`game`文件夹
2. 放置游戏到`game`文件夹下
   - 如有需要加载的`mod`,在`game`文件夹下创建`mods`子文件夹
3. 改名游戏本体文件名为`index.html`
4. 在工作区中执行
   ```shell
   pnpm dev
   ```
5. 在浏览器中打开`http://localhost:5678`进入开发服务
6. 编写完代码,直接刷新浏览器即可查看到结果

### 构建mod.zip

构建名称为`package.json`中的`name`字段

在工作区中执行

```shell
pnpm build
```
进行构建,构建完的成果物在`dist`目录下存放

## boot.json

### name

使用`package.json`中`name`字段

### version

使用`package.json`中`version`字段

### scriptFileList

在`src/scriptFileList`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_preload

在`src/scriptFileList_preload`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_earlyload

在`src/scriptFileList_earlyload`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_inject_early

在`src/scriptFileList_inject_early`目录下编写`typescript`脚本,通过`rspack`进行构建

### styleFileList

在`src/styleFileList`目录下放置,直接拷贝到`mod.zip`

### tweeFileList

在`src/tweeFileList`目录下放置,直接拷贝到`mod.zip`

### imgFileList

在`src/imgFileList`目录下放置,直接拷贝到`mod.zip`

### replacePatchList

在`src/replacePatchList`目录下放置,直接拷贝到`mod.zip`

### additionFile

在`src/additionFile`目录下放置,直接拷贝到`mod.zip`

### additionBinaryFile

在`src/additionBinaryFile`目录下放置,直接拷贝到`mod.zip`

### addonPlugin

在`src/addonPlugin`目录下将内容添加到`index.ts`文件的数组中,按照`ModBootJsonAddonPlugin`声明格式进行编写

### dependenceInfo

在`src/dependenceInfo`目录下将内容添加到`index.ts`文件的数组中,按照`DependenceInfo`声明格式进行编写

## 材质替换

在工作区目录下`originImage`文件夹中放置图片及文件夹,即可实现材质替换功能

## 额外配置

### 加密

在工作区`config`目录下,修改`crypto.ts`配置文件配置`mod`加密

```typescript
export const cryptoConfig = {
  // 是否开启加密
  enabled: true,
  // Mod加密密码
  password: "123456789",
  // 密码提示文本
  passwordHint: "密码提示信息：猜猜密码是什么？",
  // 密码存放位置
  passwordHintFile: "passwordHint.txt",
};
```
根据注释进行配置即可