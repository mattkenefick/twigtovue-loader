const fs = require('fs');
const path = require('path');
const should = require('should');
const runLoader = require('./fakeModuleSystem');
const twigLoader = require('../dist/loader').default;
const twigtovue = require('twigtovuejs').Converter;
const fixtures = path.join(__dirname, 'fixtures');

describe('convert', function() {
    it('should convert correctly', function(done) {
        var template = path.join(fixtures, 'convert', 'template.html.twig');

        // loader,
        // directory,
        // filename,
        // arg,
        // callback,
        runLoader(
            twigLoader,
            path.join(fixtures, 'convert'),
            template,
            fs.readFileSync(template, 'utf-8'),
            function(err, result) {
                if (err) throw err;

                result.should.have.type('string');
                result.should.match('<p :class="foo">Template</p>');

                done();
            },
        );

        // // Source path
        // var template = __dirname + '/fixtures/convert/template.html.twig';

        // // Contents of template
        // var source = fs.readFileSync(template, 'utf-8');

        // // Process to Vue
        // source = twigtovue.convert(source);

        // // // HTML
        // source.should.have.type('string');
        // source.should.match('<p :class="foo">Template</p>');
    });

    it('should keep variables unrendered', function(done) {
        var template = path.join(fixtures, 'convert', 'basic.html.twig');

        runLoader(twigLoader, path.join(fixtures, 'convert'), template, fs.readFileSync(template, 'utf-8'), function(err, result) {
            if (err) throw err;

            result.should.have.type('string');
            result.should.match('<p>{{ foo }}</p>');

            done();
        });
    });

    it('should convert basic conditionals', function(done) {
        var template = path.join(fixtures, 'convert', 'basic-if-else.html.twig');

        runLoader(twigLoader, path.join(fixtures, 'convert'), template, fs.readFileSync(template, 'utf-8'), function(err, result) {
            if (err) throw err;

            result.should.have.type('string');
            result.should.containEql('<h3 v-if="foo">Title</h3>');
            result.should.containEql('<div v-else-if="something == \'something\'">');

            done();
        });
    });
});
