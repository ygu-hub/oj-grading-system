<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 400px" />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

// codeEditorRef 用于对 DOM 组件的引用
const codeEditorRef = ref();
const codeEditor = ref();

// 定义组件属性，方便父组件拿到值
interface Props {
  value: string;
  handleChange: (value: string) => void;
}
// 给属性设置默认值（如果父组件没有传对应的值/方法内容）
const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }

  // 在组件被挂载到DOM树上后，再去初始化Monaco Editor，并将其挂载到引用的DOM元素上
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    automaticLayout: true,
    minimap: {
      enabled: true,
      autohide: true,
    },
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
    readOnly: false,
    theme: "vs-dark",
  });

  // 监听 codeEditor 的变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
