# Reactivities

## ��Ŀ������ϵ

- API ���� Application
- Application ���� Persistence �� Domain
- Persistence ���� Domain
- Domain �������κ���Ŀ

## ��װ���

### ��װ EF Core

```
# �鿴�Ƿ�װ dotnet-ef ����
dotnet tool list --global

# ��װ dotnet-ef ����
dotnet tool install --global dotnet-ef --version 7.0.0

# ���� dotnet-ef ����
dotnet tool update --global dotnet-ef --version 7.0.3

# Ǩ�����ݿ�
# API ��Ŀ��Ҫ������ Microsoft.EntityFrameworkCore.Design ���
dotnet ef migrations add InitialCreate -p Persistence -s API

dotnet ef 
```

## ��װ git

```
# ��ʼ�� git �ֿ�
git init 

# ���� .gitignore �ļ�
dotnet new gitignore
```