import OSS from 'ali-oss'

export default function createOssClient (uploadPolicy) {
  return new OSS({
    region: 'oss-cn-beijing',
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
    accessKeyId: uploadPolicy.Credentials.AccessKeyId,
    accessKeySecret: uploadPolicy.Credentials.AccessKeySecret,
    stsToken: uploadPolicy.Credentials.SecurityToken,
    bucket: process.env.NODE_ENV === 'production' ? 'tuile-images' : 'tuile-images-test'
  })
}