package ${targetPackage};

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import ${servicePackage}.${tableClass.shortClassName}${serviceSuffix};
/**
*
* ${tableClass.tableName} ServiceImpl类
*
* @author ${author}
<#assign dateTime = .now>
* @date ${dateTime?string["yyyy-MM-dd HH:mm:ss"]}
*/
@Slf4j
@Service
public class ${tableClass.shortClassName}${serviceSuffix}Impl implements ${tableClass.shortClassName}${serviceSuffix} {

}




