<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${mapperPackage}.${tableClass.shortClassName}${mapperSuffix}">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="${tableClass.fullClassName}">
        <#if tableClass.pkFields??>
        <#list tableClass.pkFields as field>
            <id column="${field.columnName}" property="${field.fieldName}" jdbcType="${field.jdbcType}"/>
        </#list>
        </#if>
        <#if tableClass.baseFields??>
            <#list tableClass.baseFields as field>
                <result column="${field.columnName}" property="${field.fieldName}" jdbcType="${field.jdbcType}"/>
            </#list>
        </#if>
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        <#if tableClass.allFields??>
            <#list tableClass.allFields as field>
                ${field.columnName},
            </#list>
        </#if>
    </sql>
</mapper>
