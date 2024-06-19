<template>
  <div>
    <a-row id="globalHeader" align="center" :wrap="false">
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="@/assets/logo.png" />
              <div class="title">OJ 判题系统</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="100px">
        <div>
          {{ store.state.user.loginUser?.userName }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import AccessEnum from "@/access/accessEnum";

const router = useRouter();
const store = useStore();

// 过滤给当前用户展示的菜单页面
// 这里使用 computed 计算属性，是为了登陆用户信息发生变化时，触发 visibleRoutes 变化，从而重新渲染菜单项。
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 检查权限
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, next) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// // 获取状态变量
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "Eileen",
//     userRole: AccessEnum.ADMIN,
//   });
// }, 3000);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#globalHeader {
}

#globalHeader .logo {
  height: 48px;
}

#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

#globalHeader .title {
  color: #444;
  margin-left: 16px;
}
</style>
