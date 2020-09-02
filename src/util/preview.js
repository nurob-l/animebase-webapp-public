/** 设置预览数据，临时保存到本地
 * @param {String}value 数据
 */
export function setPreview (value) {
  sessionStorage.setItem('previewEntryData', value)
}

/** 获取临时保存到本地的预览数据
 * @return {String} 数据
 */
export function getPreview () {
  return sessionStorage.getItem('previewEntryData')
}