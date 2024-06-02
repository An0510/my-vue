import pkg from './package.json'
import typescript from "@rollup/plugin-typescript";
export default {
  input: './src/index.ts',
  output: [ // 打包出两个模块规范
      // 1. cjs => commonjs
      // 2. esm
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true, // 启用sourcemap
    },  
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true, // 启用sourcemap
    },
  ],
  plugins: [
    typescript()
  ]
}