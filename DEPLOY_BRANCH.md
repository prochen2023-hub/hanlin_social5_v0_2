# deploy branch 部署說明｜v1.1.0

本包是 GitHub Pages `deploy` branch 根目錄可直接發布的純靜態網站，不需要 npm、Vite、Jekyll 或 build。

## 已有 deploy branch
```bash
git fetch origin
git switch deploy
git pull --ff-only origin deploy
```

將本包全部內容（包含 `.nojekyll`）覆蓋到 repository 根目錄後：

```bash
git add -A
git commit -m "deploy: social5 v1.1 selectable detailed unit2"
git push origin deploy
```

Windows 可先執行 `VERIFY_DEPLOY.bat`，通過後執行 `PUSH_DEPLOY.bat`。

## GitHub Pages
GitHub → Settings → Pages → Build and deployment：
- Source: `Deploy from a branch`
- Branch: `deploy`
- Folder: `/(root)`

## v1.1 必要檔案
`index.html`、`styles.css`、`app.js`、`v08.js`、`v09.js`、`v10.js`、`v11.js`、`.nojekyll` 均須放在 branch 根目錄。

## 更新辨識
部署成功後，登入頁應同時看到：
- `國小五上・社會科・翰林版`
- `程式 v1.1.0`

登入後頂端也會顯示 v1.1.0。若仍顯示舊版，先重新整理或清除網站快取。

## 資料保存
帳號、PIN、課程進度、錯題與遊戲紀錄目前保存在瀏覽器 `localStorage`；換裝置不會同步。

本包未放 `CNAME`。
