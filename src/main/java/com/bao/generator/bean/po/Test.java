package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* test 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.test")
public class Test{

    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "ncount")
    private Long ncount;

    @Column(name = "dtdate")
    private Date dtdate;
}
