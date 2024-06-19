<template>
  <div id="userLoginView">
    <h2>用户登录</h2>
    <a-form
      label-align="left"
      auto-label-width
      style="max-width: 400px; margin: 0 auto"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        field=" userPassword"
        tooltip="密码不少于 8 位 "
        label="密码"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder=" 请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    alert("登陆成功" + JSON.stringify(res.data));
    // 登陆成功后，先获取当前登陆用户信息
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    Message.error("登陆失败: " + res.message);
  }
};
</script>
