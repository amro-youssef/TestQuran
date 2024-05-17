import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteJsconfigPaths from 'vite-jsconfig-paths'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/quran-memorization-tester',
    plugins: [react(), viteJsconfigPaths()],
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000, 
    },
})