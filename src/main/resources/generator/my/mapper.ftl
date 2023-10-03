package ${targetPackage};

import ${tableClass.fullClassName};
import org.apache.ibatis.annotations.Mapper;

/**
*
* ${tableClass.tableName} Mapper 接口
*
* @author ${author}
<#assign dateTime = .now>
* @date ${dateTime?string["yyyy-MM-dd HH:mm:ss"]}
*/
@Mapper
public interface ${tableClass.shortClassName}${mapperSuffix} extends tk.mybatis.mapper.common.Mapper<${tableClass.shortClassName}> {

}
