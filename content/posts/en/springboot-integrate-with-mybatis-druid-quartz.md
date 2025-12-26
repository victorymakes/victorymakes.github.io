---
title: Integrating Spring Boot with MyBatis, Druid, and Quartz
description: A practical guide to integrating MyBatis, Druid, and Quartz into a Spring Boot application, including dynamic scheduled jobs and H2-based testing.
date: 2017-11-12
tags:
  - id: "springboot"
    title: "SpringBoot"
  - id: "quartz"
    title: "Quartz"
  - id: "druid"
    title: "Druid"
  - id: "h2"
    title: "H2"
  - id: "mybatis"
    title: "Mybatis"
category:
  id: program
  title: Program
---

## Background

As scheduled tasks in the system increased, system pressure also grew.
To address this, scheduled jobs were extracted into a dedicated service using:

**Spring Boot + MyBatis + Quartz**

The integration covers:

1. MyBatis (including common mapper and pagination)
2. Quartz with dynamic job management
3. Spring AOP support in scheduled jobs
4. Druid integration
5. H2 database for unit testing

<!-- more -->

---

## Integrating MyBatis

### Dependencies

```xml
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
</dependency>

<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <scope>runtime</scope>
</dependency>
```

### Configuration

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmgr
spring.datasource.username=root
spring.datasource.password=123456

mybatis.type-aliases-package=com.example.entity
mybatis.mapper-locations=classpath:mapper/*.xml
```

---

## Common Mapper & Pagination

Using raw MyBatis requires repetitive CRUD XML.
This can be simplified using **General Mapper** and **PageHelper**.

```java
public interface CommonMapper<T>
    extends Mapper<T>, MySqlMapper<T>, SelectByIdsMapper<T>, DeleteByIdsMapper<T> {}
```

---

## Integrating Quartz

### Problem

Quartz jobs created outside Spring cannot:

- Autowire Spring beans
- Use Spring AOP

### Solution: Custom JobFactory

Create a JobFactory that delegates job creation to Spring:

```java
public class MySpringBeanJobFactory extends AdaptableJobFactory {
    @Autowired
    private AutowireCapableBeanFactory beanFactory;

    @Override
    protected Object createJobInstance(TriggerFiredBundle bundle) {
        try {
            return beanFactory.getBean(bundle.getJobDetail().getJobClass());
        } catch (Exception e) {
            return beanFactory.createBean(bundle.getJobDetail().getJobClass());
        }
    }
}
```

---

## Dynamic Scheduled Jobs

Jobs are loaded from the database at startup and scheduled dynamically.

```java
@Component
public class QuartzTaskStarter
        implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private QuartzTaskService quartzTaskService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        quartzTaskService.startAllTasks();
    }
}
```

---

## Integrating Druid

```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid-spring-boot-starter</artifactId>
</dependency>
```

```properties
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.druid.initial-size=5
spring.datasource.druid.max-active=20
```

---

## H2 for Unit Testing

```xml
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
  <scope>test</scope>
</dependency>
```

This prevents tests from polluting real databases.

---

## Summary

This integration provides:

- Clean separation of scheduling logic
- Dynamic job management
- Consistent data access
- Test-friendly infrastructure

A solid foundation for task-heavy Spring Boot applications.
