import { SpellbookDB } from './SpellbookDB';
import Sortable from 'sortablejs'
console.log('Sortable导入成功' + Sortable);

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

function spellBookMobileClicked(): void {
    V.spellBookOpening = true;
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


async function saveDataToIndexDB(spellbookItem: SpellbookItem) {
    const db = new SpellbookDB();
    console.log("需要保存的值是：" + spellbookItem.name + "需要保存的内容是：" + spellbookItem.content + "需要保存的uuid：" + spellbookItem.uuid);
    let isUpdate = false;
    if (spellbookItem.uuid) {
        const result = await db.getItem(spellbookItem.uuid);
        if (result && result.content !== null) {
            isUpdate = true;
            doItemUpdate(spellbookItem, db);
        }
    }
    if (!isUpdate) {
        doItemSave(spellbookItem, db);
    }
}
window.saveDataToIndexDB = saveDataToIndexDB;

async function doItemUpdate(spellbookItem: SpellbookItem, db: SpellbookDB) {
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
        try {
            const updatedItem = await db.updateItem(spellbookItem);
            console.log("更新成功，获取的updatedItem是" + JSON.stringify(updatedItem));
            V.spellBook[updatedItem.uuid] = updatedItem;
            window.modSweetAlert2Mod.fire('已更新', '当前言灵集已更新', 'success');
        } catch (error) {
            const errorMsg = JSON.stringify(error);
            window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
        }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

async function doItemSave(spellbookItem: SpellbookItem, db: SpellbookDB) {
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
        try {
            const addedItem = await db.addItem(spellbookItem);
            console.log("添加成功，获取的addedItem是" + JSON.stringify(addedItem));
            V.spellBook[addedItem.uuid] = addedItem;
            window.modSweetAlert2Mod.fire('已保存', '当前言灵集已被保存', 'success');
        } catch (error) {
            const errorMsg = JSON.stringify(error);
            window.modSweetAlert2Mod.fire('发生错误，请联系作者解决该问题', errorMsg, 'error');
        }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户点击了取消按钮
        window.modSweetAlert2Mod.fire('已取消', '操作被取消', 'info');
    }
}

function initDefaultSpellBook(): void {
    const db = new SpellbookDB();
    V.spellBook["default"] = { name: "默认言灵集", uuid: "dafault", content: [] };
    console.log("默认言灵集初始化开始");
    db.getItem(V.spellBook["default"].uuid).then((result) => {
        if (result && result.content !== null) {
            V.spellBook["default"].content = result.content;
            console.log("默认言灵集初始化来源为idb");
        }
        else if (V.cccheat && V.cccheat.length > 0) {
            V.spellBook["default"].content = V.cccheat;
            console.log("默认言灵集初始化来源为cccheat");
        }
    });
}
window.initDefaultSpellBook = initDefaultSpellBook;

// justTest
async function myIndexDBTest() {
    // 预留一下
}
window.myIndexDBTest = myIndexDBTest;
