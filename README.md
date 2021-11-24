# Уведомление о активных пользователях из Active Directory

## Краткое описание
Данная программа была написана с цельяю своевременного уведомления отдела кадров о активных пользователях Active Directory.
Чтобы своевременно блокировать уволенных пользователей.

Программа получает список пользователей из OU Active Directory по каждому объекту.
В каждом объекте имеется свой отдел кадров.
Отправляется письмо с небольшим описанием назначения письма в красивой таблице с указанием табельного номера, имени, должность, электронной почты.


## Как установить

### Клонирование и установка зависимостей проекта
```
git clone https://github.com/iSmartyPRO/ad-userlist-mail-notify.git
cd activedirectory-activeusers-mail-notification
npm install
```

### Настройка проекта
Скопируйте пример файла конфигурации
```
cd config
cp index.sample.js index.js
```



## Дополнения

### Команда для установки табельного номера из CSV файла
foreach($employee in (Import-Csv -Path .\from1C_employeeNumber.csv)) { if(Get-ADUser $employee.sAMAccountName) {Set-ADUser -Identity $employee.sAMAccountName -employeeNumber $employee.employeeNumber }  else {Write-Host "bad"}}


mode: development
mode: production