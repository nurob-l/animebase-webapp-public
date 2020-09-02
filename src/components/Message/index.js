import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'

// 封装element ui的Message, MessageBox
const message = {
  
  /** 成功消息
   * @param {string}message 消息
   */
  success: function (message) {
    Message({
      showClose: true,
      message: message,
      type: 'success'
    })
  },
  
  /** 错误消息
   * @param {string}message 消息
   */
  error: function (message) {
    Message({
      showClose: true,
      message: message,
      type: 'error'
    })
  },
  
  /** 警告确认消息
   * @param {string} message 警告消息
   */
  confirm: function (message) {
    return MessageBox.confirm(message, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
  },
  
  /** 需提交内容的消息
   * @param {string}message 警告消息
   * @param {string}inputPlaceholder 提示需要提交什么内容
   */
  prompt: function (message, inputPlaceholder) {
    return MessageBox.prompt(message, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      inputPattern: /\S/,
      inputPlaceholder: inputPlaceholder,
      inputErrorMessage: '内容不能为空'
    })
  }
}

export default message