package com.bao.generator.bean.po;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Table;
import java.util.Date;
import javax.persistence.Id;

/**
* T_XTPZ_VERIFICATION_FIELD 实体类
* @author baoyongchun
* @date 2023-09-28 12:14:30
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "db_zyml.T_XTPZ_VERIFICATION_FIELD")
public class TXtpzVerificationField{

    @Column(name = "KEYS")
    private String keys;

    @Column(name = "FIELD")
    private String field;

    @Column(name = "ISEMPTY")
    private String isempty;

    @Column(name = "CODE")
    private String code;

    @Column(name = "REGEX")
    private String regex;

    @Column(name = "RESTRICTIVECONDITION")
    private String restrictivecondition;
}
