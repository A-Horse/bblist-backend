# Database

## Development
### Docker
create localhost mysql container 
``` bash 
docker run --name some-mysql \
-p 3306:3306 \
-e MYSQL_USER=octopuese \
-e MYSQL_PASSWORD=my-secret-user-pw \
-e MYSQL_ROOT_PASSWORD=my-secret-pw \
-e MYSQL_DATABASE=octopuese \
-d mysql \
--default-authentication-plugin=mysql_native_password
```

create loaclhost mongodb container
``` bash
docker run -d -p 27017:27017 -v mongo-data:/data/db --name mongodb mongo:3.6.0
```

## FAQ

### 插入中文失败

解决方法：创建数据库的时候指定缺省字符集。

```sql
CREATE DATABASE octopus DEFAULT CHARACTER SET utf8;
```
