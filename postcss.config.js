import autoprefixer from 'autoprefixer'
import postcssPxToRem from 'postcss-pxtorem'

/** 设计稿 1920px，192px = 1rem（1920 / 10） */
export default {
  plugins: [
    autoprefixer(),
    postcssPxToRem({
      rootValue: 192,
      unitPrecision: 5,
      propList: ['*'],
      minPixelValue: 1,
      exclude: /node_modules/i
    })
  ]
}
