# BMI 计算器

基于 Svelte 5 构建的分龄 BMI 计算器。

## 特性

- **分龄评估** - 覆盖小学一年级至成人 14 个阶段
- **性别差异** - 男女独立阈值标准
- **双单位支持** - kg / 斤 实时转换
- **可视化反馈** - 当前区间高亮 + 动态指针
- **隐私优先** - 纯前端计算，无数据上传

## 技术栈

- Svelte 5 (Runes)
- Tailwind CSS v4
- TypeScript

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/[user name]/bmi-calculator.git
cd bmi-calculator

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 部署

```bash
# 静态部署 (GitHub Pages / Vercel / Netlify)
pnpm build
# 产物位于 build/ 目录
```

## License

[Apache-2.0](LICENSE)
