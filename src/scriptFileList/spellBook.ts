import { SpellbookDB } from './SpellbookDB';
import { saveAs } from 'file-saver';
import { Sortable } from 'sortablejs';
import Swal from 'sweetalert2';

$(document).on(":oncloseoverlay", () => {
    if (V.spellBookOpening) {
        V.spellBookOpening = false;
        let bookIcon: HTMLElement | null = document.querySelector(".SpellBookMobile");
        if (bookIcon) {
            bookIcon.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNDNzlGRUYiIGQ9Ik0xMS42IDkuNTI3YS42OC42OCAwIDAgMS0uNTEuMzcxbC0xLjQ1NC4yMTJsMS4wNTIgMS4wMjVhLjY4LjY4IDAgMCAxIC4xOTUuNmwtLjI0OSAxLjQ0OGwxLjMtLjY4NGEuNjguNjggMCAwIDEgLjYzMiAwbDEuMy42ODRsLS4yNDktMS40NDhhLjY4LjY4IDAgMCAxIC4xOTUtLjZsMS4wNTItMS4wMjVsLTEuNDUzLS4yMTJhLjY4LjY4IDAgMCAxLS41MS0uMzdMMTIuMjUgOC4yMXpNNCA0LjVBMi41IDIuNSAwIDAgMSA2LjUgMkgxOGEyLjUgMi41IDAgMCAxIDIuNSAyLjV2MTQuMjVhLjc1Ljc1IDAgMCAxLS43NS43NUg1LjVhMSAxIDAgMCAwIDEgMWgxMy4yNWEuNzUuNzUgMCAwIDEgMCAxLjVINi41QTIuNSAyLjUgMCAwIDEgNCAxOS41em02LjU0MiA0LjEwOGwtMi40Ni4zNTdhLjY3OC42NzggMCAwIDAtLjM3NyAxLjE1N2wxLjc4IDEuNzM1bC0uNDIgMi40NWEuNjc4LjY3OCAwIDAgMCAuOTg0LjcxNmwyLjIwMS0xLjE1N2wyLjIgMS4xNTdhLjY3OC42NzggMCAwIDAgLjk4NS0uNzE1bC0uNDItMi40NWwxLjc4LTEuNzM2YS42NzguNjc4IDAgMCAwLS4zNzYtMS4xNTdsLTIuNDYtLjM1N2wtMS4xLTIuMjNhLjY3OC42NzggMCAwIDAtMS4yMTcgMHoiLz48L3N2Zz4=')";
        }
    }
});

async function spellBookMobileClicked() {
    V.spellBookOpening = true;
    initSpellBook();
    await getIdbSpellBookItems();
    $.wiki("<<overlayReplace \"spellBookOpen\">>");
    $(function () {
        let bookIcon: HTMLElement | null = document.querySelector(".SpellBookMobile");
        if (bookIcon) {
            // 暂时就这样写死，别吐槽
            bookIcon.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGw9IiNDNzlGRUYiIGQ9Ik0xNSA0LjdWNGE2LjggNi44IDAgMCAwLTQuNDg0LTEuOTk5YTIuODQgMi44NCAwIDAgMC0yLjUxMy45OTVhMy4wMiAzLjAyIDAgMCAwLTIuNTE1LS45OTVBNi44IDYuOCAwIDAgMCAxIDR2LjdMMCA1djEwbDYuNy0xLjRsLjMuNGgybC4zLS40TDE2IDE1VjV6bS05LjUyIDYuNjFhOC4yIDguMiAwIDAgMC0zLjUyNi45MDJMMiA0LjQyQTUuMjIgNS4yMiAwIDAgMSA1LjM2OSAzYTQuNTUgNC41NSAwIDAgMSAyLjE1OS43MDFsLS4wMTkgNy44NjlhNi42IDYuNiAwIDAgMC0yLjAzOS0uMjU5em04LjUyLjg4YTguMSA4LjEgMCAwIDAtMy40NjgtLjg4bC0uMTYxLS4wMDJjLS42NiAwLTEuMjk3LjA5Ni0xLjg5OS4yNzRsLjA0Ny03LjkwMmE0LjUgNC41IDAgMCAxIDIuMDk2LS42NzlhNS4yMiA1LjIyIDAgMCAxIDMuMzg2IDEuNDIybC0uMDAzIDcuNzY4eiIvPjwvc3ZnPg==')";
        }
    });
}
window.spellBookMobileClicked = spellBookMobileClicked;

function initSpellBook() {
    if (!V.spellBook) {
        V.spellBook = {};
    }
    if (!V.cccheat) {
        V.cccheat = [];
    }
    if (!V.cccheat_name) {
        V.cccheat_name = [];
    }
    // 奇妙的魔法，V.spellBook["default"].content = V.cccheat; 两个变量指向同一对象，一方改变另一方也会随之改变
    V.spellBook["default"] = { name: "侧边栏言灵", uuid: "default", content: V.cccheat };
}

