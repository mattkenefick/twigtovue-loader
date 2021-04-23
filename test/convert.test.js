
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import should from 'should';
import twigtovue from 'twigtovuejs';
// import runLoader from './fakeModuleSystem.js';
import twigLoader from '../lib/loader.js';
import twig from 'twig';
const require = createRequire(import.meta.url);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('convert', function () {
    it('should convert correctly', function (done) {
        // Source path
        var template = __dirname + '/fixtures/convert/template.html.twig';

        // Contents of template
        var source = fs.readFileSync(template, 'utf-8');

        // Process to Vue
        source = twigtovue.convert(source);

        // TwigLoader produces:
        //     var Twig = require("twig"),
        //     template = Twig.twig({"allowInlineIncludes":true,"id":"bd4dd928a49b9fa6b345d006943f20e44dbd1c4753da304570a7fa9909b99031fac3144d5cd7b9889dcdaa56e9a5c799117720fbc778cc8ed1aabdf8948743df","data":[{"type":"raw","value":"<p :class=\"foo\">Template</p>"}],"rethrow":true});
        //     if(module && module.hot) {
        //         Twig.cache(false);
        //     }
        //     module.exports = function(context) { return template.render(context); }

        // Twig options
        // const twigOptions = JSON.parse(twigLoader(source, template));

        // // Renderable Twig object
        // const twigTemplate = twig.twig(twigOptions);

        // // HTML
        // const html = twigTemplate.render(context);

        // Output
        console.log('Successful template:', html);
    });
});
