"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _loaderUtils = require("loader-utils");

var _mapcache = _interopRequireDefault(require("./mapcache.js"));

var _compiler = _interopRequireDefault(require("./compiler.js"));

var _hasha = _interopRequireDefault(require("hasha"));

var _path = _interopRequireDefault(require("path"));

var _twig = _interopRequireDefault(require("twig"));

var _twigtovuejs = require("twigtovuejs");

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
}; // Do not cache Twig templates

_twig["default"].cache(false);
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


function _default(source, filepath) {
  var module = this === undefined ? false : true;
  filepath = filepath || this.resource;
  var path = module ? this.resource : filepath || '',
      // var path = require.resolve(module ? this.resource : (filepath || '')),
  allowInlineIncludes = true,
      id = (0, _hasha["default"])(path),
      options = module ? (0, _loaderUtils.getOptions)(this) || {} : {},
      tpl; // Validate options for webpack

  (0, _schemaUtils["default"])(schema, options, 'twigtovue-loader'); // Process to Vue

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

  tpl = 'module.exports = `' + source + '`'; // Send compiled template back

  this.callback(null, tpl);
}

;