const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
})

let key = 'test'
describe('service', async () => {
  test('add and find', async () => {
    let doc2 = await service.add({
      key
    })
    doc = await service.find(key)
    expect(doc.code === doc2.code).toBeTruthy()
  })

  test('add and verify', async () => {
    let doc = await service.add({
      key
    })
    let doc2 = await service.verify(key, doc.code)
    expect(doc.code === doc2.code).toBeTruthy()
  })

  test('add code and verify', async () => {
    let doc = await service.add({
      key,
      code: '123'
    })
    expect(doc.code === '123').toBeTruthy()
    let doc2 = await service.verify(key, doc.code)
    expect(doc.code === doc2.code).toBeTruthy()
  })

  test('add and expire', async () => {
    let doc = await service.add({
      key,
      expire: 1
    })
    console.log(doc)
    expect(doc.expire === 1).toBeTruthy()
  })

  test('delete', async () => {
    let doc = await service.add({
      key
    })
    await service.delete(key)
    try {
      doc = await service.verify(key, doc.code)
    } catch (e) {
      expect(e).toBeTruthy()
    }
  })

})
