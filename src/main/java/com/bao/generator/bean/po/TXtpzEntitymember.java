package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_ENTITYMEMBER 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_ENTITYMEMBER")
public class TXtpzEntitymember{

    /**
    *编号
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *实体编号
    */
    @Column(name = "C_STBH")
    private String cStbh;

    /**
    *数据源ID
    */
    @Column(name = "C_ID_SJY")
    private String cIdSjy;

    /**
    *数据源分类ID
    */
    @Column(name = "C_ID_FL")
    private String cIdFl;

    /**
    *成员名称
    */
    @Column(name = "C_CYMC")
    private String cCymc;

    /**
    *展现名称
    */
    @Column(name = "C_ZXMC")
    private String cZxmc;

    /**
    *是否有效
    */
    @Column(name = "N_VALID")
    private Integer nValid;

    /**
    *字段类型
    */
    @Column(name = "N_ZDLX")
    private Integer nZdlx;

    /**
    *是否为空
    */
    @Column(name = "N_SFWK")
    private Integer nSfwk;

    /**
    *说明
    */
    @Column(name = "C_SM")
    private String cSm;

    /**
    *字段约束
    */
    @Column(name = "N_ZDYS")
    private Integer nZdys;

    /**
    *字段长度
    */
    @Column(name = "C_ZDCD")
    private String cZdcd;

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
}