async function saveItemToIndexDB(spellbookItem: SpellbookItem) {
    const db = new SpellbookDB();
    console.log("需要保存的值是：" + spellbookItem.name + "需要保存的内容是：" + spellbookItem.content + "需要保存的uuid：" + spellbookItem.uuid);
    let isUpdate = false;
    if (spellbookItem.uuid) {
        const result = await db.getItem(spellbookItem.uuid);
        if (result && result.content !== null) {
            isUpdate = true;
            confirmItemUpdate(spellbookItem, db);
        }
    }
    if (!isUpdate) {
        confirmItemSave(spellbookItem, db);
    }
}
window.saveItemToIndexDB = saveItemToIndexDB;


async function saveItemToIndexDB_new(spellbookItem: SpellbookItem) {
    if (T.spellBookNewNameTextbox.trim() === "") {
        alert("请输入言灵集名称！");
        return;
    }
    let newItem = JSON.parse(JSON.stringify(spellbookItem));
    newItem.uuid = generateUUID();
    newItem.name = T.spellBookNewNameTextbox;
    const result = await Swal.fire({
        title: '操作确认',
        text: '是否确认在所有存档中新增言灵集【' + newItem.name + '】？',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        const db = new SpellbookDB();
        doItemSave(newItem, db);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}
window.saveItemToIndexDB_new = saveItemToIndexDB_new;

async function confirmItemUpdate(spellbookItem: SpellbookItem, db: SpellbookDB) {
    const result = await Swal.fire({
        title: '检测到当前言灵集【' + spellbookItem.name + '】已存在',
        text: '是否更新跨存档保存的言灵集？此操作将会**永久**地更新所有存档中的【' + spellbookItem.name + '】言灵集。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        doItemUpdate(spellbookItem, db);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

async function doItemUpdate(spellbookItem: SpellbookItem, db: SpellbookDB) {
    try {
        const updatedItem = await db.updateItem(spellbookItem);
        console.log("更新成功，获取的updatedItem是" + JSON.stringify(updatedItem));
        window.modSweetAlert2Mod.fire('已更新', '当前言灵集已更新', 'success');
        await getIdbSpellBookItems();
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $(function () {
            spellBookTabClicked_common("common_" + spellbookItem.uuid);
        });
    } catch (error) {
        const errorMsg = JSON.stringify(error);
        window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
    }
}

async function confirmItemSave(spellbookItem: SpellbookItem, db: SpellbookDB) {
    const result = await Swal.fire({
        title: '检测到当前言灵集【' + spellbookItem.name + '】尚未被保存过',
        text: '是否跨存档保存该言灵集？此操作将会在所有存档中添加【' + spellbookItem.name + '】言灵集。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        doItemSave(spellbookItem, db);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

async function doItemSave(spellbookItem: SpellbookItem, db: SpellbookDB) {
    try {
        const addedItem = await db.addItem(spellbookItem);
        console.log("添加成功，获取的addedItem是" + JSON.stringify(addedItem));
        window.modSweetAlert2Mod.fire('已保存', '当前言灵集已被保存', 'success');
        await getIdbSpellBookItems();
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $(function () {
            spellBookTabClicked_common("common_" + spellbookItem.uuid);
        });
    } catch (error) {
        const errorMsg = JSON.stringify(error);
        window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
    }
}

// 获取idb存档内的言灵集，如果存在则直接覆盖
// 为节省作者脑细胞（避免idb和存档内数据不一致），公共数据编辑方式暂定为：复制一份到本存档后编辑—跨存档保存，不要打我
async function getIdbSpellBookItems() {
    T.spellBookCommon = {};
    const db = new SpellbookDB();
    const idbData: SpellbookItem[] = await db.getAllData();
    console.log("从indexDB获取到的数据是" + JSON.stringify(idbData));
    for (let idbItem of idbData) {
        T.spellBookCommon[idbItem.uuid] = idbItem;
    }
}
window.getIdbSpellBookItems = getIdbSpellBookItems;

async function exportSpellBookItem(spellbookItem: SpellbookItem) {
    const { value: fileType } = await window.modSweetAlert2Mod.fire({
        title: '导出言灵集【' + spellbookItem.name + '】为文件',
        text: '请选择文件格式:',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true,
        customClass: {
            popup: 'swal2-grayed', // Apply the custom class to the popup
            input: 'swal2-input-grayed' // Apply the custom class to input
        },
        input: 'radio',
        inputOptions: {
            '.txt': '文本文件 (.txt)',
            '.json': 'JSON 文件 (.json)',
        },
        inputValidator: (value) => {
            if (!value) {
                return '请选择文件类型';
            }
        }
    });
    if (fileType) { // Check if the user selected a file type
        try {
            let dataToExport = JSON.stringify(spellbookItem, null, 2);
            const blob = new Blob([dataToExport], { type: fileType === '.json' ? 'application/json' : 'text/plain' });
            // const url = URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = `${spellbookItem.name}${fileType}`;
            // a.click();
            // URL.revokeObjectURL(url);
            const fileName = `${spellbookItem.name}${fileType}`;
            saveAs(blob, fileName);
        } catch (error) {
            window.modSweetAlert2Mod.fire('导出失败', error, 'error')
        }
    }
}
window.exportSpellBookItem = exportSpellBookItem;

function getSpellBookItem(spellbookItem: SpellbookItem) {
    const input: any = document.getElementById("bookItemInput");
    input.value = JSON.stringify(spellbookItem);
}
window.getSpellBookItem = getSpellBookItem;


// 加载言灵集
function loadSpellBookItem() {
    const input: any = document.getElementById("bookItemInput");
    const result = input.value;
    if (result === null || result.trim() === "") {
        alert("加载言灵集数据失败！无法获取言灵集数据");
        return;
    }
    try {
        let spellBookItem: SpellbookItem = JSON.parse(result);
        if (checkSpellBookItemContent(spellBookItem)) {
            checkSpellBookItemExists(spellBookItem);
        }
    }
    catch (error) {
        alert("加载言灵集失败: " + error);
    }
}
window.loadSpellBookItem = loadSpellBookItem;

function checkSpellBookItemContent(spellBookItem: SpellbookItem): boolean {
    if (!spellBookItem.uuid) {
        alert("加载言灵集失败!请确认言灵集的uuid");
        return false;
    }
    if (!spellBookItem.name) {
        alert("加载言灵集失败!请确认言灵集的名称");
        return false;
    }
    if (!spellBookItem.content) {
        alert("加载言灵集失败!请确认言灵集的内容");
        return false;
    }
    return true;
}

async function checkSpellBookItemExists(spellBookItem: SpellbookItem) {
    try {
        if (spellBookItem.uuid === 'default') {
            chooseAddOrReplace_default(spellBookItem);
        }
        else if (V.spellBook[spellBookItem.uuid] && V.spellBook[spellBookItem.uuid].content !== null) {
            chooseAddOrReplace(spellBookItem);
        }
        // 情况三：新增言灵集（感觉并不需要确认弹窗）
        else {
            V.spellBook[spellBookItem.uuid] = spellBookItem;
            $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
            $(function () {
                spellBookTabClicked_normal("normal_" + spellBookItem.uuid);
            });
            window.modSweetAlert2Mod.fire('操作成功', '成功添加言灵集【' + spellBookItem.name + '】', 'success');
        }
    } catch (error) {
        console.error("处理言灵集时出错:", error);
    }
}

async function chooseAddOrReplace_default(spellBookItem: SpellbookItem) {
    const confirmResult = await window.modSweetAlert2Mod.fire({
        title: `检测到待加载言灵集【${spellBookItem.name}】原本为侧边栏言灵`,
        // 使用 HTML 自定义弹窗内容，添加 radio 按钮
        html: `
          <div>
            <p>是否仍加载该言灵集？如果选择覆盖，侧边栏中的言灵也会被同步覆盖</p>
            <label>
              <input type="radio" name="importMode" value="overwrite" checked> 覆盖当前存档中的【${spellBookItem.name}】
            </label><br>
            <label>
              <input type="radio" name="importMode" value="add"> 新增一个言灵集，命名为【${spellBookItem.name} (副本)】
            </label>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true,
        // 在 preConfirm 中获取选择的选项值
        preConfirm: () => {
            const input = document.querySelector('input[name="importMode"]:checked') as HTMLInputElement;
            const importMode = input.value;
            return { importMode }; // 返回一个包含选择结果的对象
        }
    });
    if (confirmResult.isConfirmed) {
        const importMode = confirmResult.value.importMode;
        if (importMode === 'overwrite') {
            // 执行覆盖操作
            console.log('执行覆盖操作');
            V.spellBook[spellBookItem.uuid].name = spellBookItem.name;
            V.cccheat = spellBookItem.content;
            V.spellBook[spellBookItem.uuid].content = V.cccheat;
            window.modSweetAlert2Mod.fire('操作成功', '成功更新言灵集【' + spellBookItem.name + '】', 'success');
        } else if (importMode === 'add') {
            // 执行新增操作
            spellBookItem.uuid = generateUUID();
            spellBookItem.name = spellBookItem.name + '(副本)';
            V.spellBook[spellBookItem.uuid] = spellBookItem;
            window.modSweetAlert2Mod.fire('操作成功', '成功添加言灵集【' + spellBookItem.name + '】', 'success');
        }
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $(function () {
            spellBookTabClicked_normal("normal_" + spellBookItem.uuid);
        });
    } else if (confirmResult.dismiss === Swal.DismissReason.cancel) {
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

async function chooseAddOrReplace(spellBookItem: SpellbookItem) {
    const confirmResult = await window.modSweetAlert2Mod.fire({
        title: `检测到待加载言灵集【${spellBookItem.name}】已在当前存档中存在`,
        // 使用 HTML 自定义弹窗内容，添加 radio 按钮
        html: `
          <div>
            <p>是否仍加载该言灵集？</p>
            <label>
              <input type="radio" name="importMode" value="overwrite" checked> 覆盖当前存档中的【${spellBookItem.name}】
            </label><br>
            <label>
              <input type="radio" name="importMode" value="add"> 新增一个言灵集，命名为【${spellBookItem.name} (副本)】
            </label>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true,
        // 在 preConfirm 中获取选择的选项值
        preConfirm: () => {
            const input = document.querySelector('input[name="importMode"]:checked') as HTMLInputElement;
            const importMode = input.value;
            return { importMode }; // 返回一个包含选择结果的对象
        }
    });
    if (confirmResult.isConfirmed) {
        const importMode = confirmResult.value.importMode;

        if (importMode === 'overwrite') {
            // 执行覆盖操作
            console.log('执行覆盖操作');
            V.spellBook[spellBookItem.uuid] = spellBookItem;
            window.modSweetAlert2Mod.fire('操作成功', '成功更新言灵集【' + spellBookItem.name + '】', 'success');
        } else if (importMode === 'add') {
            // 执行新增操作
            spellBookItem.uuid = generateUUID();
            spellBookItem.name = spellBookItem.name + '(副本)';
            V.spellBook[spellBookItem.uuid] = spellBookItem;
            window.modSweetAlert2Mod.fire('操作成功', '成功添加言灵集【' + spellBookItem.name + '】', 'success');
        }
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $(function () {
            spellBookTabClicked_normal("normal_" + spellBookItem.uuid);
        });
    } else if (confirmResult.dismiss === Swal.DismissReason.cancel) {
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

function mutableSpellBookItem() {
    // 先确认数据一致性
    T.content = V.spellBook[T.uuid].content;
    $.wiki("<<replace #spellBookItemList>><<mutableSpellBookItem>><</replace>>");
    $(function () {
        window.zoom(100);
        var el = document.getElementById('sortable-list');
        Sortable.create(el, {
            delay: 500, // 拖动长按0.5秒
            onEnd: handleSortEnd
        });
    });
}
window.mutableSpellBookItem = mutableSpellBookItem;

function immutableSpellBookItem() {
    $.wiki("<<replace #spellBookItemList>><<immutableSpellBookItem>><</replace>>");
    $(function () {
        window.zoom(V.options.zoom);
    });
}
window.immutableSpellBookItem = immutableSpellBookItem;

function handleSortEnd(evt) {
    let items: any = Array.from(evt.to.children);
    const prefix = "content_";
    let sortedIds = items.map(item => item.id.substring(prefix.length));
    console.log("获取到的sortedIds是：" + sortedIds);
    let tempContent = [];
    for (let dataId of sortedIds) {
        tempContent.push(T.content[dataId]);
    }
    // 以防万一
    if (tempContent.length != T.content.length) {
        alert("出现未知错误，排序结果保存失败！");
    }
    else {
        V.spellBook[T.uuid].content = tempContent;
        // 重新赋值时手动同步
        if (T.uuid === 'default') {
            V.cccheat = V.spellBook[T.uuid].content;
        }
    }
    // 重新渲染页面
    mutableSpellBookItem();
}

async function copyIdbSpellBookItem(spellbookItem: SpellbookItem) {
    let dialogTitle = "复制确认";
    let dialogContent = "是否确认复制言灵集【" + spellbookItem.name + "】到当前存档";
    if (spellbookItem.uuid === 'default') {
        dialogTitle = "覆盖确认";
        dialogContent = "检测到当前言灵集【" + spellbookItem.name + "】原本为侧边栏言灵集，复制操作将会导致言灵集【" + V.spellBook[spellbookItem.uuid].name + "】和侧边栏言灵一起被覆盖，是否继续？";
    }
    else if (V.spellBook[spellbookItem.uuid] && V.spellBook[spellbookItem.uuid].content !== null) {
        dialogTitle = "覆盖确认";
        dialogContent = "检测到当前言灵集【" + spellbookItem.name + "】已在当前存档存在，重新复制将会导致言灵集【" + V.spellBook[spellbookItem.uuid].name + "】被覆盖，是否继续？";
    }
    const confirmResult = await Swal.fire({
        title: dialogTitle,
        text: dialogContent,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (confirmResult.isConfirmed) {
        let copyItem = JSON.parse(JSON.stringify(spellbookItem));
        copyItem.name = copyItem.name + "（复制）";
        if (copyItem.uuid === 'default') {
            V.spellBook[copyItem.uuid].name = copyItem.name;
            V.cccheat = copyItem.content;
            V.spellBook[copyItem.uuid].content = V.cccheat;
        }
        else {
            V.spellBook[copyItem.uuid] = copyItem;
        }
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $(function () {
            spellBookTabClicked_normal("normal_" + copyItem.uuid);
        });
        Swal.fire('已复制', '当前言灵集已复制', 'success');
    }
}
window.copyIdbSpellBookItem = copyIdbSpellBookItem;


async function deleteIdbSpellBookItem(spellbookItem: SpellbookItem) {
    let dialogTitle = "删除确认";
    let dialogContent = "是否确认删除所有存档中的言灵集【" + spellbookItem.name + "】，注意此操作无法通过回档撤回";
    const confirmResult = await Swal.fire({
        title: dialogTitle,
        text: dialogContent,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (confirmResult.isConfirmed) {
        const db = new SpellbookDB();
        await db.deleteItem(spellbookItem.uuid);
        await getIdbSpellBookItems();
        Swal.fire('已删除', '当前言灵集已删除', 'success');
        // 只有删除是真的应该返回封面
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $.wiki("<<replace #customOverlayContent>><<spellBookOpen>><</replace>>");
    }
}
window.deleteIdbSpellBookItem = deleteIdbSpellBookItem;

async function deleteNormalSpellBookItem(spellbookItem: SpellbookItem) {
    let dialogTitle = "删除确认";
    let dialogContent = "是否确认删除言灵集【" + spellbookItem.name + "】，此操作可以通过回档撤回";
    const confirmResult = await Swal.fire({
        title: dialogTitle,
        text: dialogContent,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (confirmResult.isConfirmed) {
        delete V.spellBook[spellbookItem.uuid];
        Swal.fire('已删除', '当前言灵集已删除', 'success');
        // 只有删除是真的应该返回封面
        $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
        $.wiki("<<replace #customOverlayContent>><<spellBookOpen>><</replace>>");
    }
}
window.deleteNormalSpellBookItem = deleteNormalSpellBookItem;

// 重命名言灵集
function renameSpellBookItem() {
    const addContent = document.getElementById("renameItem") as HTMLDivElement;
    addContent.style.display = "block";
}
window.renameSpellBookItem = renameSpellBookItem;

function hideRenameItem() {
    const addContent = document.getElementById("renameItem") as HTMLDivElement;
    addContent.style.display = "none";
}
window.hideRenameItem = hideRenameItem;

function confirmRenameItem() {
    if (T.spellBookRenameTextbox.trim() === "") {
        alert("请输入修改后的言灵集名称！");
        return;
    }
    V.spellBook[T.uuid].name = T.spellBookRenameTextbox;
    const addContent = document.getElementById("renameItem") as HTMLDivElement;
    addContent.style.display = "none";
    window.modSweetAlert2Mod.fire('操作成功', '言灵集已被更名为【' + T.spellBookRenameTextbox + '】', 'success');
    $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
    $(function () {
        spellBookTabClicked_normal("normal_" + T.uuid);
    });
}
window.confirmRenameItem = confirmRenameItem;

function uploadSpellBookitem(file_input) {
    let file = file_input.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        const fileContent = e.target?.result as string;
        try {
            let spellBookItem: SpellbookItem = JSON.parse(fileContent);
            if (checkSpellBookItemContent(spellBookItem)) {
                checkSpellBookItemExists(spellBookItem);
            }
        } catch (error) {
            alert("加载言灵集失败: " + error);
        }
    };
    reader.readAsText(file);
}
window.uploadSpellBookItem = uploadSpellBookitem;

function createSpellBookItem(itemName: string) {
    if (itemName === null || itemName.trim() === "") {
        alert("请先输入言灵集名称！");
        return;
    }
    let uuid: string = generateUUID();
    let spellbookItem: SpellbookItem = {};
    spellbookItem.uuid = uuid;
    spellbookItem.content = [];
    spellbookItem.name = itemName;
    // 新增误点可能性/影响都不大，直接省略弹窗
    V.spellBook[spellbookItem.uuid] = spellbookItem;
    Swal.fire('已添加', '成功添加言灵集【' + itemName + '】', 'success');
    // 新增应该直接跳转到新增言灵集，而不是封面
    $.wiki("<<replace #customOverlayTitle>><<spellBookTitle>><</replace>>");
    $(function () {
        spellBookTabClicked_normal("normal_" + uuid);
    });
}
window.createSpellBookItem = createSpellBookItem;

function generateUUID(): string {
    // ... (your UUID generation function) ...
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function spellBookTabClicked_common(id) {
    console.log("点击公共标签页时获取到的id是" + id);
    const button = $('#' + id);
    if (button.length > 0) { // 检查 button 是否存在
        T.tab.toggle(button);
        const prefix = "common_";
        let uuid = id.substring(prefix.length);
        $.wiki("<<replace #customOverlayContent>><<spellBookItem_common " + uuid + ">><</replace>>")
    } else {
        alert("无法获取到当前标签页");
    }
}
window.spellBookTabClicked_common = spellBookTabClicked_common;

function spellBookTabClicked_normal(id) {
    console.log("点击公共标签页时获取到的id是" + id);
    const button = $('#' + id);
    if (button.length > 0) { // 检查 button 是否存在
        T.tab.toggle(button);
        const prefix = "normal_";
        let uuid = id.substring(prefix.length);
        // 侧边栏言灵集跳转到专属页面
        if (uuid === "default") {
            $.wiki("<<replace #customOverlayContent>><<spellBookItem_default " + uuid + ">><</replace>>")
        }
        else {
            $.wiki("<<replace #customOverlayContent>><<spellBookItem_normal " + uuid + ">><</replace>>")
        }
    } else {
        alert("无法获取到当前标签页");
    }
}
window.spellBookTabClicked_normal = spellBookTabClicked_normal;

// 查找言灵集，"all"表示在所有言灵集中查找
function searchSpellBookItem(searchString: string, searchId: string) {
    if (!searchString || searchString.trim() === "") {
        alert("请输入需要查询的言灵内容！");
        return;
    }
    let searchResult: any = [];
    if (searchId === "all") {
        searchResult = searchAll(searchString);
    }
    else if (searchId.startsWith("common_")) {
        const prefix = "common_";
        let uuid = searchId.substring(prefix.length);
        searchResult = searchCommon(searchString, uuid);
    }
    else if (searchId.startsWith("normal_")) {
        const prefix = "normal_";
        let uuid = searchId.substring(prefix.length);
        searchResult = searchNormal(searchString, uuid)
    }
    else {
        alert("查询出错，无法获取查询范围！");
        return;
    }
    handleSearchResults(searchResult, searchId);
}
window.searchSpellBookItem = searchSpellBookItem;

function handleSearchResults(searchResult: any, searchId: any) {
    const searchResultsContainer = document.getElementById('searchResults') as HTMLDivElement;
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.style.color = '';
    if (searchResult.length === 0) {
        searchResultsContainer.textContent = "无结果";
        searchResultsContainer.style.color = 'gold';
    }
    else {
        T.searchResults = searchResult;
        if (searchId === "all") {
            $.wiki("<<replace #searchResults>><<showSearchResults_all>><</replace>>");
        }
        else if (searchId.startsWith("common_")) {
            $.wiki("<<replace #searchResults>><<showSearchResults_common>><</replace>>");
        }
        else if (searchId.startsWith("normal_")) {
            $.wiki("<<replace #searchResults>><<showSearchResults_normal>><</replace>>");
        }
    }
}

function searchAll(searchString: string) {
    let searchResult = [];
    for (const key in T.spellBookCommon) {
        searchResult = searchResult.concat(searchCommon(searchString, key));
    }
    for (const key in V.spellBook) {
        searchResult = searchResult.concat(searchNormal(searchString, key));
    }
    console.log("searchAll_Result是" + JSON.stringify(searchResult));
    return searchResult;
}

function searchCommon(searchString: string, uuid: string) {
    let searchResult = [];
    const item = T.spellBookCommon[uuid];
    for (const contentString of item.content) {
        if (contentString.includes(searchString)) {
            let result: any = {}
            result.content = contentString;
            result.itemName = item.name;
            result.itemId = item.uuid;
            result.source = "common";
            searchResult.push(result);
        }
    }
    console.log("searchCommon_Result是" + JSON.stringify(searchResult));
    return searchResult;
}

function searchNormal(searchString: string, uuid: string) {
    let searchResult = [];
    const item = V.spellBook[uuid];
    for (const contentString of item.content) {
        if (contentString.includes(searchString)) {
            let result: any = {}
            result.content = contentString;
            result.itemName = item.name;
            result.itemId = item.uuid;
            result.source = "normal";
            searchResult.push(result);
        }
    }
    console.log("searchNormal_Result是" + JSON.stringify(searchResult));
    return searchResult;
}

function clearSpellBookItemSearchResult() {
    const searchResultsContainer = document.getElementById('searchResults') as HTMLDivElement;
    const textbox = document.getElementById('textbox--spellbooksearchtextbox') as HTMLInputElement;
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.style.color = '';
    textbox.value = "";
    // 理论上清空只需要界面不展示就行，以防万一数据也重置下
    T.searchResults = [];
    T.spellBookSearchTextbox = "";
}
window.clearSpellBookItemSearchResult = clearSpellBookItemSearchResult;

function jumpToResultFromCover_common(id: string, searchResult: string) {
    console.log("common_跳转搜索结果时的id是：" + id + "，result是：" + searchResult);
    spellBookTabClicked_common(id);
    $(function () {
        jumpToResult_common(searchResult);
    });
}
window.jumpToResultFromCover_common = jumpToResultFromCover_common;

function jumpToResultFromCover_normal(id: string, searchResult: string, option: string) {
    console.log("normal_跳转搜索结果时的id是：" + id + "，result是：" + searchResult);
    spellBookTabClicked_normal(id);
    $(function () {
        jumpToResult_normal(searchResult, option);
    });
}
window.jumpToResultFromCover_normal = jumpToResultFromCover_normal;

function jumpToResult_common(searchResult: string) {
    console.log("点击查看时，searchResult是" + searchResult);
    // const content = T.spellBookCommon[T.uuid].content;
    const content = T.content;
    if (!content) {
        alert("查询结果跳转出错！无法获取对应言灵集");
        return;
    }
    const index = content.indexOf(searchResult);
    if (index === -1) {
        alert("查询结果跳转出错！无法获取指定言灵");
        return;
    }
    const element = document.getElementById("content_" + index);
    if (!element) {
        alert("查询结果跳转出错！无法定位到指定言灵");
        return;
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    spellBookItemShowView("showViewIcon_" + index);
}

window.jumpToResult_common = jumpToResult_common;

function jumpToResult_normal(searchResult: string, option: string) {
    console.log("点击查看时，searchResult是" + searchResult);
    const content = T.content;
    if (!content) {
        alert("查询结果跳转出错！无法获取对应言灵集");
        return;
    }
    const index = content.indexOf(searchResult);
    if (index === -1) {
        alert("查询结果跳转出错！无法获取指定言灵");
        return;
    }
    if (option === "showView") {
        immutableSpellBookItem();
    }
    else {
        mutableSpellBookItem();
    }
    $(function () {
        const element = document.getElementById("content_" + index);
        if (!element) {
            alert("查询结果跳转出错！无法定位到指定言灵");
            return;
        }
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (option === "showView") {
            let viewMode = document.getElementById('view-mode') as HTMLInputElement;
            viewMode.checked = true;
            spellBookItemShowView("showViewIcon_" + index);
        }
        else {
            let editMode = document.getElementById('edit-mode') as HTMLInputElement;
            editMode.checked = true;
            spellBookItemEdit("editIcon_" + index);
        }
    });
}
window.jumpToResult_normal = jumpToResult_normal;

function spellBookItemShowView(id: string) {
    const prefix = "showViewIcon_";
    const index = id.substring(prefix.length);
    const showContent = document.getElementById("showContent_" + index) as HTMLDivElement;
    const contentTextArea = document.getElementById("contentTextArea_" + index) as HTMLTextAreaElement;
    if (!showContent || !contentTextArea) {
        alert("言灵内容展示出错！无法定位到文本框");
        return;
    }
    const value = T.content[index];
    showContent.style.display = "block";
    contentTextArea.value = value;
    contentTextArea.disabled = true;
}
window.spellBookItemShowView = spellBookItemShowView;


function spellBookItemEdit(id: string) {
    const prefix = "editIcon_";
    const index = id.substring(prefix.length);
    const showContent = document.getElementById("showContent_" + index) as HTMLDivElement;
    const contentTextArea = document.getElementById("contentTextArea_" + index) as HTMLTextAreaElement;
    if (!showContent || !contentTextArea) {
        alert("言灵内容展示出错！无法定位到文本框");
        return;
    }
    const value = T.content[index];
    showContent.style.display = "block";
    contentTextArea.value = value;
    contentTextArea.disabled = false;
}
window.spellBookItemEdit = spellBookItemEdit;

async function spellBookItemDelete(id: string) {
    const prefix = "deleteIcon_";
    // 删除还是应该好好提醒的
    const index = id.substring(prefix.length);
    const i = parseInt(index) + 1;
    const result = await Swal.fire({
        title: '操作确认',
        text: '是否确认删除言灵集【' + T.name + '】中的第【' + i + '】条言灵？该操作可通过回档来撤回。',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        V.spellBook[T.uuid].content.splice(parseInt(index), 1);
        window.modSweetAlert2Mod.fire('操作成功', '言灵删除成功', 'success');
        // 重新渲染列表
        mutableSpellBookItem();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}
window.spellBookItemDelete = spellBookItemDelete;

async function spellBookItemDeleteAll() {
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedItems.push(checkbox.id.replace('checkbox_', ''));
        }
    });
    if (selectedItems.length === 0) {
        alert("请先选中需要删除的言灵！");
        return;
    }
    const numbers = selectedItems.map(Number).map(n => n + 1);
    const formattedNumbers = numbers.join(', ');
    console.log("当前选中的selectedItems是：" + selectedItems);
    const result = await Swal.fire({
        title: '操作确认',
        text: '是否确认删除言灵集【' + T.name + '】中的第【' + formattedNumbers + '】条言灵？该操作可通过回档来撤回。',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        V.spellBook[T.uuid].content = V.spellBook[T.uuid].content.filter((element, index) =>
            !selectedItems.includes(index.toString()));
        // 注意这里有重新赋值，所以需要手动同步一下
        if (T.uuid === 'default') {
            V.cccheat = V.spellBook[T.uuid].content;
        }
        window.modSweetAlert2Mod.fire('操作成功', '指定言灵删除成功', 'success');
        // 重新渲染列表
        mutableSpellBookItem();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}
window.spellBookItemDeleteAll = spellBookItemDeleteAll;

// 在本存档言灵集中添加言灵
function spellBookItemAddContent() {
    const addContent = document.getElementById("addContent") as HTMLDivElement;
    addContent.style.display = "block";
}
window.spellBookItemAddContent = spellBookItemAddContent;

function hideAddContent() {
    const addContent = document.getElementById("addContent") as HTMLDivElement;
    addContent.style.display = "none";
}
window.hideAddContent = hideAddContent;

function confirmAddContent(option: string) {
    const contentTextArea = document.getElementById("addContentTextArea") as HTMLTextAreaElement;
    if (!contentTextArea) {
        alert("操作出错！无法定位到文本框");
        return;
    }
    if (contentTextArea.value.trim() === "") {
        alert("请输入需要添加的言灵内容！");
        return;
    }
    if (option === "top") {
        V.spellBook[T.uuid].content.unshift(contentTextArea.value);
    }
    else {
        V.spellBook[T.uuid].content.push(contentTextArea.value);
    }
    // 重新渲染列表
    mutableSpellBookItem();
}
window.confirmAddContent = confirmAddContent;


function hideTextArea(id: string) {
    const prefix = "hideTextArea_";
    const index = id.substring(prefix.length);
    const showContent = document.getElementById("showContent_" + index) as HTMLDivElement;
    if (!showContent) {
        alert("收起文本框出错！无法定位到文本框");
        return;
    }

    showContent.style.display = "none";
}
window.hideTextArea = hideTextArea;

function saveTextArea(id: string) {
    const prefix = "saveTextArea_";
    const index = id.substring(prefix.length);
    const showContent = document.getElementById("showContent_" + index) as HTMLDivElement;
    const contentTextArea = document.getElementById("contentTextArea_" + index) as HTMLTextAreaElement;
    if (!showContent || !contentTextArea) {
        alert("保存出错！无法定位到文本框");
        return;
    }
    if (contentTextArea.value.trim() === "") {
        alert("请输入需要修改的内容！");
        return;
    }
    // 编辑单条误点可能性较低，就不展示确认框了
    // 编辑功能必然在本存档使用，不做区分
    V.spellBook[T.uuid].content[index] = contentTextArea.value;
    showContent.style.display = "none";
    const i = parseInt(index) + 1;
    window.modSweetAlert2Mod.fire('操作成功', '言灵集【' + T.name + '】中的第【' + i + '】条数据修改成功', 'success');
    //重新渲染列表
    mutableSpellBookItem();
}
window.saveTextArea = saveTextArea;

async function dealWithCccheat(option: string) {
    let optionDic = {
        "addToTop": "将此言灵集添加到侧边栏（开头）",
        "addToEnd": "将此言灵集添加到侧边栏（末尾）",
        "replace": "直接用此言灵集替换侧边栏",
        "remove": "从侧边栏移除此言灵集"
    }
    const result = await Swal.fire({
        title: '操作确认',
        text: '是否确认对言灵集【' + T.name + '】执行操作【' + optionDic[option] + '】？该操作可通过回档来撤回。',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        // 用户点击了确认按钮
        switch (option) {
            case "addToTop":
                V.cccheat.splice(0, 0, ...T.content);
                V.cccheat_name.splice(0, 0, ...T.content)
                break;
            case "addToEnd":
                V.cccheat.push(...T.content);
                V.cccheat_name.push(...T.content);
                break;
            case "replace":
                V.cccheat = T.content;
                V.cccheat_name = T.content;
                // cccheat重新赋值时，default需要重新指向cccheat
                V.spellBook['default'].content = V.cccheat;
                break;
            case "remove":
                V.cccheat = V.cccheat.filter(item => !T.content.includes(item));
                V.cccheat_name = V.cccheat_name.filter(item => !T.content.includes(item));
                V.spellBook['default'].content = V.cccheat;
                break;
            default:
                alert("执行操作失败，操作未定义！");
        }
        window.modSweetAlert2Mod.fire('操作成功', '在游戏内进行段落跳转（点击任意选项）后即可看到更新后的侧边栏', 'success');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}
window.dealWithCccheat = dealWithCccheat;

// 在标题里添加功能： 跳转到言灵列表
function jumpToSpellBookItemList() {
    let spellBookItemList = document.getElementById("spellBookItemList");
    if (!spellBookItemList) {
        alert("跳转出错！无法定位到言灵列表");
        return;
    }
    spellBookItemList.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.jumpToSpellBookItemList = jumpToSpellBookItemList;
