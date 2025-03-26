const fs = require("fs");

// 假设已经生成了表格与负责人的映射关系，并存储在文件中
const filePath = "表格与负责人的映射关系.txt";

// 读取映射关系
function readMappingFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// 提取 1 对 1 的映射关系
function extractOneToOneMapping(mapping) {
  // 统计每个负责人出现的次数
  const ownerCount = {};

  // 遍历所有表格和负责人，统计每个负责人出现的次数
  for (const [table, owners] of Object.entries(mapping)) {
    for (const owner of owners) {
      ownerCount[owner] = (ownerCount[owner] || 0) + 1;
    }
  }

  // 构建 1 对 1 的映射关系
  const oneToOneMapping = {};

  for (const [table, owners] of Object.entries(mapping)) {
    const uniqueOwners = owners.filter((owner) => ownerCount[owner] === 1); // 只保留出现一次的负责人
    oneToOneMapping[table] = uniqueOwners;
  }

  return oneToOneMapping;
}

// 主函数
function main() {
  // 读取表格与负责人的映射关系
  const mapping = readMappingFromFile(filePath);

  // 提取 1 对 1 的映射关系
  const oneToOneMapping = extractOneToOneMapping(mapping);

  // 输出结果
  console.log("1 对 1 的映射关系：", oneToOneMapping);

  // 将结果写入文件（可选）
  fs.writeFileSync("1对1映射关系.txt", JSON.stringify(oneToOneMapping, null, 2), "utf-8");
}

// 执行主函数
main();