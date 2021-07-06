import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import dts from 'rollup-plugin-dts';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.peerDependencies));

function isExternalModule(m) {
  if (m.startsWith('@')) {
    return external.some((ex) => ex === m.split('/').slice(0, 2).join('/'));
  }
  return external.some((ex) => ex === m.split('/')[0]);
}

export default [{
  input: 'src/index.js',
  output: [{
    file: pkg.main,
    exports: 'named',
    format: 'cjs',
    sourcemap: true,
  }, {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  }],
  external: isExternalModule,
  plugins: [
    babel({ babelHelpers: 'runtime' }),
    nodeResolve(),
    css({ output: 'u-wave-react-server-list.css' }),
  ],
}, {
  input: './types/index.d.ts',
  output: [{ file: 'dist/u-wave-react-server-list.d.ts', format: 'es' }],
  plugins: [dts()],
}];
