<template>
  <div id="questionManageView">
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: pageParams.pageSize,
        current: pageParams.current,
        total: totalSize,
      }"
    >
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="onEdit(record)">修改</a-button>
          <a-button status="danger" @click="onDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  DeleteRequest,
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import { useRouter } from "vue-router";
import message from "@arco-design/web-vue/es/message";

// 分页获取的题目数据列表
const dataList = ref([]);
// 总题目数量
const totalSize = ref(0);

// 分页展示数据，默认展示前 10 个数据
const pageParams = ref({
  // 分页大小
  pageSize: 10,
  // 当前分页索引
  current: 1,
});

/**
 * 相应参数：
 * {
 *  "code": 0,
 *  "data": {
 *    "countId": "",
 *    "current": 0,
 *    "maxLimit": 0,
 *    "optimizeCountSql": true,
 *    "orders": [
 *      {
 *        "asc": true,
 *        "column": ""
 *      }
 *    ],
 *    "pages": 0,
 *    "records": [
 *      {
 *        "acceptedNum": 0,
 *        "answer": "",
 *        "content": "",
 *        "createTime": "",
 *        "favourNum": 0,
 *        "id": 0,
 *        "isDelete": 0,
 *        "judgeCase": "",
 *        "judgeConfig": "",
 *        "submitNum": 0,
 *        "tags": "",
 *        "thumbNum": 0,
 *        "title": "",
 *        "updateTime": "",
 *        "userId": 0
 *      }
 *    ],
 *    "searchCount": true,
 *    "size": 0,
 *    "total": 0
 *  },
 *  "message": ""
 * }
 */

// 加载题目数据
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    pageParams as QuestionQueryRequest
  );

  if (res.code === 0) {
    dataList.value = res.data.records;
    totalSize.value = res.data.total;
  } else {
    message.error("题目列表查询失败：" + res.message);
  }
};

// 表格一行数据修改事件
const router = useRouter();
const onEdit = async (question: Question) => {
  router.push({
    path: "/question/add",
    query: {
      id: question.id,
    },
  });
};

// 表格一行数据删除事件
const onDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost(
    question as DeleteRequest
  );

  if (res.code === 0) {
    message.success("题目删除成功！");
    // 删除后刷新数据
    loadData();
  } else {
    message.error("题目删除失败：" + res.message);
  }
};

/**
 * 当页面加载完毕时，从后端获取题目数据，并展示给管理员
 */
onMounted(() => {
  loadData();
});

/**
 * 题目数据列表字段对应（需要与后端获取数据字段进行对应）
 *
 *    "records": [
 *      {
 *        "acceptedNum": 0,
 *        "answer": "",
 *        "content": "",
 *        "createTime": "",
 *        "favourNum": 0,
 *        "id": 0,
 *        "isDelete": 0,
 *        "judgeCase": "",
 *        "judgeConfig": "",
 *        "submitNum": 0,
 *        "tags": "",
 *        "thumbNum": 0,
 *        "title": "",
 *        "updateTime": "",
 *        "userId": 0
 *      }
 *    ],
 */
const columns = [
  {
    title: "题目id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "创建用户id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#questionManageView {
}
</style>
