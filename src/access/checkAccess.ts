import accessEnum from "@/access/accessEnum";

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return boolean
 */
const checkAccess = (loginUser: any, needAccess: any) => {
  const loginUserAccess = loginUser?.userRole ?? accessEnum.NOT_LOGIN;
  if (needAccess === accessEnum.NOT_LOGIN) {
    return true;
  }
  if (needAccess === accessEnum.USER) {
    if (loginUserAccess === accessEnum.NOT_LOGIN) {
      return false;
    }
  }
  if (needAccess === accessEnum.ADMIN) {
    if (loginUserAccess !== accessEnum.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
