'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (source, filepath) {
    var module = this === undefined ? false : true;
    filepath = filepath || this.resource;
    var path = module ? this.resource : filepath || '',

    // var path = require.resolve(module ? this.resource : (filepath || '')),
    allowInlineIncludes = true,
        id = (0, _hasha2.default)(path),
        options = module ? (0, _loaderUtils.getOptions)(this) || {} : {},
        tpl;

    // Validate options for webpack
    (0, _schemaUtils2.default)(schema, options, 'twigtovue-loader');

    // Process to Vue
    source = _twigtovuejs.Converter.convert(source);

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

var _loaderUtils = require('loader-utils');

var _mapcache = require('./mapcache.js');

var _mapcache2 = _interopRequireDefault(_mapcache);

var _compiler = require('./compiler.js');

var _compiler2 = _interopRequireDefault(_compiler);

var _hasha = require('hasha');

var _hasha2 = _interopRequireDefault(_hasha);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _twig = require('twig');

var _twig2 = _interopRequireDefault(_twig);

var _twigtovuejs = require('twigtovuejs');

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is for webpack options
 */
var schema = {
    properties: {
        extender: {
            type: 'string'
        },
        twigOptions: {
            type: 'object'
        }
    },
    type: 'object'
};

// Do not cache Twig templates
_twig2.default.cache(false);

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
;