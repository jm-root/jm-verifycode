# jm-verifycode

verify code

## run:

npm start

## run in cluster mode:

npm run cluster

## config

基本配置 请参考 [jm-server] (https://github.com/jm-root/jm-server)

redis [] Redis数据库uri

secret [''] 密钥

verifyCodeKey ['verifycode'] Redis数据库主键

verifyCodeExpire [60] 验证码过期时间, 单位秒(可选)
