@echo off
chcp 65001 >nul
echo ======================================
echo   阿里云OCR集成 - 依赖安装
echo ======================================
echo.

rem 检查npm是否安装
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: npm 未安装
    echo 请先安装 Node.js 和 npm
    pause
    exit /b 1
)

echo ✅ 检测到 npm
echo.

rem 安装依赖
echo 📦 正在安装依赖包...
echo.

echo 1/3 安装 axios (HTTP客户端)...
call npm install axios

echo 2/3 安装 pdfjs-dist (PDF解析库)...
call npm install pdfjs-dist

echo 3/3 安装 sql.js (SQLite数据库)...
call npm install sql.js

echo.
echo ======================================
echo   ✅ 依赖安装完成！
echo ======================================
echo.
echo 📋 已安装的依赖:
echo   - axios: HTTP客户端，用于调用阿里云OCR API
echo   - pdfjs-dist: PDF解析库，将PDF转换为图片
echo   - sql.js: SQLite数据库，用于本地数据存储
echo.
echo 🚀 下一步:
echo   1. 运行 npm run dev 启动开发服务器
echo   2. 访问简历筛选页面开始使用
echo.
echo 📖 详细说明请查看: 阿里云OCR集成说明.md
echo.
pause

