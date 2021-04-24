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
    source = _twigtovuejs2.default.convert(source);

    //
    _twig2.default.extend(function (Twig) {
        var compiler = Twig.compiler;
        compiler.module['webpack'] = (0, _compiler2.default)(options);
    });

    // Globally set hash ➔ file
    // e.g. abdcefg = my-files/template.twig
    _mapcache2.default.set(id, path);

    // Run a cachable call, if exists
    module && this.cacheable && this.cacheable();

    // Instantiate Twig template
    tpl = _twig2.default.twig({
        allowInlineIncludes: allowInlineIncludes,
        data: source,
        id: id,
        path: path
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

var _twigtovuejs2 = _interopRequireDefault(_twigtovuejs);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const require = createRequire(import.meta.url);

/**
 * This is for webpack options
 */

// import { createRequire } from 'module';
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