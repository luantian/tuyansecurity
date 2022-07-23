const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,// 用户设备(desktop)
  token: state => state.user.token,// 登录Token
  avatar: state => state.user.avatar,// 用户头像
  name: state => state.user.name, // 用户名
  permission_routes: state => state.permission.routes, // 用户权限路由
}
export default getters
