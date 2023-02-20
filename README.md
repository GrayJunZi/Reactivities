# Reactivities

## ���� .NET Core ��Ŀ

### ��Ŀ������ϵ

- API ���� Application
- Application ���� Persistence �� Domain
- Persistence ���� Domain
- Domain �������κ���Ŀ

### ��װ���

#### ��װ EF Core

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

### ��װ git

```
# ��ʼ�� git �ֿ�
git init 

# ���� .gitignore �ļ�
dotnet new gitignore

# ��������ļ�
git add .

# �鿴 git ״̬
git status

# ����Զ�ֿ̲�
git remote add origin https://github.com/GrayJunZi/Reactivities.git

# ������Զ�ֿ̲�
git push -u origin master
```

## ����ǰ����Ŀ

### ���� React ��Ŀ

```
# ���� react ��Ŀ
npx create-react-app client-app --use-npm --template typescript

# ��װ axios
npm install axios

# ��װ semantic ui
npm install semantic-ui-react semantic-ui-css
```


## ѧϰ�׶�

### ��һ����

- �ɾ��ܹ� (Clean architecture)
- dotnet CLI
- EF Core
- �������� (Seeding Data)
- ���ݿ�Ǩ�� (Code first migrations)
- Git�ֿ� (Git for source control)

### �ڶ�����

- ����ReactӦ�� (create-react-app)
- React �������� (React Dev tools)
- Typescript
- Axios
- Semantic-ui