package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_XCDW 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_XCDW")
public class TXtpzXcdw{

    /**
    *编码
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *单位名称
    */
    @Column(name = "C_DWMC")
    private String cDwmc;

    /**
    *单位分类
    */
    @Column(name = "C_DWFL")
    private String cDwfl;

    /**
    *是否默认选中
    */
    @Column(name = "N_MRXZ")
    private Integer nMrxz;

    /**
    *是否有效
    */
    @Column(name = "N_VALID")
    private Integer nValid;

    /**
    *提供查询机构编码
    */
    @Column(name = "C_TGCXDW")
    private String cTgcxdw;

    /**
    *提供查询机构名称
    */
    @Column(name = "C_TGCXDWMC")
    private String cTgcxdwmc;

    /**
    *顺序
    */
    @Column(name = "N_ORDER")
    private Integer nOrder;

    /**
    *更新时间
    */
    @Column(name = "DT_UPDATE_TIME")
    private Date dtUpdateTime;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
