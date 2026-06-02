import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        tailwindcss(),
        paraglideVitePlugin({
            project: './project.inlang',
            outdir: './src/lib/paraglide',
            strategy: ['url', 'cookie', 'baseLocale'],
        }),
        process.env.VITEST ? svelte({ hot: false, compilerOptions: { dev: true } }) : sveltekit(),
    ],
    resolve: process.env.VITEST ? {
        alias: {
            $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
        },
        conditions: ["browser", "import", "module", "default"],
    } : undefined,
    test: {
        include: ["src/**/*.test.ts"],
        setupFiles: ["src/lib/__tests__/setup.ts"],
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            include: ["src/**"],
            exclude: ["src/lib/paraglide/**", "src/paraglide/**", "src/**/*.test.ts", "src/**/*.d.ts"],
        },
    },
});
