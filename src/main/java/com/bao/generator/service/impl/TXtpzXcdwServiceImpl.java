package com.bao.generator.service.impl;

import com.bao.generator.bean.po.TXtpzXcdw;
import com.bao.generator.mapper.TXtpzXcdwMapper;
import com.bao.generator.service.TXtpzXcdwService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
*
* T_XTPZ_XCDW ServiceImpl类
*
* @author baoyongchun
* @date 2023-09-28 11:26:35
*/
@Slf4j
@Service
public class TXtpzXcdwServiceImpl implements TXtpzXcdwService {
    @Autowired
    private TXtpzXcdwMapper tXtpzXcdwMapper;
    @Override
    public List<TXtpzXcdw> test(Integer page, Integer pageSize) {
        PageHelper.startPage(page,pageSize);
        List<TXtpzXcdw> tests = tXtpzXcdwMapper.selectAll();
        PageInfo<TXtpzXcdw> testPageInfo = new PageInfo<>(tests);
        return testPageInfo.getList();
    }
}




