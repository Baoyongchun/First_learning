package com.bao.generator.service;

import com.bao.generator.bean.po.Test;

import java.util.List;

/**
*
* test Service接口
*
* @author baoyongchun
* @date 2023-09-28 11:26:36
*/
public interface TestService {
    List<Test> test(Integer page,Integer pageSize);
}




