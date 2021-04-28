import _ from 'underscore';
import fs from 'fs';
import hashGenerator from 'hasha';
import loaderUtils from 'loader-utils';
import cachedTemplates from './mapcache.js';
import path from 'path';

/**
 * Exports a function
 */
export default function(options) {
    return function(id, tokens, pathToTwig) {
        var includes = [];
        var resourcePath = cachedTemplates.get(id);

        /**
         * Attempt to find dependencies of this file
         */
        var processDependency = function(token) {
            let relativePath;

            if (!/^[.\/]/.test(token.value)) {
                let resolvedPath;

                (options.paths || []).some(templatePath => {
                    resolvedPath = path.resolve(templatePath, token.value);
                    if (fs.existsSync(resolvedPath)) {
                        relativePath = './' + path.relative(
                            path.dirname(resourcePath),
                            resolvedPath,
                        );

                        includes.push(relativePath);
                        token.value = hashGenerator(resolvedPath);
                        return true;
                    }
                });
            }
            else {
                relativePath = token.value;
                resolvedPath = path.resolve(
                    path.dirname(resourcePath),
                    token.value,
                );
                includes.push(relativePath);
                token.value = hashGenerator(resolvedPath);
            }
        };

        var processToken = function(token) {
            if (token.type == 'logic' && token.token.type) {
                switch(token.token.type) {
                    case 'Twig.logic.type.block':
                    case 'Twig.logic.type.if':
                    case 'Twig.logic.type.elseif':
                    case 'Twig.logic.type.else':
                    case 'Twig.logic.type.for':
                    case 'Twig.logic.type.spaceless':
                    case 'Twig.logic.type.macro':
                        _.each(token.token.output, processToken);
                        break;
                    case 'Twig.logic.type.extends':
                    case 'Twig.logic.type.include':
                        _.each(token.token.stack, processDependency);
                        break;
                    case 'Twig.logic.type.embed':
                        _.each(token.token.output, processToken);
                        _.each(token.token.stack, processDependency);
                        break;
                    case 'Twig.logic.type.import':
                    case 'Twig.logic.type.from':
                        if (token.token.expression != '_self') {
                            _.each(token.token.stack, processDependency);
                        }
                        break;
                }
            }
        };

        var parsedTokens = JSON.parse(tokens);

        _.each(parsedTokens, processToken);

        var opts = Object.assign({}, options.twigOptions, {
            allowInlineIncludes: true,
            id: id,
            data: parsedTokens,
            rethrow: true,
        });

        var output = [
            'var Twig = require("' + pathToTwig + '"),',
            '    template = Twig.twig(' + JSON.stringify(opts) + ');\n',
        ];

        output.push(`
            if(module && module.hot) {
                Twig.cache(false);
            }
        `);

        if (options.extender) {
            output.push(
                'require("' + options.extender + '").default(Twig);\n'
            );
        }

        output.push(
            'module.exports = function(context) { return template.render(context); }'
        );

        if (includes.length > 0) {
            _.each(_.uniq(includes), function(file) {
                output.unshift("require("+ JSON.stringify(file) +");\n");
            });
        }

        return output.join('\n');
    };
};
