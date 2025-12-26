---
title: Installing and Using MySQL 5.7 Without an Installer (Windows)
description: A step-by-step guide to installing MySQL 5.7 using the no-install ZIP package on Windows when MSI installers are restricted.
date: 2017-05-26
tags:
  - id: "mysql"
    title: "MySQL"
category:
  id: program
  title: Program
---

## Background

Due to strict security restrictions on my work computer, installing MySQL via the official MSI installer was not possible.
As a workaround, I downloaded the **no-install ZIP package** of MySQL and configured it manually.

Download page:
[MySQL Downloads](https://dev.mysql.com/downloads/mysql/)

The version used in this guide:

```
mysql-5.7.18-winx64.zip
```

<!-- more -->

---

## Extracting MySQL

After downloading, extract the ZIP archive to any directory you like, then enter the extracted folder:

```
mysql-5.7.18-winx64
```

Based on prior experience, the first step is to initialize MySQL by running `mysqld.exe` from the `bin` directory.

```bat
D:\Dev\MySql\mysql-5.7.18-winx64\bin>mysqld.exe --initialize
```

Unfortunately, this failed with the following error:

```text
mysqld: Could not create or access the registry key needed for the MySQL application to log to the Windows EventLog.
Run the application with sufficient privileges once to create the key, add the key manually, or turn off logging for that application.
mysqld: Can't change dir to 'D:\Dev\MySql\mysql-5.7.18-winx64\data\' (Errcode: 2 - No such file or directory)
```

This indicates that administrator privileges are required. Since elevating privileges was not an option, I disabled system logging and created the `data` directory manually.

---

## Initializing MySQL Without System Logging

Run the following command to initialize MySQL while disabling Windows EventLog logging:

```bat
D:\Dev\MySql\mysql-5.7.18-winx64\bin>mysqld.exe --initialize --log_syslog=0
```

This time, initialization succeeds and the `data` directory is created.

---

## Starting MySQL

Start MySQL in console mode:

```bat
D:\Dev\MySql\mysql-5.7.18-winx64\bin>mysqld.exe --console
```

Then open a new command window and attempt to log in using the default credentials:

```bat
D:\Dev\MySql\mysql-5.7.18-winx64\bin>mysql.exe -uroot -p
```

You may see the following error:

```text
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
```

---

## Understanding the Initial Password Behavior

Starting with **MySQL 5.7.10**, the root account no longer has an empty password by default.
Instead, MySQL generates a **random temporary password** during initialization.

You must use this password to log in and change it immediately.
Otherwise, MySQL will block all operations with the following error:

```text
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
```

---

## Correct Login and Password Reset Steps

1. In the `data` directory, locate the `.err` log file.
2. Search for this line:

   ```
   A temporary password is generated for root@localhost:
   ```

3. Copy the generated password.
4. Log in using that password:

   ```bat
   mysql.exe -uroot -p
   ```

5. Reset the root password:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
   FLUSH PRIVILEGES;
   ```

After this, MySQL can be used normally.

---

## Conclusion

Installing MySQL using the ZIP archive requires extra manual steps, but it is a reliable solution when installers are restricted.

Key takeaways:

- MySQL 5.7+ generates a temporary root password by default
- Administrator privileges are required for Windows EventLog integration
- ZIP-based installation works well in locked-down environments

---

## References

- Official Documentation:  
  [Installing MySQL on Microsoft Windows Using a noinstall Zip Archive](https://dev.mysql.com/doc/refman/5.7/en/windows-install-archive.html)
