package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_SJY 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_SJY")
public class TXtpzSjy{

    /**
    *数据源ID
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *数据源分类ID
    */
    @Column(name = "C_ID_FL")
    private String cIdFl;

    /**
    *数据源名称
    */
    @Column(name = "C_NAME")
    private String cName;

    /**
    *是否有效
    */
    @Column(name = "N_VALID")
    private Integer nValid;

    /**
    *是否选择日期
    */
    @Column(name = "N_SFXZRQ")
    private Byte nSfxzrq;

    /**
    *更新时间
    */
    @Column(name = "DT_UPDATE_TIME")
    private Date dtUpdateTime;

    /**
    *行业ID
    */
    @Column(name = "C_ID_HY")
    private String cIdHy;

    /**
    *查询项编码
    */
    @Column(name = "C_BM")
    private String cBm;

    /**
    *查询项描述
    */
    @Column(name = "C_SM")
    private String cSm;

    @Column(name = "C_CXDW")
    private String cCxdw;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
