<template>
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script setup lang="ts">
// 代码编辑器组件：https://github.com/bytedance/bytemd?tab=readme-ov-file#write-a-plugin
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

/**
 * 定义组件属性，方便父组件拿到值
 * 目的是子组件的属性，交由父组件来管理（取到子组件中的值，并且定义子组件中的handleChange方法），提高组件通用性
 */
interface Props {
  value: string;
  handleChange: (value: string) => void;
}
// 给属性设置默认值（如果父组件没有传对应的值/方法内容）
withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});
</script>

<style scoped>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child svg {
  display: none;
}
</style>
