import pandas as pd
import json

# 读取 Excel 文件
def read_excel(file_path):
    return pd.read_excel(file_path)

# 写入 Excel 文件
def write_excel(data, file_path):
    data.to_excel(file_path, index=False)

# 读取 1 对 1 映射关系文件
def read_mapping(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 主函数
def main():
    # 读取 Excel 数据
    excel_file_path = './filtered_mainland_textApplicationForm2_250321.xlsx'
    excel_data = read_excel(excel_file_path)

    # 读取 1 对 1 映射关系
    mapping_file_path = './1对1映射关系.txt'
    mapping = read_mapping(mapping_file_path)

    # 构建负责人到表格的映射
    owner_to_table_map = {}
    for table, owners in mapping.items():
        for owner in owners:
            owner_to_table_map[owner] = table  # 负责人 => 表格

    # 给 Excel 新增一列 "266表名"
    excel_data['266表名'] = excel_data['266新增一列'].apply(
        lambda owner: owner_to_table_map.get(owner, "")  # 如果找不到对应关系，默认为空字符串
    )

    # 将修改后的数据写回 Excel 文件
    output_file_path = './add_266_name_column.xlsx'
    write_excel(excel_data, output_file_path)

    print(f"已成功将新增列 '266表名' 的数据写入文件：{output_file_path}")

# 执行主函数
if __name__ == "__main__":
    main()