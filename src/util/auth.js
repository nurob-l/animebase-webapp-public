/** 检查用户是否已登录
 * @return {Boolean}
 */
export function isSigned () {
  const token = localStorage.getItem('token')
  const token_exp = localStorage.getItem('token_exp')
  const now_time = new Date().getTime()
  return token && now_time - token_exp <= 1000 * 60 * 60 * 24
}