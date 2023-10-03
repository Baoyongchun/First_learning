package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_AUTH_XCDW 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_AUTH_XCDW")
public class TXtpzAuthXcdw{

    /**
    *主键
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *权限表主键
    */
    @Column(name = "C_AUTH_ID")
    private String cAuthId;

    /**
    *选择的协查单位json串
    */
    @Column(name = "C_XCDW")
    private String cXcdw;

    /**
    *更新时间
    */
    @Column(name = "DT_UPDATE_TIME")
    private Date dtUpdateTime;

    /**
    *备注
    */
    @Column(name = "C_REMARK")
    private String cRemark;

    /**
    *查询项ID
    */
    @Column(name = "C_SJYID")
    private String cSjyid;
}
