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
dotnet ef migrations add IdentityAdded -p Persistence -s API

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

# 重置到某次commit
git reset --hard commit_id

# 强制推送到远程仓库
git push origin HEAD --force

# 创建本地分支
git branch -b branch_name

# 删除本地分支
git branch -d branch_name

# 删除远程分支
git push origin -d branch_name
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

# 安装 uuid
npm install uuid
npm i --save-dev @types/uuid

# 安装 MobX
npm install mobx mobx-react-list

# 安装路由
npm install react-router-dom
npm install @types/react-router-dom --save-dev

# 安装日历
npm install react-calendar
npm install @types/react-calendar

# 安装 toastify
npm install react-toastify

# 安装 formik
npm install formik

# 安装 yup
npm install yup
npm install @types/yup --save-dev

# 安装 datepicker
npm install react-datepicker
npm install @types/react-datepicker --save-dev
```

## 干净架构

[The Clean Architecture](http://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)


## 学习阶段

### 第一部分（后端）

- 干净架构入门 (Clean architecture)
- dotnet CLI
- EF Core
- 种子数据 (Seeding Data)
- 数据库迁移 (Code first migrations)
- Git仓库 (Git for source control)

### 第二部分（前端）

- 创建React应用 (create-react-app)
- React 开发工具 (React Dev tools)
- TypeScript
- Axios
- Semantic-ui

### 第三部分（后端）

- 干净架构模式 (Clean architecture pattern)
- 命令与查询分离 + 中介者模式 (CQRS + Mediator Pattern)
- 增删改查 (CRUD)

### 第四部分（前端）

- TypeScript 接口
- Semantic UI 组件
- React 表单
- CRUD 操作

### 第五部分（前端）

- axios 封装
- axios 拦截器

### 第六部分（前端）

- 状态管理
- MobX
- React Context

### 第七部分（前端）

- 路由

### 第八部分（前端）

- 调整UI界面

### 第九部分（后端/前端）

- 验证
- 处理 HTTP 错误响应
- 处理异常
- 自定义中间件

- Axios 拦截器

### 第十部分（前端）

- 表单验证

### 第十一部分（后端）

- ASPNET Core Identity
- JWT Token Authentication
- 登录/注册

### 第十二部份（前端）

- 登录/注册