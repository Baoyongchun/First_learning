package com.bao.generator;

import com.bao.generator.service.TXtpzXcdwService;
import com.bao.generator.service.TestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class GeneratorApplicationTest {
    @Autowired
    private TestService testService;
    @Autowired
    private TXtpzXcdwService tXtpzXcdwService;
    @Test
    void contextLoads() {
        Integer currentPage = 2;
        Integer pageSize = 3;
        List<com.bao.generator.bean.po.Test> test = testService.test(currentPage, pageSize);
        test.stream().forEach(System.out::println);

        List<com.bao.generator.bean.po.TXtpzXcdw> test2 = tXtpzXcdwService.test(currentPage, pageSize);
        test2.stream().forEach(System.out::println);

    }

}
