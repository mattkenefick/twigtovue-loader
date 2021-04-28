'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options) {
    return function (id, tokens, pathToTwig) {
        var includes = [];
        var resourcePath = _mapcache2.default.get(id);

        /**
         * Attempt to find dependencies of this file
         */
        var processDependency = function processDependency(token) {
            var relativePath = void 0;

            if (!/^[.\/]/.test(token.value)) {
                var _resolvedPath = void 0;

                (options.paths || []).some(function (templatePath) {
                    _resolvedPath = _path2.default.resolve(templatePath, token.value);
                    if (_fs2.default.existsSync(_resolvedPath)) {
                        relativePath = './' + _path2.default.relative(_path2.default.dirname(resourcePath), _resolvedPath);

                        includes.push(relativePath);
                        token.value = (0, _hasha2.default)(_resolvedPath);
                        return true;
                    }
                });
            } else {
                relativePath = token.value;
                resolvedPath = _path2.default.resolve(_path2.default.dirname(resourcePath), token.value);
                includes.push(relativePath);
                token.value = (0, _hasha2.default)(resolvedPath);
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
                        _underscore2.default.each(token.token.output, processToken);
                        break;
                    case 'Twig.logic.type.extends':
                    case 'Twig.logic.type.include':
                        _underscore2.default.each(token.token.stack, processDependency);
                        break;
                    case 'Twig.logic.type.embed':
                        _underscore2.default.each(token.token.output, processToken);
                        _underscore2.default.each(token.token.stack, processDependency);
                        break;
                    case 'Twig.logic.type.import':
                    case 'Twig.logic.type.from':
                        if (token.token.expression != '_self') {
                            _underscore2.default.each(token.token.stack, processDependency);
                        }
                        break;
                }
            }
        };

        var parsedTokens = JSON.parse(tokens);

        _underscore2.default.each(parsedTokens, processToken);

        var opts = Object.assign({}, options.twigOptions, {
            allowInlineIncludes: true,
            id: id,
            data: parsedTokens,
            rethrow: true
        });

        var output = ['var Twig = require("' + pathToTwig + '"),', '    template = Twig.twig(' + JSON.stringify(opts) + ');\n'];

        output.push('\n            if(module && module.hot) {\n                Twig.cache(false);\n            }\n        ');

        if (options.extender) {
            output.push('require("' + options.extender + '").default(Twig);\n');
        }

        output.push('module.exports = function(context) { return template.render(context); }');

        if (includes.length > 0) {
            _underscore2.default.each(_underscore2.default.uniq(includes), function (file) {
                output.unshift("require(" + JSON.stringify(file) + ");\n");
            });
        }

        return output.join('\n');
    };
};

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hasha = require('hasha');

var _hasha2 = _interopRequireDefault(_hasha);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _mapcache = require('./mapcache.js');

var _mapcache2 = _interopRequireDefault(_mapcache);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * Exports a function
 */