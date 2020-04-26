# myoffline-webpack-plugin

Generate a compressed archive of compiled assets.

## Getting Started

To begin, you'll need to install myoffline-webpack-plugin:

```bash
$ npm install myoffline-webpack-plugin --save-dev
```

Then add the plugin to your webpack config. For example:

**webpack.config.js**

```js
const MyOfflinePlugin = require('myoffline-webpack-plugin');

module.exports = {
  plugins: [new MyOfflinePlugin()],
};
```

And run webpack via your preferred method.

## Options

### test
Type: `String|RegExp|Array<String|RegExp>` Default: `undefined`

Test to match files against.

```js
// in your webpack.config.js
new CompressionPlugin({
  test: /\.js(\?.*)?$/i,
});
```

### include

Type: `String|RegExp|Array<String|RegExp>` Default: `undefined`

Files to include.

```js
// in your webpack.config.js
new CompressionPlugin({
  include: /\/includes/,
});
```

### exclude

Type: `String|RegExp|Array<String|RegExp>` Default: `undefined`

Files to exclude.

```js
// in your webpack.config.js
new CompressionPlugin({
  exclude: /\/excludes/,
});
```

### filename

Type: `String|Function` Default: `${Date.now()}.zip`

The target asset filename.

### format

Type: `String` Default: `zip`

The compression format.

```
// in your webpack.config.js
new CompressionPlugin({
  format: 'zip',
});
```

### formatOptions

Type: `Object` Default: `{}`

format options. 

```
// in your webpack.config.js
new CompressionPlugin({
  formatOptions: {
    zlib: {
      level: 9,
    },
  },
});
```

### deleteOriginalAssets

Type: `Boolean` Default: `false`

Whether to delete the original assets or not.

```js
// in your webpack.config.js
new CompressionPlugin({
  deleteOriginalAssets: true,
});
```