package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_CORP_AUTH 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_CORP_AUTH")
public class TXtpzCorpAuth{

    /**
    *主键
    */
    @Column(name = "C_ID")
    private String cId;

    /**
    *单位ID
    */
    @Column(name = "C_CORP_ID")
    private String cCorpId;

    /**
    *单位名称
    */
    @Column(name = "C_CORP_NAME")
    private String cCorpName;

    /**
    *授权状态
    */
    @Column(name = "N_SQZT")
    private Integer nSqzt;

    /**
    *黑名单
    */
    @Column(name = "N_HMD")
    private Integer nHmd;

    /**
    *数据源授权主键
    */
    @Column(name = "C_AUTH_IDS")
    private String cAuthIds;

    /**
    *更新时间
    */
    @Column(name = "D_UPDATE_TIME")
    private String dUpdateTime;

    /**
    *层级
    */
    @Column(name = "N_LEVEL")
    private Integer nLevel;

    /**
    *机构编码
    */
    @Column(name = "C_JGBM")
    private String cJgbm;
}
