import chai from 'chai'

let expect = chai.expect
import config from '../config'
import $ from '../src'

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = $(config)
let key = 'test'
describe('service', function () {
  it('add and check', function (done) {
    service.add({
      key: key,
      name: 'jeff'
    }, function (err, doc) {
      let code = doc.code
      service.check(key, code, function (err, doc) {
        expect(err === null).to.be.ok
        done()
      })
    })
  })

  it('delete', function (done) {
    service.add({
      key: key
    }, function (err, doc) {
      let code = doc.code
      service.delete(key, function (err, doc) {
        expect(err === null).to.be.ok
        done()
      })
    })
  })

  it('expire', function (done) {
    service.add({
      key: key,
      expire: 1
    }, function (err, doc) {
      let code = doc.code
      setTimeout(function () {
        service.check(key, code, function (err, doc) {
          expect(!doc).to.be.ok
          done()
        })
      }, 1500)
    })
  })
})
