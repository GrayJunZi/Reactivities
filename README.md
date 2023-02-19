# Reactivities

## 项目依赖关系

- API 依赖 Application
- Application 依赖 Persistence 和 Domain
- Persistence 依赖 Domain
- Domain 不依赖任何项目

## 安装类库

### 安装 EF Core

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

## 安装 git

```
# 初始化 git 仓库
git init 

# 创建 .gitignore 文件
dotnet new gitignore
```