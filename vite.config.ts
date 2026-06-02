import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        tailwindcss(),
        paraglideVitePlugin({
            project: './project.inlang',
            outdir: './src/lib/paraglide',
            strategy: ['url', 'cookie', 'baseLocale'],
        }),
        sveltekit(),
    ],
    test: {
        include: ["src/**/*.test.ts"],
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            include: ["src/lib/**"],
            exclude: ["src/lib/paraglide/**", "src/lib/**/*.test.ts"],
        },
    },
});
