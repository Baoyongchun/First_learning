package ${targetPackage};

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
<#list tableClass.allFields as field>
 <#if field.jdbcDateColumn??>
import java.util.Date;
 </#if>
 <#break>
</#list>
<#list tableClass.allFields as field>
  <#if field.identity??>
import javax.persistence.Id;
  </#if>
  <#break>
</#list>

/**
* ${tableClass.tableName} 实体类
* @author ${author}
<#assign dateTime = .now>
* @date ${dateTime?string["yyyy-MM-dd HH:mm:ss"]}
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "${schema}.${tableClass.tableName}")
public class ${tableClass.shortClassName}{
    <#if tableClass.pkFields??>
    <#list tableClass.pkFields as field>

        <#if field.remarks! != ''>
    /**
    *${field.remarks!}
    */
        </#if>
    @Id
    @Column(name = "${field.columnName}")
    private ${field.shortTypeName} ${field.fieldName};
    </#list>
    </#if>
    <#if tableClass.baseFields??>
    <#list tableClass.baseFields as field>

        <#if field.remarks! != ''>
    /**
    *${field.remarks!}
    */
        </#if>
    @Column(name = "${field.columnName}")
    private ${field.shortTypeName} ${field.fieldName};
    </#list>
    </#if>
}
