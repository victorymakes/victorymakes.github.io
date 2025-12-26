---
title: Scraping and Parsing Chinese Disaster Early Warning Information
description: How to scrape disaster warning data from China Weather Network and parse XML responses using Java and Jackson.
date: 2019-01-28
tags:
  - id: "spider"
    title: "Spider"
category:
  id: program
  title: Program
---

## Background

I had a requirement to obtain **disaster early warning notifications**, but found that there was no free official API available.
Most existing APIs that provide disaster warning data are **paid services**.

For general weather forecasts, there are some free APIs available (see:
[Which weather API is more reliable?](https://www.zhihu.com/question/20575288)),
but **disaster warning APIs are typically paid**.

So I decided to explore the data sources myself.

<!-- more -->

---

## Discovering the Data Source

By inspecting network requests using browser developer tools (F12),
I discovered that **China Weather Network** exposes a usable endpoint:

```
http://www.weather.com.cn/data/alarm_xml/alarminfo.xml
```

This endpoint returns **XML-formatted disaster warning information**.

---

## XML Data Model

Below is a simplified Java data model for parsing the XML response.

### AlarmInfo

```java
@Data
@XmlRootElement(name = "AlermInfo")
public class AlarmInfo {
    private AlarmDetail roadIcing;
    private AlarmDetail snowStorm;
    private AlarmDetail rainStorm;
    private AlarmDetail hail;
    private AlarmDetail gale;
    private AlarmDetail heavyFog;
    private AlarmDetail heatWave;
    private AlarmDetail drought;
    private AlarmDetail coldWave;
    private AlarmDetail sWHazards;
    private AlarmDetail lightning;
    private AlarmDetail haze;
    private AlarmDetail sandStorm;
    private AlarmDetail frost;
    private AlarmDetail typhoon;
    private AlarmDetail other;
}
```

### AlarmDetail

```java
@Data
public class AlarmDetail {
    List<Station> station;
}
```

### Station

```java
@Data
public class Station {
    @JacksonXmlProperty(isAttribute = true, localName = "stationId")
    private String stationId;
    @JacksonXmlProperty(isAttribute = true, localName = "areaId")
    private String areaId;
    @JacksonXmlProperty(isAttribute = true, localName = "stationName")
    private String stationName;
    @JacksonXmlProperty(isAttribute = true, localName = "lon")
    private String lon;
    @JacksonXmlProperty(isAttribute = true, localName = "lat")
    private String lat;
    @JacksonXmlProperty(isAttribute = true, localName = "signalType")
    private String signalType;
    @JacksonXmlProperty(isAttribute = true, localName = "signalLevel")
    private String signalLevel;
    @JacksonXmlProperty(isAttribute = true, localName = "issueTime")
    private String issueTime;
    @JacksonXmlProperty(isAttribute = true, localName = "relieveTime")
    private String relieveTime;
    @JacksonXmlProperty(isAttribute = true, localName = "issueContent")
    private String issueContent;
}
```

---

## XML Parsing with Jackson

Below is a reusable serialization utility using **Jackson** for both JSON and XML parsing.

```java
public class JacksonSerialize implements SerializeDelegate {

    private static final ObjectMapper OBJECT_MAPPER;
    private static final XmlMapper XML_MAPPER;

    static {
        OBJECT_MAPPER = new ObjectMapper();
        OBJECT_MAPPER.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        OBJECT_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        JacksonXmlModule module = new JacksonXmlModule();
        module.setDefaultUseWrapper(false);
        XML_MAPPER = new XmlMapper(module);
        XML_MAPPER.setPropertyNamingStrategy(PropertyNamingStrategy.UPPER_CAMEL_CASE);
        XML_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        XML_MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        XML_MAPPER.configure(SerializationFeature.WRAP_ROOT_VALUE, true);
    }

    @Override
    public <T> T jsonToBean(String json, Class<T> clazz) {
        try {
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public <T> T xmlToBean(String xml, Class<T> clazz) {
        try {
            return XML_MAPPER.readValue(xml, clazz);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

---

## Summary

By inspecting network traffic, it is often possible to discover **undocumented but publicly accessible APIs**.

Key takeaways:

- Disaster warning APIs are usually paid, but alternatives may exist
- Browser developer tools are invaluable for discovery
- XML parsing with Jackson is straightforward and efficient
- Always respect terms of service and usage limits

This approach works well for **lightweight, non-commercial use cases**.
