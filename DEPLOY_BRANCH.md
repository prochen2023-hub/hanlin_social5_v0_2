# deploy branch 部署說明｜v1.0

本包是「branch 根目錄直接發布」的純靜態網站，不需要 npm、Vite、Jekyll 或 build。

## deploy branch 已存在
```bash
git fetch origin
git switch deploy
git pull --ff-only origin deploy
```

把本包**所有內容（包含 `.nojekyll`）**覆蓋到 repository 根目錄後：

```bash
git add -A
git commit -m "deploy: social5 v1.0 game challenge + unit2 voyage"
git push origin deploy
```

Windows 也可先執行 `VERIFY_DEPLOY.bat`，確認無誤後再執行 `PUSH_DEPLOY.bat`。

## 第一次建立 deploy branch
```bash
git fetch origin
git switch --orphan deploy
git rm -rf .
```

複製本包所有內容到根目錄，再：

```bash
git add -A
git commit -m "deploy: social5 v1.0"
git push -u origin deploy
```

GitHub → `Settings` → `Pages` → `Build and deployment`：
- Source: `Deploy from a branch`
- Branch: `deploy`
- Folder: `/(root)`

## v1.0 部署注意
- `index.html`、`styles.css`、`app.js`、`v08.js`、`v09.js`、`v10.js` 都要在 branch 根目錄。
- `.nojekyll` 必須保留。
- 地圖、原住民族分布圖與第二單元古堡照片採線上公開授權／教育資源，因此使用時需連網。
- 帳號、PIN、課程進度、最近題目與遊戲紀錄目前存於瀏覽器 `localStorage`；換裝置不會同步。
- 本包未放 `CNAME`。
- 部署後建議用實際 GitHub Pages 網址在手機與桌機各測一次棋盤字體、遠端圖片與定位點。
