const XLSX = require('xlsx');
const fs = require('fs');

// 读取 Excel 文件
function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

// 写入 Excel 文件
function writeExcel(data, filePath, sheetName = "Sheet1") {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);
}

// 读取 1 对 1 映射关系文件
function readMapping(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
}

// 主函数
function main() {
    // 读取 Excel 数据
    const excelFilePath = './filtered_mainland_textApplicationForm2_250321.xlsx';
    let excelData = readExcel(excelFilePath);

    // 读取 1 对 1 映射关系
    const mappingFilePath = './1对1映射关系.txt';
    const mapping = readMapping(mappingFilePath);

    // 构建负责人到表格的映射
    const ownerToTableMap = {};
    for (const [table, owners] of Object.entries(mapping)) {
        for (const owner of owners) {
            ownerToTableMap[owner] = table; // 负责人 => 表格
        }
    }

    // 给 Excel 新增一列 "266表名"
    excelData = excelData.map(row => {
        const owner = row["266新增一列"];
        const tableName = ownerToTableMap[owner] || ""; // 如果找不到对应关系，默认为空字符串
        return { ...row, "266表名": tableName }; // 新增一列
    });

    // 将修改后的数据写回 Excel 文件
    const outputFilePath = './add_266_name_column.xlsx';
    writeExcel(excelData, outputFilePath);

    console.log(`已成功将新增列 "266表名" 的数据写入文件：${outputFilePath}`);
}

// 执行主函数
main();