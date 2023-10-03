package ${targetPackage};

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;
/**
*
* ${tableClass.tableName} 控制器类
*
* @author ${author}
<#assign dateTime = .now>
* @date ${dateTime?string["yyyy-MM-dd HH:mm:ss"]}
*/
@RestController
@RequestMapping("/api/${tableClass.lowerCaseName}")
@Slf4j
public class ${tableClass.shortClassName}${controllerSuffix} {

}




