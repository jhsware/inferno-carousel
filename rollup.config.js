import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'
import resolve from 'rollup-plugin-node-resolve'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.js',
  output: {
    file: `dist/index.cjs${isProduction ? '.min' : ''}.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    resolve({
      // https://github.com/rollup/rollup-plugin-node-resolve
      // use "module" field for ES6 module if possible
      module: true,
      jsnext: true,
      only: ['inferno-move', 'kapellmeister', 'd3-timer', 'd3-ease']
    }),
    babel({
      runtimeHelpers: true
    }),
    isProduction ? minify({
      comments: false,
    }) : false
  ],
  external: [
    'classnames',
    'inferno',
    'inferno-animation',
    'inferno-create-element',
    'inferno-shared',
    '@babel/runtime/helpers/defineProperty',
    '@babel/runtime/helpers/objectSpread',
    '@babel/runtime/helpers/classCallCheck',
    '@babel/runtime/helpers/createClass',
    '@babel/runtime/helpers/possibleConstructorReturn',
    '@babel/runtime/helpers/getPrototypeOf',
    '@babel/runtime/helpers/inherits',
    '@babel/runtime/helpers/assertThisInitialized'
  ]
}