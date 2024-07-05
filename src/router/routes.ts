import { RouteRecordRaw } from "vue-router";
import adminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import AccessEnum from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import ExampleView from "@/views/ExampleView.vue";
import AboutView from "@/views/AboutView.vue";
import QuestionAddView from "@/views/question/QuestionAddView.vue";
import QuestionManageView from "@/views/question/QuestionManageView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登陆",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: QuestionAddView,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: QuestionManageView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/",
    name: "浏览题目",
    component: ExampleView,
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/admin",
    name: "管理员可见",
    component: adminView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/about",
    name: "关于我的",
    // about页面需要用户登陆才能看得见
    meta: {
      access: AccessEnum.USER,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AboutView,
  },
];
