package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_SJLX 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_SJLX")
public class TXtpzSjlx{

    /**
    *主键ID
    */
    @Id
    @Column(name = "C_ID")
    private String cId;

    /**
    *数据源ID
    */
    @Column(name = "C_ID_SJY")
    private String cIdSjy;

    /**
    *协查单位编号
    */
    @Column(name = "C_XCDWBH")
    private String cXcdwbh;

    /**
    *被查询对象类型
    */
    @Column(name = "C_DXLX")
    private String cDxlx;

    /**
    *查询数据返回时长
    */
    @Column(name = "C_FHSC")
    private String cFhsc;

    @Column(name = "CORP_CODE")
    private String corpCode;
}
