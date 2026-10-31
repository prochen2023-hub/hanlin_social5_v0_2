# deploy branch 部署說明｜v0.8

本包是「branch 根目錄直接發布」的純靜態網站，不需要 npm、Node build、Vite 或 Jekyll。

## deploy branch 已存在（建議）
```bash
git fetch origin
git switch deploy
git pull --ff-only origin deploy
```

把本包**所有內容（包含 `.nojekyll`）**覆蓋到 repository 根目錄後：

```bash
git add -A
git commit -m "deploy: social5 v0.8 visual unit1 rebuild"
git push origin deploy
```

也可以使用 `PUSH_DEPLOY.bat`；它會先確認目前 branch 確實是 `deploy`。

## 第一次建立 deploy branch
```bash
git fetch origin
git switch --orphan deploy
git rm -rf .
```

複製本包所有內容到根目錄，再：

```bash
git add -A
git commit -m "deploy: social5 v0.8"
git push -u origin deploy
```

GitHub → `Settings` → `Pages` → `Build and deployment`：
- Source: `Deploy from a branch`
- Branch: `deploy`
- Folder: `/(root)`

## v0.8 部署注意
- `index.html`、`app.js`、`v08.js`、`styles.css` 必須都在 branch 根目錄。
- `.nojekyll` 必須保留。
- 第一單元地圖／照片採公開授權來源的**線上圖像網址**；GitHub Pages 本身可正常載入，但使用者裝置需要網路。
- 帳號／PIN／進度使用 `localStorage`，目前不做跨裝置同步。
- 本包未放 `CNAME`；若使用自訂網域，請先在 Pages 設定完成再加入。
