import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...expoConfig,
  {
    ignores: ['dist/**', '.expo/**', 'node_modules/**'],
  },
  {
    files: ['App.js'],
    rules: {
      'import/no-duplicates': 'off',
      'no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
];
