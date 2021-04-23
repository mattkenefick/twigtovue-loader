
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

        // Twig options
        const twigOptions = JSON.parse(twigLoader(source, template));

        // Renderable Twig object
        const twigTemplate = twig.twig(twigOptions);

        // HTML
        const html = twigTemplate.render(context);

        // Output
        console.log('Successful template:', html);
    });
});
