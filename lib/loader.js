
import { createRequire } from 'module';
import { getOptions } from 'loader-utils';
import cachedTemplates from './mapcache.js';
import compilerFactory from './compiler.js';
import hashGenerator from 'hasha';
import path from 'path';
import Twig from 'twig';
import validateOptions from 'schema-utils';

// const require = createRequire(import.meta.url);

/**
 * This is for webpack options
 */
var schema = {
    properties: {
        extender: {
            type: 'string',
        },
        twigOptions: {
            type: 'object',
        },
    },
    type: 'object',
};

// Do not cache Twig templates
Twig.cache(false);

/**
 * `this` should represent a module system, such as
 *
 * {
 *     async: [Function: async],
 *     loaders: [ 'itself' ],
 *     loaderIndex: 0,
 *     query: '',
 *     resource: '/Users/matt/Sites/Projects/TwigToVue/twig-loader/test/fixtures/embed/template.html.twig',
 *     callback: [Function: callback],
 *     resolve: [Function: resolve],
 *     loadModule: [Function: loadModule]
 * }
 */
export default function(source, filepath) {
    // @urgent, remove me. Babel wouldn't parse the require above
    var require = {};

    var module = this === undefined ? false : true;
    var path = require.resolve(module ? this.resource : (filepath || '')),
        allowInlineIncludes = true,
        id = hashGenerator(path),
        options = module ? getOptions(this) : {},
        tpl;

    // Validate options for webpack
    validateOptions(schema, options, 'twigtovue-loader');

    //
    Twig.extend((Twig) => {
        var compiler = Twig.compiler;
        compiler.module['webpack'] = compilerFactory(options);
    });

    // Globally set hash ➔ file
    // e.g. abdcefg = my-files/template.twig
    cachedTemplates.set(id, path);

    // Run a cachable call, if exists
    module && this.cacheable && this.cacheable();

    // Instantiate Twig template
    tpl = Twig.twig({
        allowInlineIncludes,
        data: source,
        id,
        path,
    });

    // Compile Twig template
    tpl = tpl.compile({
        module: 'webpack',
        twig: 'twig'
    });

    // Send compiled template back
    module && this.callback && this.callback(null, tpl);

    return tpl;
};
