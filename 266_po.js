const xlsx = require("xlsx");
const path = require("path");

// 表格路径
const Mappath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本关卡配置表@MapTranslationConfiguration.xlsx`;
const Totalpath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本配置表@TotalTranslationConfiguration.xlsx`;
const Systempath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本系统配置表@SystemTranslationConfiguration.xlsx`;
const Opspath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx`;
const Battlepath = `D:/PM_Mainland_Trunk_20230321_r552586/PMGameClient/Tables/ResXlsx/266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx`;

// 读取表格并提取 ToolRemark 中的所有负责人信息
function getOwnerFromExcel(filePath) {
  // 读取 Excel 文件
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // 默认读取第一个工作表
  const worksheet = workbook.Sheets[sheetName];

  // 将工作表转换为 JSON 格式
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // 找到 ToolRemark 列的索引
  let toolRemarkIndex = -1;
  if (data.length > 0) {
    toolRemarkIndex = data[0].indexOf("ToolRemark"); // 假设第一行是表头
  }

  if (toolRemarkIndex === -1) {
    console.warn(`未找到 ToolRemark 列`);
    return null;
  }

  // 存储所有负责人信息
  const allOwners = new Set(); // 使用 Set 避免重复

  // 遍历数据，找到 ToolRemark 列中的值
  for (let i = 1; i < data.length; i++) {
    let toolRemarkValue = data[i][toolRemarkIndex];
    // 确保 toolRemarkValue 是字符串类型
    toolRemarkValue = typeof toolRemarkValue === "string" ? toolRemarkValue : "";

    if (toolRemarkValue.includes("负责人")) {
      // 提取负责人信息（支持多个负责人）
      const ownerMatches = toolRemarkValue.matchAll(/负责人[:：]\s*([\w,]+)/g);
      for (const match of ownerMatches) {
        const owners = match[1].split(",").map((o) => o.trim());
        owners.forEach((owner) => allOwners.add(owner)); // 添加到 Set 中
      }
    }
  }

  return allOwners.size > 0 ? Array.from(allOwners) : null; // 返回所有负责人列表
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
      ownerMapping[name] = owner; // 存储负责人信息
    } else {
      console.warn(`未找到 ${name} 的负责人信息`);
    }
  }

  console.log("表格与负责人的映射关系：", ownerMapping);
  return ownerMapping;
}

// 执行主函数
generateOwnerMapping();