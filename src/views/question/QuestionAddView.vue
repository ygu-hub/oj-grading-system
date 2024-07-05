<template>
  <div id="addQuestionView">
    <h2>添加题目</h2>
    <a-form
      class="questionAddForm"
      :model="form"
      :style="{ width: '600px' }"
      label-align="left"
      @submit="handleSubmit"
    >
      <a-form-item field="title" label="题目标题">
        <a-input v-model="form.title" placeholder="请输入题目标题..." />
      </a-form-item>
      <a-form-item field="tags" label="题目标签">
        <a-input-tag
          :style="{ width: '320px' }"
          placeholder="请输入题目标签（可选项）"
          v-model="form.tags"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handleChange="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="题目答案">
        <MdEditor :value="form.answer" :handleChange="onAnswerChange" />
      </a-form-item>
      <a-form-item
        field="judgeConfig"
        label="题目判题配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item
            field="judgeConfig.timeLimit"
            label="时间限制"
            validate-trigger="input"
          >
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              :style="{ width: '320px' }"
              :min="0"
              placeholder="请输入时间限制..."
              mode="button"
              size="large"
              class="judgeConfig-timeLimit"
            />
          </a-form-item>
          <a-form-item
            label="内存限制"
            field="judgeConfig.memoryLimit"
            validate-trigger="input"
          >
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              :style="{ width: '320px' }"
              :min="0"
              placeholder="请输入内存限制..."
              mode="button"
              size="large"
              class="judgeConfig-memoryLimit"
            />
          </a-form-item>
          <a-form-item
            label="空间限制"
            field="judgeConfig.stackLimit"
            validate-trigger="input"
          >
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              :style="{ width: '320px' }"
              :min="0"
              placeholder="请输入空间限制..."
              mode="button"
              size="large"
              class="judgeConfig-stackLimit"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        field="测试用例"
        label="测试用例"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :field="`judgeCaseItem[${index}]`"
          :key="`测试用例-${index}`"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`judgeCaseItem[${index}].input`"
              :label="`输入用例 ${index}`"
              :key="`input-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例..."
              />
            </a-form-item>
            <a-form-item
              :field="`judgeCaseItem[${index}].output`"
              :label="`输出用例 ${index}`"
              :key="`output-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例..."
              />
            </a-form-item>
            <div style="margin-bottom: 32px">
              <a-button
                @click="handleDelete(index)"
                status="danger"
                :disabled="form.judgeCase?.length === 1"
                >删除
              </a-button>
            </div>
          </a-space>
        </a-form-item>
        <div style="margin-bottom: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-bottom: 16px"></div>
      <div style="margin-bottom: 16px">
        <a-form-item>
          <a-button html-type="submit" type="primary" style="min-width: 200px">
            提交
          </a-button>
        </a-form-item>
      </div>
    </a-form>
    {{ form }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MdEditor from "@/components/MdEditor.vue";
import {
  QuestionAddRequest,
  QuestionEditRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";

/**
 * 后端添加题目API格式：
 * {
 *   "answer": "",    // 文本编辑器
 *   "content": "",   // 文本编辑器
 *   "title": "",     // 字符串输入
 *   "tags": [],      // 标签输入框
 *   "judgeCase": [   // {input1, output1}, {input2, output2}
 *     {
 *       "input": "",
 *       "output": ""
 *     }
 *   ],
 *   "judgeConfig": {
 *     "memoryLimit": 0,
 *     "timeLimit": 0,
 *     "stackLimit": 0
 *   }
 * }
 */

// 定义表单响应式变量
const form = ref({
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  tags: [],
  title: "",
});

// 根据当前路由的url，判断当前组件是添加/更新题目
const route = useRoute();
// 如果路由 url 包含 id，那就为更新页面。反之则为添加页面
const editPage = route.fullPath.includes("id");

onMounted(() => {
  // 如果是更新页面，那就需要预先加载题目数据
  if (editPage) {
    loadQuestionToEdit();
  }
});

// 根据题目id，预先加载题目数据
const loadQuestionToEdit = async () => {
  // 直接获取路由参数中的 id 字段
  const id = route.query.id as any;
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(id);

  // 填充数据
  if (res.code === 0) {
    form.value = res.data as any;
    // 如果题目的测试案例/答案为空（后端脱敏原因），则需初始化
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    }

    // // 如果题目判题配置为空（用户未给题目判题配置），则需要初始化
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      // 后端 jackson序列化时，添加了 Long 转 json 精度丢失的配置，因此前端取到数据后，需要从json字符串转换回 long
      form.value.judgeConfig = {
        timeLimit: Number(form.value.judgeConfig.timeLimit),
        memoryLimit: Number(form.value.judgeConfig.memoryLimit),
        stackLimit: Number(form.value.judgeConfig.stackLimit),
      };
    }
  } else {
    message.error("预先获取题目数据失败：" + res.message);
  }
};

// 表单提交事件
const handleSubmit = async () => {
  // 修改题目
  if (editPage) {
    const res = await QuestionControllerService.editQuestionUsingPost(
      form.value as QuestionEditRequest
    );

    if (res.code === 0) {
      message.success("题目修改成功！");
    } else {
      message.error("题目修改失败：" + res.message);
    }
  }
  // 添加题目
  else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value as QuestionAddRequest
    );

    if (res.code === 0) {
      message.success("题目创建成功！");
    } else {
      message.error("题目创建失败：" + res.message);
    }
  }
};

// MdEditor 组件内容变化事件（包含题目内容和答案）
const onContentChange = (v: string) => {
  form.value.content = v;
};
const onAnswerChange = (v: string) => {
  form.value.answer = v;
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};
/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase?.splice(index, 1);
};
</script>

<style scoped>
#addQuestionView {
  margin-left: 50px;
}
</style>
