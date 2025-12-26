---
title: MySQL 5.7 GROUP BY Error 1055 Explained
description: Understanding MySQL 5.7 GROUP BY error 1055, ONLY_FULL_GROUP_BY mode, and practical solutions to fix incompatible queries.
date: 2017-10-21
tags:
  - id: "mysql"
    title: "MySQL"
category:
  id: program
  title: Program
---

## Background

After upgrading a project to **MySQL 5.7**, some SQL queries that previously worked started to fail.

A typical error looked like this:

```sql
SELECT accountname, accounttype
FROM weixin_account
GROUP BY accountname;
```

Error message:

```text
ERROR 1055 - 'wcmgt.weixin_account.accounttype' isn't in GROUP BY
```

This behavior is confusing at first, but it is actually an intentional change introduced in **MySQL 5.7.5+**.

<!-- more -->

---

## Why This Happens

Starting from **MySQL 5.7.5**, the SQL mode **ONLY_FULL_GROUP_BY** is enabled by default.

With this mode enabled:

- Every column in the `SELECT` list must either:
  - Appear in the `GROUP BY` clause, or
  - Be wrapped in an aggregate function, or
  - Be functionally dependent on the `GROUP BY` columns

This prevents **nondeterministic queries** where the database cannot guarantee which value to return for non-grouped columns.

---

## Official Explanation (Summary)

Key changes introduced in MySQL 5.7:

- `ONLY_FULL_GROUP_BY` is enabled by default
- MySQL can detect functional dependencies
- The `HAVING` clause can now reference aliases
- A new function, **`ANY_VALUE()`**, was introduced

The default `sql_mode` now includes:

```
ONLY_FULL_GROUP_BY,
STRICT_TRANS_TABLES,
NO_ENGINE_SUBSTITUTION
```

---

## How to Fix the Error

There are **two recommended approaches**, depending on your situation.

---

## Solution 1: Modify the SQL Query (Recommended)

If you can change the query, use one of the following approaches.

### 1. Add Columns to GROUP BY

```sql
SELECT accountname, accounttype
FROM weixin_account
GROUP BY accountname, accounttype;
```

### 2. Use ANY_VALUE()

```sql
SELECT accountname, ANY_VALUE(accounttype) AS accounttype
FROM weixin_account
GROUP BY accountname;
```

`ANY_VALUE()` tells MySQL that you understand the nondeterminism and accept it.

---

## Solution 2: Disable ONLY_FULL_GROUP_BY (Use with Caution)

If modifying SQL is not possible (for example, legacy systems or third-party code),
you can change the global SQL mode.

### Check Current SQL Mode

```sql
SELECT @@global.sql_mode;
```

### Remove ONLY_FULL_GROUP_BY

```sql
SET @@global.sql_mode =
'NO_AUTO_VALUE_ON_ZERO,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
```

⚠️ **Warning**:  
Disabling `ONLY_FULL_GROUP_BY` may reintroduce nondeterministic query behavior.
This should be considered a temporary workaround rather than a best practice.

---

## Best Practices

- Prefer fixing SQL queries instead of changing global SQL mode
- Use `ANY_VALUE()` only when appropriate
- Understand functional dependencies in your schema
- Test queries thoroughly after MySQL upgrades

---

## References

- MySQL Handling of GROUP BY  
  https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html
- Changes in MySQL 5.7.5  
  https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-5.html
- Server SQL Modes  
  https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html
