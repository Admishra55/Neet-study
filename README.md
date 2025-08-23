# NEET Sheet App (Pro)

## 🚀 Features
- Google Sheet as backend (no code change needed)
- Batches → Subjects → Chapters → Lectures/PDF
- YouTube video + Playlist embed
- PDF viewer inside app
- Dark/Light theme toggle
- Drawer navigation

## 🔧 Setup
1. Make a Google Sheet with columns: Batch, Subject, Chapter, Type, Title, VideoLink, PdfLink, Order, Banner
2. Publish sheet to web
3. Copy sheetId and sheetName, then pass in app URL as query param

Example:
```
https://username.github.io/neet-sheet-app-pro/?sheetId=YOUR_SHEET_ID&sheetName=Sheet1
```

4. Deploy to GitHub Pages
5. Convert to APK using webtoapk
