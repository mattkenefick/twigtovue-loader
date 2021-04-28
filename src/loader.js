
import { getOptions } from 'loader-utils';
import cachedTemplates from './mapcache.js';
import compilerFactory from './compiler.js';
import hashGenerator from 'hasha';
import path from 'path';
import Twig from 'twig';
import { Converter } from 'twigtovuejs';
import validateOptions from 'schema-utils';

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
    var module = this === undefined ? false : true;
    filepath = filepath || (this.resource);
    var path = module ? this.resource : (filepath || ''),
    // var path = require.resolve(module ? this.resource : (filepath || '')),
        allowInlineIncludes = true,
        id = hashGenerator(path),
        options = module ? (getOptions(this) || {}) : {},
        tpl;

    // Validate options for webpack
    validateOptions(schema, options, 'twigtovue-loader');

    // Process to Vue
    source = Converter.convert(source);

    /**
     * Technically for TwigToVue, we don't really want to render
     * the Twig template. We just want the source as Vue.
     *
     * There may be opportunity here to do partial renderings
     * but for now, we should just return Vue source.
     */

    // Twig.extend((Twig) => {
    //     var compiler = Twig.compiler;
    //     compiler.module['webpack'] = compilerFactory(options);
    // });

    // // Globally set hash ➔ file
    // // e.g. abdcefg = my-files/template.twig
    // cachedTemplates.set(id, path);

    // // Run a cachable call, if exists
    // this.cacheable && this.cacheable();

    // // Instantiate Twig template
    // tpl = Twig.twig({
    //     allowInlineIncludes,
    //     data: source,
    //     id,
    //     path,
    // });

    // // Compile Twig template
    // tpl = tpl.compile({
    //     module: 'webpack',
    //     twig: 'twig'
    // });

    // Override tpl
    // tpl = 'module.exports = function(context) { return `' + source + '` }';
    tpl = 'module.exports = `' + source + '`';

    // Send compiled template back
    this.callback(null, tpl);
};
