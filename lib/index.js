const fs = require('fs');
const url = require('url');
const archiver = require('archiver');
const RawSource = require('webpack-sources/lib/RawSource');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const validateOptions = require('schema-utils');
const schema = require('./options.json');

class MyOfflinePlugin {
  constructor(options = {}) {
    validateOptions(schema, options, 'My Offline Plugin');

    const {
      test,
      include,
      exclude,
      config = {},
      format = 'zip',
      formatOptions = {},
      filename = `${Date.now()}.zip`,
      deleteOriginalAssets = true,
    } = options;

    this.options = {
      test,
      include,
      exclude,
      config,
      format,
      formatOptions,
      filename,
      deleteOriginalAssets,
    };
  }

  apply(compiler) {
    const { format, formatOptions } = this.options;
    const ext = formatOptions.gzip ? `${format}.gz` : format;
    const output = `${compiler.options.output.path}.${ext}`;
    compiler.hooks.emit.tapAsync(
      { name: 'MyOfflinePlugin' },
      (compilation, callback) => {
        const { config, deleteOriginalAssets } = this.options;
        const { assets } = compilation;

        // config.json
        const now = new Date();
        const buildAt = `${now.getFullYear()}-${now.getMonth() +
          1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        const routesStr = JSON.stringify(
          Object.keys(config).reduce((rcc, key) => {
            // eslint-disable-next-line
            rcc[key] = {
              ...config[key],
              buildAt,
            };
            return rcc;
          }, {}),
          null,
          '  '
        );
        // eslint-disable-next-line
        compilation.assets['config.json'] = {
          source: () => routesStr,
          size: () => routesStr.length,
        };

        // compression
        const archive = archiver(
          this.options.format,
          this.options.formatOptions
        );
        // eslint-disable-next-line consistent-return
        Object.keys(assets).forEach(file => {
          if (!ModuleFilenameHelpers.matchObject(this.options, file)) {
            return;
          }

          const asset = assets[file];
          let content = asset.source();

          if (!Buffer.isBuffer(content)) {
            content = Buffer.from(content);
          }

          const parse = url.parse(file);
          const { pathname } = parse;

          archive.append(content, {
            name: pathname,
          });

          if (deleteOriginalAssets) {
            delete assets[file];
          }
        });

        archive.on('end', () => {
          fs.readFile(output, (err, data) => {
            assets[this.options.filename] = new RawSource(data);
            fs.unlink(output, () => {
              callback();
            });
          });
        });
        archive.pipe(fs.createWriteStream(output));
        archive.finalize();
      }
    );
  }
}

module.exports = MyOfflinePlugin;
