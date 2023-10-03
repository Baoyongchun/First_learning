package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_VERIFICATION_MXSJ 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_VERIFICATION_MXSJ")
public class TXtpzVerificationMxsj{

    @Column(name = "SJYID")
    private String sjyid;

    @Column(name = "RULE")
    private String rule;

    @Column(name = "ISEMPTY")
    private String isempty;
}
