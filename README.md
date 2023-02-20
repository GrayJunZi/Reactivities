# Reactivities

## 创建 .NET Core 项目

### 项目依赖关系

- API 依赖 Application
- Application 依赖 Persistence 和 Domain
- Persistence 依赖 Domain
- Domain 不依赖任何项目

### 安装类库

#### 安装 EF Core

```
# 查看是否安装 dotnet-ef 工具
dotnet tool list --global

# 安装 dotnet-ef 工具
dotnet tool install --global dotnet-ef --version 7.0.0

# 升级 dotnet-ef 工具
dotnet tool update --global dotnet-ef --version 7.0.3

# 迁移数据库
# API 项目需要先依赖 Microsoft.EntityFrameworkCore.Design 类库
dotnet ef migrations add InitialCreate -p Persistence -s API

dotnet ef 
```

### 安装 git

```
# 初始化 git 仓库
git init 

# 创建 .gitignore 文件
dotnet new gitignore

# 添加所有文件
git add .

# 查看 git 状态
git status

# 加入远程仓库
git remote add origin https://github.com/GrayJunZi/Reactivities.git

# 推送至远程仓库
git push -u origin master
```

## 创建前端项目

### 创建 React 项目

```
# 创建 react 项目
npx create-react-app client-app --use-npm --template typescript

# 安装 axios
npm install axios

# 安装 semantic ui
npm install semantic-ui-react semantic-ui-css
```


## 学习阶段

### 第一部分

- 干净架构 (Clean architecture)
- dotnet CLI
- EF Core
- 种子数据 (Seeding Data)
- 数据库迁移 (Code first migrations)
- Git仓库 (Git for source control)

### 第二部分

- 创建React应用 (create-react-app)
- React 开发工具 (React Dev tools)
- Typescript
- Axios
- Semantic-ui