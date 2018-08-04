const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

describe('router', async () => {
  test('get', async () => {
    let doc = await router.get('/test')
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('get lenth=4', async () => {
    let doc = await router.get('/test', {length: 4})
    console.log(doc)
    expect(doc).toBeTruthy()
  })

  test('get code=123', async () => {
    let doc = await router.get('/test', {code: '123'})
    console.log(doc)
    expect(doc.code === '123').toBeTruthy()
  })

  test('get expire=1', async () => {
    let doc = await router.get('/test', {expire: 1})
    console.log(doc)
    expect(doc.expire === 1).toBeTruthy()
  })

  test('verify', async () => {
    let doc = await router.get('/test')
    let code = doc.code
    doc = await router.get('/test/verify', {code})
    expect(doc.code === code).toBeTruthy()
  })
})
