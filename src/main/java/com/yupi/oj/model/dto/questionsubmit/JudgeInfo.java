package com.yupi.oj.model.dto.questionsubmit;

import lombok.Data;

/**
 * 判题信息：
 * [
 * {
 *    message: "msg",
 *    memory: 100,
 *    time: 100
 * }
 * ]
 *
 */
@Data
public class JudgeInfo {
    /**
     * 程序执行信息
     */
    private String message;

    /**
     * 消耗内存（kb）
     */
    private Long memory;

    /**
     * 消耗时间（ms）
     */
    private Long time;
}
