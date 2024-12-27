import { SpellbookDB } from './SpellbookDB';
import { saveAs } from 'file-saver';
import { Sortable } from 'sortablejs';

$(document).on(":oncloseoverlay", () => {
    if (V.spellBookOpening) {
        V.spellBookOpening = false;
        let bookIcon: HTMLElement | null = document.querySelector(".SpellBookMobile");
        if (bookIcon) {
            bookIcon.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNDNzlGRUYiIGQ9Ik0xMS42IDkuNTI3YS42OC42OCAwIDAgMS0uNTEuMzcxbC0xLjQ1NC4yMTJsMS4wNTIgMS4wMjVhLjY4LjY4IDAgMCAxIC4xOTUuNmwtLjI0OSAxLjQ0OGwxLjMtLjY4NGEuNjguNjggMCAwIDEgLjYzMiAwbDEuMy42ODRsLS4yNDktMS40NDhhLjY4LjY4IDAgMCAxIC4xOTUtLjZsMS4wNTItMS4wMjVsLTEuNDUzLS4yMTJhLjY4LjY4IDAgMCAxLS41MS0uMzdMMTIuMjUgOC4yMXpNNCA0LjVBMi41IDIuNSAwIDAgMSA2LjUgMkgxOGEyLjUgMi41IDAgMCAxIDIuNSAyLjV2MTQuMjVhLjc1Ljc1IDAgMCAxLS43NS43NUg1LjVhMSAxIDAgMCAwIDEgMWgxMy4yNWEuNzUuNzUgMCAwIDEgMCAxLjVINi41QTIuNSAyLjUgMCAwIDEgNCAxOS41em02LjU0MiA0LjEwOGwtMi40Ni4zNTdhLjY3OC42NzggMCAwIDAtLjM3NyAxLjE1N2wxLjc4IDEuNzM1bC0uNDIgMi40NWEuNjc4LjY3OCAwIDAgMCAuOTg0LjcxNmwyLjIwMS0xLjE1N2wyLjIgMS4xNTdhLjY3OC42NzggMCAwIDAgLjk4NS0uNzE1bC0uNDItMi40NWwxLjc4LTEuNzM2YS42NzguNjc4IDAgMCAwLS4zNzYtMS4xNTdsLTIuNDYtLjM1N2wtMS4xLTIuMjNhLjY3OC42NzggMCAwIDAtMS4yMTcgMHoiLz48L3N2Zz4=')";
        }
    }
    if (!Renderer.lastModel) return;
    Renderer.refresh(Renderer.lastModel);
});

async function spellBookMobileClicked() {
    V.spellBookOpening = true;
    await initSpellBook();
    await getIdbSpellBookItems();
    $.wiki("<<overlayReplace \"spellBookOpen\">>");
    $(function () {
        let bookIcon: HTMLElement | null = document.querySelector(".SpellBookMobile");
        if (bookIcon) {
            // 之后应该会改的，别吐槽
            bookIcon.style.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGw9IiNDNzlGRUYiIGQ9Ik0xNSA0LjdWNGE2LjggNi44IDAgMCAwLTQuNDg0LTEuOTk5YTIuODQgMi44NCAwIDAgMC0yLjUxMy45OTVhMy4wMiAzLjAyIDAgMCAwLTIuNTE1LS45OTVBNi44IDYuOCAwIDAgMCAxIDR2LjdMMCA1djEwbDYuNy0xLjRsLjMuNGgybC4zLS40TDE2IDE1VjV6bS05LjUyIDYuNjFhOC4yIDguMiAwIDAgMC0zLjUyNi45MDJMMiA0LjQyQTUuMjIgNS4yMiAwIDAgMSA1LjM2OSAzYTQuNTUgNC41NSAwIDAgMSAyLjE1OS43MDFsLS4wMTkgNy44NjlhNi42IDYuNiAwIDAgMC0yLjAzOS0uMjU5em04LjUyLjg4YTguMSA4LjEgMCAwIDAtMy40NjgtLjg4bC0uMTYxLS4wMDJjLS42NiAwLTEuMjk3LjA5Ni0xLjg5OS4yNzRsLjA0Ny03LjkwMmE0LjUgNC41IDAgMCAxIDIuMDk2LS42NzlhNS4yMiA1LjIyIDAgMCAxIDMuMzg2IDEuNDIybC0uMDAzIDcuNzY4eiIvPjwvc3ZnPg==')";
        }
    });
}
window.spellBookMobileClicked = spellBookMobileClicked;

async function initSpellBook() {
    if (!V.spellBook) {
        V.spellBook = {};
    }
    if (!V.spellBook.default) {
        await initDefaultSpellBook();
    }
}

