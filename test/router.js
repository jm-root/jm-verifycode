import chai from 'chai';
let expect = chai.expect;
import config from '../config';
import $ from '../src';

let log = function (err, doc) {
    if (err) console.error(err.stack);
    if (doc) console.log(doc);
};

let service = new $(config);
let router = service.router();
describe('router', function () {
    it('get', function (done) {
        router.get('/test', {id: 1}, function (err, doc) {
            log(err, doc);
            expect(err === null).to.be.ok;
            done();
        });
    });

    it('check', function (done) {
        router.get('/test', {id: 1}, function (err, doc) {
            log(err, doc);
            let code = doc.code;
            router.get('/test/check', {code}, function (err, doc) {
                log(err, doc);
                expect(err === null).to.be.ok;
                done();
            });
        });
    });
});
