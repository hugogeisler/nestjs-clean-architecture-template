require('ts-node').register({
    transpileOnly: true,
    require: ['tsconfig-paths/register'],
    compilerOptions: {
        module: 'commonjs',
        resolveJsonModule: true,
        baseUrl: '.',
        paths: {
            '@infrastructure/*': ['src/infrastructure/*'],
            '@domain/*': ['src/domain/*'],
            '@use-cases/*': ['src/use-cases/*'],
        },
    },
});
