# Tag功能使用说明

## 功能概述

已完成的Tag管理功能：

### 1. 添加Tag到Ticket
- 打开任何ticket的编辑界面
- 滚动到底部的"Tags"部分
- 点击"Add Tag"按钮
- 从下拉列表中选择要添加的tag
- Tag会立即添加到ticket上

### 2. 从Ticket移除Tag
- 打开有tags的ticket编辑界面
- 在"Tags"部分可以看到所有已添加的tags
- 每个tag右侧有一个"×"按钮
- 点击"×"按钮即可移除该tag

## 使用步骤

### 创建新Ticket并添加Tags

1. 点击"Create Ticket"按钮（右下角的+按钮）
2. 填写title和description
3. 滚动到"Tags"部分
4. 点击"Add Tag"按钮
5. 从列表中选择tags
6. 点击"Create Ticket"保存

### 编辑现有Ticket的Tags

1. 在ticket卡片上点击"Edit"按钮
2. 滚动到"Tags"部分
3. **添加tag**: 点击"Add Tag" → 选择tag
4. **移除tag**: 点击tag上的"×"按钮
5. 修改会立即保存

## 调试说明

如果"Add Tag"下拉列表为空，请检查：

1. **后端是否运行**:
```bash
ps aux | grep uvicorn
```

2. **Tags数据是否存在**:
```bash
curl http://localhost:8000/api/tags
```

3. **浏览器控制台日志**:
   - 打开F12开发者工具
   - 查看Console标签
   - 应该看到"TagSelector Debug"日志
   - 检查"All tags from API"是否有数据

4. **如果没有tags，先创建一些**:
   - 去Tags页面
   - 点击"New Tag"按钮
   - 创建几个tags（如：bug, feature, urgent等）

## 技术实现

- **前端**: 使用简化的下拉列表（不依赖Command组件）
- **后端**: POST /api/tickets/{id}/tags 和 DELETE /api/tickets/{id}/tags/{tag_id}
- **实时更新**: 添加/删除tag会立即调用API并更新UI
- **Toast提示**: 成功/失败操作都有提示消息

## 已修复的问题

1. ✅ API参数名称（tag_ids vs tagIds）
2. ✅ 类型转换（TagWithCount → Tag）
3. ✅ 简化UI组件（移除复杂的Command组件）
4. ✅ 添加详细的调试日志
5. ✅ 修复下拉列表不显示的问题

现在功能应该可以正常使用了！
