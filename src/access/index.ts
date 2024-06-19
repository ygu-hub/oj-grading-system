import router from "@/router";
import store from "@/store";
import checkAccess from "@/access/checkAccess";
import accessEnum from "@/access/accessEnum";

router.beforeEach(async (to, from, next) => {
  console.log(store.state.user.loginUser);
  let loginUser = store.state.user.loginUser;
  // 如果之前没登录过，那其 userRole 会为空，则自动登陆
  if (!loginUser || !loginUser.userRole) {
    // await 是为了等待用户登陆后，在执行下面代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }

  const needAccess = to.meta.access ?? accessEnum.NOT_LOGIN;

  // 如果页面需要用户登陆才能访问
  if (needAccess !== accessEnum.NOT_LOGIN) {
    // 如果用户没有登陆成功，跳转到登录页面
    if (loginUser.userRole === accessEnum.NOT_LOGIN) {
      // 登录成功后跳转
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果用户已经登陆，但权限不足
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  // 直接登陆
  next();
});
