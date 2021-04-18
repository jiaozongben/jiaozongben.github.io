---
layout: post
title:  Swagger 3分钟集成Springboot
no-post-nav: false
category: spring
tags: [spring]
excerpt: 想说的事
---



## Swagger集成

### 收益：



### 代码示例版本

springboot : 1.5.6.RELEASE

swagger: 2.6.1

### 目标

各项目为方便集成接口自动化测试，通过技术手段转化自动化测试样例，各项目须集成swagger

### 添加依赖

父级build.gradle文件添加swagger依赖

```
// import swagger
compile("io.springfox:springfox-spi:2.6.1")
compile("io.springfox:springfox-swagger2:2.6.1")
compile("io.springfox:springfox-swagger-ui:2.6.1")
```

![](https://james-xuande.github.io/assets/images/posts/2021-04-04/swagger-dependency.png)

### 注解开启swagger

app启动文件添加注解

```
@EnableSwagger2
```

![](https://james-xuande.github.io/assets/images/posts/2021-04-04/starter.png)

### 选择暴露接口范围

把SwaggerDocumentationConfig

放到项目中的config文件夹

```
package com.haiercash.configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2020-10-25T01:24:08.406Z")
@Configuration
public class SwaggerDocumentationConfig {
    @Value("${swagger.enable}")
    private boolean enableSwagger;
    ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Swagger dingding question latest")
                .description("This is a sample haiercash server. ")
                .license("licence")
                .licenseUrl("http://unlicense.org")
                .termsOfServiceUrl("")
                .version("1.0.0")
                .contact(new Contact("", "", "jiaozongben@haiercash.com"))
                .build();
    }
    @Bean
    public Docket customImplementation() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.haiercash"))
                .build()
                .apiInfo(apiInfo())
                .enable(enableSwagger);
    }
}
```

![](https://james-xuande.github.io/assets/images/posts/2021-04-04/expose-interface.png)

### swagger开关

考虑到生产接口的安全性

配置文件加上这个

测试环境打开：

```
swagger:
  enable: true
```

生产环境关闭：

```
swagger:
  enable: false
```

### 验证

如果您正在使用spring security，对于测试环境建议permit_all 放行

如果好了之后 访问 http://ip:port/v2/api-docs 应该会有对应的返回报文了

