// initial state
// const state = () => ({
//   loginUser: {
//     userName: "未登录",
//   },
// });
//
// // getters
// const getters = {};

// mutations: 尽量同步操作，对变量进行增删改查的方法
// const mutations = {
//   updateUser(state, payload) {
//     state.loginUser = payload;
//   },
// };

// actions: 执行异步操作，并且调用 mutations 的方法
// const actions = {
//   getLoginUser({ commit, state }, payload) {
//     commit("updateUser", { userName: "haha" });
//   },
// };

import { StoreOptions } from "vuex";
import { UserControllerService } from "../../generated";
import accessEnum from "@/access/accessEnum";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      const res = await UserControllerService.getLoginUserUsingGet();
      // 从远程获取登录用户信息
      if (res.code === 0) {
        console.log(res.data);
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: accessEnum.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
