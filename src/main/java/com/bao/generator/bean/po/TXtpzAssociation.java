package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_ASSOCIATION 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_ASSOCIATION")
public class TXtpzAssociation{

    /**
    *主键编号
    */
    @Id
    @Column(name = "C_BH")
    private String cBh;

    /**
    *实体编号
    */
    @Column(name = "C_ID_ENTITY")
    private String cIdEntity;

    /**
    *查询项编号
    */
    @Column(name = "C_ID_SJY")
    private String cIdSjy;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
