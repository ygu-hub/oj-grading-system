package com.yupi.oj.model.dto.questionsubmit;

import com.yupi.oj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * 查询提交题目，可以根据题目id，题目提交状态，语言，以及提交用户 id 来进行查询
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
// 重写父类的 equals 和 hashcode 方法
@EqualsAndHashCode(callSuper = true)
@Data
public class QuestionSubmitQueryRequest extends PageRequest implements Serializable {
    /**
     * 题目 id
     */
    private Long questionId;

    /**
     * 判题状态（0 - 待判题，1 - 判题中，2 - 成功， 3 - 失败）
     */
    private Integer status;

    /**
     * 提交语言
     */
    private String language;

    /**
     * 创建用户 id
     */
    private Long userId;

    private static final long serialVersionUID = 1L;
}