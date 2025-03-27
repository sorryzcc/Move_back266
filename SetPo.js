const XLSX = require('xlsx');
const fs = require('fs');

const mainlandpath = './filtered_mainland_textApplicationForm2_250321.xlsx';

// 读取 Excel 文件
function readExcel(filePath, fileName) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet).map(item => ({ ...item, "来源": fileName }));
}

const mainlandData = readExcel(mainlandpath, "mainlandpath");

const po = (mainlandData.map(item => item["266新增一列"]));

const uniquePo = [...new Set (po)]

// 将 uniquePo 写入文件
function writeToFile(data, filePath) {
    try {
        // 将数组转换为字符串，每行一个元素
        const fileContent = data.join('\n');
        fs.writeFileSync(filePath, fileContent, 'utf-8');
        console.log(`已成功将数据写入文件：${filePath}`);
    } catch (error) {
        console.error("写入文件时出错：", error.message);
    }
}

// 写入 uniquePo 到文件
writeToFile(uniquePo, 'uniquePo.txt');



