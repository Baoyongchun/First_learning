package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_SJY_FL 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_SJY_FL")
public class TXtpzSjyFl{

    /**
    *分类ID
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *分类名称
    */
    @Column(name = "C_NAME")
    private String cName;

    /**
    *父类ID
    */
    @Column(name = "C_PID")
    private String cPid;

    /**
    *是否有效
    */
    @Column(name = "N_VALID")
    private Integer nValid;

    /**
    *序号
    */
    @Column(name = "N_ORDER")
    private Integer nOrder;

    /**
    *更新时间
    */
    @Column(name = "DT_UPDATE_TIME")
    private Date dtUpdateTime;

    /**
    *分类代码
    */
    @Column(name = "C_DM")
    private String cDm;

    /**
    *描述
    */
    @Column(name = "C_SM")
    private String cSm;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
