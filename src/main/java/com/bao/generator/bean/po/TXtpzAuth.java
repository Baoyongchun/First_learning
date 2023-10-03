package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_AUTH 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_AUTH")
public class TXtpzAuth{

    /**
    *主键
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *省份
    */
    @Column(name = "C_SF")
    private String cSf;

    /**
    *查询开始时间
    */
    @Column(name = "C_QUERY_START")
    private Date cQueryStart;

    /**
    *查询结束时间
    */
    @Column(name = "C_QUERY_END")
    private Date cQueryEnd;

    /**
    *每天查询量（个/天）
    */
    @Column(name = "C_QUERY_COUNT")
    private Integer cQueryCount;

    /**
    *关联的数据源的c_id
    */
    @Column(name = "C_ID_SJY")
    private String cIdSjy;

    /**
    *省份名称
    */
    @Column(name = "C_SF_NAME")
    private String cSfName;
}
