package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_HY 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_HY")
public class TXtpzHy{

    /**
    *主键ID
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *行业名称
    */
    @Column(name = "C_HYMC")
    private String cHymc;

    /**
    *数据源分类ID
    */
    @Column(name = "C_SJY_FL")
    private String cSjyFl;

    /**
    *描述
    */
    @Column(name = "C_MS")
    private String cMs;

    /**
    *显示顺序
    */
    @Column(name = "N_ORDER")
    private Integer nOrder;

    /**
    *行业代码
    */
    @Column(name = "C_HYDM")
    private String cHydm;

    /**
    *行业分类代码
    */
    @Column(name = "C_HYFLDM")
    private String cHyfldm;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
