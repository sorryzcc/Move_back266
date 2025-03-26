const xlsx = require("xlsx");
const path = require("path");

// 表格路径
const Mappath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本关卡配置表@MapTranslationConfiguration.xlsx`;
const Totalpath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本配置表@TotalTranslationConfiguration.xlsx`;
const Systempath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本系统配置表@SystemTranslationConfiguration.xlsx`;
const Opspath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx`;
const Battlepath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx`;

// 读取表格并提取负责人信息的函数
function getOwnerFromExcel(filePath) {
  // 读取 Excel 文件
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // 默认读取第一个工作表
  const worksheet = workbook.Sheets[sheetName];

  // 将工作表转换为 JSON 格式
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // 假设负责人的信息在 "负责人" 列后面
  for (const row of data) {
    if (row.includes("负责人")) {
      const ownerIndex = row.indexOf("负责人") + 1; // 负责人后面的值
      return row[ownerIndex]; // 返回负责人名字
    }
  }

  return null; // 如果没有找到负责人信息，返回 null
}

// 主函数：生成表格与负责人的映射关系
async function generateOwnerMapping() {
  const paths = [
    { name: "Map", path: Mappath },
    { name: "Total", path: Totalpath },
    { name: "System", path: Systempath },
    { name: "Ops", path: Opspath },
    { name: "Battle", path: Battlepath },
  ];

  const ownerMapping = {};

  for (const { name, path } of paths) {
    const owner = getOwnerFromExcel(path);
    if (owner) {
      ownerMapping[name] = owner.split(",").map((o) => o.trim()); // 处理多个负责人
    } else {
      console.warn(`未找到 ${name} 的负责人信息`);
    }
  }

  console.log("表格与负责人的映射关系：", ownerMapping);
  return ownerMapping;
}

// 执行主函数
generateOwnerMapping();