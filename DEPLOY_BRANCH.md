# deploy branch 部署說明

本包已整理成「branch 根目錄直接發布」的形式，不需要 npm、Node build、Vite 或 Jekyll。

## A. 第一次建立 deploy branch

在你的 repository 本機目錄執行：

```bash
git fetch origin
git switch --orphan deploy
git rm -rf .
```

將本部署包**所有內容（包含 `.nojekyll`）**複製到 repository 根目錄後：

```bash
git add -A
git commit -m "deploy: social5 v0.5"
git push -u origin deploy
```

然後到 GitHub：

1. `Settings`
2. `Pages`
3. `Build and deployment`
4. Source 選 `Deploy from a branch`
5. Branch 選 `deploy`
6. Folder 選 `/(root)`
7. Save

## B. deploy branch 已存在

```bash
git fetch origin
git switch deploy
git pull --ff-only origin deploy
```

用新版部署包覆蓋舊檔，再：

```bash
git add -A
git commit -m "deploy: update social5"
git push origin deploy
```

也可以直接執行本包的 `PUSH_DEPLOY.bat`；它只會在目前 branch 名稱確實為 `deploy` 時才允許 push。

## C. GitHub Pages 設定

這個網站是純靜態 HTML/CSS/JavaScript，因此發布來源設成：

- Source: `Deploy from a branch`
- Branch: `deploy`
- Folder: `/(root)`

`.nojekyll` 已包含在根目錄，用來避免不需要的 Jekyll 處理。

## D. 重要提醒

- 不要把原開發 branch 的 `.git` 資料夾複製進部署包。
- `index.html` 必須留在 `deploy` branch 根目錄。
- 目前使用 `localStorage` 保存孩子帳號與進度；換瀏覽器／換裝置不會同步。
- 若日後設定自訂網域，請先在 GitHub Pages 設定頁完成 Custom domain，再依設定加入 `CNAME`；本包不預先放置 CNAME，以免綁錯網域。