async function saveDataToIndexDB(spellbookItem: SpellbookItem) {
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
window.saveDataToIndexDB = saveDataToIndexDB;

async function confirmItemUpdate(spellbookItem: SpellbookItem, db: SpellbookDB) {
    const result = await window.modSweetAlert2Mod.fire({
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
        V.spellBook[updatedItem.uuid] = updatedItem;
        window.modSweetAlert2Mod.fire('已更新', '当前言灵集已更新', 'success');
    } catch (error) {
        const errorMsg = JSON.stringify(error);
        window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
    }
}

async function confirmItemSave(spellbookItem: SpellbookItem, db: SpellbookDB) {
    const result = await window.modSweetAlert2Mod.fire({
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
        V.spellBook[addedItem.uuid] = addedItem;
        window.modSweetAlert2Mod.fire('已保存', '当前言灵集已被保存', 'success');
    } catch (error) {
        const errorMsg = JSON.stringify(error);
        window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
    }
}

async function initDefaultSpellBook() {
    return new Promise<void>(async (resolve) => { // 使用 Promise 包裹，确保异步操作完成
        const db = new SpellbookDB();
        V.spellBook["default"] = { name: "默认言灵集", uuid: "default", content: [] };
        console.log("默认言灵集初始化开始");

        const result = await db.getItem(V.spellBook["default"].uuid);

        if (result && result.content !== null) {
            V.spellBook["default"].content = result.content;
            console.log("默认言灵集初始化来源为idb");
        } else if (V.cccheat && V.cccheat.length > 0) {
            V.spellBook["default"].content = V.cccheat;
            console.log("默认言灵集初始化来源为cccheat");
        }
        resolve(); // 在所有异步操作完成后 resolve Promise
    });
}

// 获取idb存档内的言灵集，如果存在则直接覆盖
async function getIdbSpellBookItems() {
    const db = new SpellbookDB();
    const idbData: SpellbookItem[] = await db.getAllData();
    console.log("从indexDB获取到的数据是" + JSON.stringify(idbData));
    for (let idbItem of idbData) {
        V.spellBook[idbItem.uuid] = idbItem;
    }
}
window.getIdbSpellBookItems = getIdbSpellBookItems;

// justTest
async function myIndexDBTest() {
    // 预留一下
}
window.myIndexDBTest = myIndexDBTest;

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
    if (result === null) {
        alert("加载言灵集数据失败！无法获取言灵集");
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
        const db = new SpellbookDB();
        const result = await db.getItem(spellBookItem.uuid);
        // 情况一：当前言灵集存在于indexDB中
        if (result && result.content !== null) {
            const confirmResult = await window.modSweetAlert2Mod.fire({
                title: '检测到待加载言灵集【' + spellBookItem.name + '】已在**所有**存档中存在',
                text: '是否仍加载该言灵集？该操作将会覆盖**所有**存档中的【' + spellBookItem.name + '】',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                reverseButtons: true
            });
            if (confirmResult.isConfirmed) {
                doItemUpdate(spellBookItem, db);
            } else if (confirmResult.dismiss === Swal.DismissReason.cancel) {
                // 处理取消逻辑 (可选)
                window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
            }
        }
        // 情况二：当前言灵集存在于存档中
        else if (V.spellBook[spellBookItem.uuid] && V.spellBook[spellBookItem.uuid].content != null) {
            const confirmResult = await window.modSweetAlert2Mod.fire({
                title: '检测到待加载言灵集【' + spellBookItem.name + '】已在当前存档中存在',
                text: '是否仍加载该言灵集？该操作将会覆盖当前存档中的【' + spellBookItem.name + '】',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                reverseButtons: true
            });
            if (confirmResult.isConfirmed) {
                V.spellBook[spellBookItem.uuid] = spellBookItem;
                window.modSweetAlert2Mod.fire('已更新', '当前言灵集已更新', 'success');
            } else if (confirmResult.dismiss === Swal.DismissReason.cancel) {
                window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
            }
        }
        // 情况三：新增言灵集（感觉并不需要确认弹窗）
        else {
            V.spellBook[spellBookItem.uuid] = spellBookItem;
            window.modSweetAlert2Mod.fire('加载成功', '成功添加言灵集【' + spellBookItem.name + '】', 'success');
        }
    } catch (error) {
        console.error("处理言灵集时出错:", error);
    }
}

function mutableSpellBookItem() {
    $.wiki("<<replace #spellBookItemList>><<mutableSpellBookItem>><</replace>>");
    $(function () {
        window.zoom(100);
        var el = document.getElementById('sortable-list');
        if (SugarCube.Browser.isMobile.any()) {
            Sortable.create(el, {
                delay: 500, // 移动端需长按0.5秒
                onEnd: handleSortEnd
            });
        } else {
            Sortable.create(el, {
                onEnd: handleSortEnd
            });
        }
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
    let sortedIds = items.map(item => item.id);
    console.log("获取到的sortedIds是：" + sortedIds);
    let tempContent = [];
    for (let dataId of sortedIds) {
        tempContent.push(T.content[dataId]);
    }
    T.content = tempContent;
    // 重新渲染页面
    mutableSpellBookItem();
}

function spellBookItemDeleteClicked(element) {
    let index = element.parentNode.querySelector('.SpellBookItemIndex').textContent;
    console.log("获取的index是" + index);
    T.content.splice(parseInt(index), 1);
    // 删除后重新渲染页面
    mutableSpellBookItem();
}
window.spellBookItemDeleteClicked = spellBookItemDeleteClicked;