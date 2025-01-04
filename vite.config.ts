import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const latestCommitHash = '';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      },
    },
    assetsInlineLimit: 2048,
  },
  define: {
    LATEST_COMMIT_HASH: JSON.stringify(
      latestCommitHash + (process.env.NODE_ENV === 'production' ? '' : ' (dev)'),
    ),
  },
  envDir: 'env',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
