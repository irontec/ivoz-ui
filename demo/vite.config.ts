import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, PluginOption } from "vite";
import { createHtmlPlugin } from 'vite-plugin-html'
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css'
const path = require('path')

export default ({ mode }) => {

    const basePath = path.resolve(__dirname, './src');
    const env = loadEnv(mode, process.cwd());
    const base = '/';

    return defineConfig({
        base,
        plugins: [
            react({
                exclude: /.*\.tmp$/,
            }),
            createHtmlPlugin({
                inject: {
                    data: {
                      baseUrl: base,
                      buildVersion: env.VITE_BUILD_VERSION,
                    }
                  }
            }),
            reactScopedCssPlugin() as unknown as PluginOption,
        ],
        server: {
            host: true,
            port: 3000,
            proxy: {
                '/api': {
                     target: 'http://127.0.0.1:3000/',
                     secure: false,
                     rewrite: (path) => {
                        return path.replace(/^\/api/, '');
                     },
                 }
            },
            watch: {
                ignored: /.*\.tmp$/
            }
        },
        resolve: {
            alias: {
                '@irontec/ivoz-ui': `${basePath}/../../library/src`,
                'store': `${basePath}/store`,
                'entities': `${basePath}/entities`,
                'translations': `${basePath}/translations`,
                'components': `${basePath}/components`,
                'icons': `${basePath}/icons`,
            },
        },
        define: {
            "process.env.BASE_URL": `"${base}"`
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: (id, { getModuleInfo, getModuleIds }) => {

                        if (id.includes('/ivoz-ui/library/')) {
                            return 'ivoz-ui';
                        }

                        if (id.includes('/node_modules/')) {
                            return 'vendor';
                        }

                        if (
                            id.includes('ForeignKeyResolver.ts')
                            || id.includes('ForeignKeyGetter.ts')
                            || id.includes('Form.ts')
                            || id.includes('SelectOptions.ts')
                            || id.includes('/SelectOptions/')
                        ) {
                            return 'entity-modules';
                        }
                    },
                }
            }
        },
    })
}