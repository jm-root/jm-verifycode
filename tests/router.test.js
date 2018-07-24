let expect = chai.expect
const config = require('../config')
const $ = require('../lib')

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
let routerTest = service.router()
describe('router', () => {
  test('get', done => {
    routerTest.get('/test', {id: 1}, function (err, doc) {
      log(err, doc)
      expect(err === null).toBeTruthy()
      done()
    })
  })

  test('check', done => {
    routerTest.get('/test', {id: 1}, function (err, doc) {
      log(err, doc)
      let code = doc.code
      routerTest.get('/test/check', {code}, function (err, doc) {
        log(err, doc)
        expect(err === null).toBeTruthy()
        done()
      })
    })
  })
})
