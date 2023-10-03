package com.bao.generator.service.impl;

import com.bao.generator.bean.po.Test;
import com.bao.generator.mapper.TestMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.bao.generator.service.TestService;

import java.util.List;

/**
*
* test ServiceImpl类
*
* @author baoyongchun
* @date 2023-09-28 11:26:36
*/
@Slf4j
@Service
public class TestServiceImpl implements TestService {

    @Autowired
    private TestMapper testMapper;

    /**
     * 分页方式1：pageHelper
     * @param page
     * @param pageSize
     * @return
     */
    @Override
    public List<Test> test(Integer page, Integer pageSize) {
        PageHelper.startPage(page,pageSize);
        List<Test> tests = testMapper.selectAll();
        PageInfo<Test> testPageInfo = new PageInfo<>(tests);
        return testPageInfo.getList();
    }
}




