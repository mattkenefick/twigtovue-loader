"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _underscore = _interopRequireDefault(require("underscore"));

var _fs = _interopRequireDefault(require("fs"));

var _hasha = _interopRequireDefault(require("hasha"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _mapcache = _interopRequireDefault(require("./mapcache.js"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Exports a function
 */
function _default(options) {
  return function (id, tokens, pathToTwig) {
    var includes = [];

    var resourcePath = _mapcache["default"].get(id);
    /**
     * Attempt to find dependencies of this file
     */


    var processDependency = function processDependency(token) {
      var relativePath;

      if (!/^[.\/]/.test(token.value)) {
        var _resolvedPath;

        (options.paths || []).some(function (templatePath) {
          _resolvedPath = _path["default"].resolve(templatePath, token.value);

          if (_fs["default"].existsSync(_resolvedPath)) {
            relativePath = './' + _path["default"].relative(_path["default"].dirname(resourcePath), _resolvedPath);
            includes.push(relativePath);
            token.value = (0, _hasha["default"])(_resolvedPath);
            return true;
          }
        });
      } else {
        relativePath = token.value;
        resolvedPath = _path["default"].resolve(_path["default"].dirname(resourcePath), token.value);
        includes.push(relativePath);
        token.value = (0, _hasha["default"])(resolvedPath);
      }
    };

    var processToken = function processToken(token) {
      if (token.type == 'logic' && token.token.type) {
        switch (token.token.type) {
          case 'Twig.logic.type.block':
          case 'Twig.logic.type.if':
          case 'Twig.logic.type.elseif':
          case 'Twig.logic.type.else':
          case 'Twig.logic.type.for':
          case 'Twig.logic.type.spaceless':
          case 'Twig.logic.type.macro':
            _underscore["default"].each(token.token.output, processToken);

            break;

          case 'Twig.logic.type.extends':
          case 'Twig.logic.type.include':
            _underscore["default"].each(token.token.stack, processDependency);

            break;

          case 'Twig.logic.type.embed':
            _underscore["default"].each(token.token.output, processToken);

            _underscore["default"].each(token.token.stack, processDependency);

            break;

          case 'Twig.logic.type.import':
          case 'Twig.logic.type.from':
            if (token.token.expression != '_self') {
              _underscore["default"].each(token.token.stack, processDependency);
            }

            break;
        }
      }
    };

    var parsedTokens = JSON.parse(tokens);

    _underscore["default"].each(parsedTokens, processToken);

    var opts = Object.assign({}, options.twigOptions, {
      allowInlineIncludes: true,
      id: id,
      data: parsedTokens,
      rethrow: true
    });
    var output = ['var Twig = require("' + pathToTwig + '"),', '    template = Twig.twig(' + JSON.stringify(opts) + ');\n'];
    output.push("\n            if(module && module.hot) {\n                Twig.cache(false);\n            }\n        ");

    if (options.extender) {
      output.push('require("' + options.extender + '").default(Twig);\n');
    }

    output.push('module.exports = function(context) { return template.render(context); }');

    if (includes.length > 0) {
      _underscore["default"].each(_underscore["default"].uniq(includes), function (file) {
        output.unshift("require(" + JSON.stringify(file) + ");\n");
      });
    }

    return output.join('\n');
  };
}

;