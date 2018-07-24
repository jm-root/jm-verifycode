const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
})

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let key = 'test'
describe('service', async () => {
  test('add and check', async () => {
    let doc = await service.add({
      key
    })
    doc = await service.verify(key, doc.code)
    expect(doc === true).toBeTruthy()
  })

  test('delete', async () => {
    let doc = await service.add({
      key
    })
    await service.delete(key)
    doc = await service.verify(key, doc.code)
    expect(doc === false).toBeTruthy()
  })

  test('expire', async () => {
    let doc = await service.add({
      key,
      expire: 1
    })
    return new Promise(resolve => {
      setTimeout(function () {
        service.verify(key, doc.code)
          .then(doc => {
            expect(!doc).toBeTruthy()
            resolve()
          })
      }, 1500)
    })
  })
})
