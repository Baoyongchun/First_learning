// 动态合并单元格
// 表格ID，表格列数
function uniteTable(tableId, colLength) {
    const tb = document.getElementById(tableId);
    tb.style.display = '';
    let i = 0;
    let j = 0;
    // 行数
    const rowCount = tb.rows.length;
    // 列数
    let colCount = tb.rows[0].cells.length;
    let obj1 = null;
    let obj2 = null;
    // 为每个单元格命名
    for (i = 0; i < rowCount; i++) {
        for (j = 0; j < colCount; j++) {
            tb.rows[i].cells[j].id = `tb__${i.toString()}_${j.toString()}`;
        }
    }
    // 合并行
    for (i = 0; i < colCount; i++) {
        if (i === colLength) {
            break;
        }
        obj1 = document.getElementById(`tb__0_${i.toString()}`);
        for (j = 1; j < rowCount; j++) {
            obj2 = document.getElementById(`tb__${j.toString()}_${i.toString()}`);
            if (obj1.innerText === obj2.innerText && ((obj2.innerText !== '' || obj1.innerText !== '') &&
                (obj1.innerText !== '-' || obj2.innerText !== '-'))) {
                obj1.rowSpan++;
                obj2.parentNode.removeChild(obj2);
            } else {
                obj1 = document.getElementById(`tb__${j.toString()}_${i.toString()}`);
            }
        }
    }
    // 合并列
    for (i = 0; i < rowCount; i++) {
        colCount = tb.rows[i].cells.length;
        obj1 = document.getElementById(tb.rows[i].cells[0].id);
        for (j = 1; j < colCount; j++) {
            if (j >= colLength) {
                break;
            }
            if (obj1.colSpan >= colLength) {
                break;
            }
            obj2 = document.getElementById(tb.rows[i].cells[j].id);
            if (obj1.innerText === obj2.innerText && ((obj2.innerText !== '' || obj1.innerText !== '') &&
                (obj1.innerText !== '-' || obj2.innerText !== '-'))) {
                obj1.colSpan++;
                obj2.parentNode.removeChild(obj2);
                j = j - 1;
            } else {
                obj1 = obj2;
                j = j + obj1.rowSpan;
            }
        }
    }
}

uniteTable('jsTable', 6);
