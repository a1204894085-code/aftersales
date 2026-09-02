# 登记管理系统

Cloudflare Worker 项目，线上域名：https://jsyxxtkdj.xyz

## 结构

- `src/index.js`：Worker 后端（登录、模板、登记、凭证、导出）
- `public/`：前端静态资源（`index.html` / `style.css` / `app.js`）
- `schema/schema.sql`：D1 表结构
- `wrangler.toml`：Workers / D1 / R2 绑定

## 绑定

- Worker：`aftersales`
- D1：`aftersales`
- R2：`aftersales-files`
- 自定义域名：`jsyxxtkdj.xyz`

## 本地开发

```bash
npm install
npx wrangler login
npm run dev
```

## 部署

```bash
npm run deploy
```
