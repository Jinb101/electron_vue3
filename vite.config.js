import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import  tailwindcss from 'tailwindcss'
import  autoprefixer from 'autoprefixer'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      viteCompression(),
    ],
    base: process.env.ELECTRON === "true" ? './' : "./",
    server: {
      // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      host: '0.0.0.0',
      port: 5173, // 服务器端口号
      open: false, // 是否自动打开浏览器
      // 代理
      proxy: {
        [env.VITE_ENV]: {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          // logLevel: "debug",
          // pathRewrite: { [`^/${env.VITE_ENV}`]: "" },
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_ENV), " "),
          bypass(req, res, options) {
            const proxyUrl = req.originalUrl.replace(
              env.VITE_ENV,
              ""
            );
            req.headers["x-req-proxy"] = proxyUrl;
            const realUrl = options.target; // 替换请求路径中的 /dev
            res.setHeader("x-res-proxy", realUrl + proxyUrl);
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
            autoprefixer
        ]
      }
    },
    build: {
      // 默认是esbuild,但这里需要改成terser，并且想使用terser的话，需提前安装，命令为npm add -D
      //terser
      minify: "terser",
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})