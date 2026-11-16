# React Compiler em React Native

**Sessão 4 · pergunta da sala:** o React Compiler funciona em React Native?

## Resposta curta

**Sim.** O React Compiler é um plugin de **Babel** que trabalha sobre os nossos componentes — não depende do DOM. Por isso funciona da mesma forma no React para a web e no React Native, com as mesmas regras:

- o código dos componentes tem de ser **puro** (senão o Compiler salta esse componente);
- nos **itens de uma lista**, o `memo` continua a fazer falta;
- `'use no memo'` continua a servir de escape hatch.

## Como se liga

### Expo

Nos projetos Expo novos, o Compiler **já vem ligado**. Está dentro do `babel-preset-expo`, que aceita uma opção `'react-compiler'` para o configurar ou desligar. Em versões mais antigas do Expo pode ser preciso ativá-lo à mão (ver a documentação do Expo).

### React Native sem Expo (Metro)

O React Native usa Babel através do Metro. Basta instalar o plugin e acrescentá-lo ao `babel.config.js`, **em primeiro lugar** (antes de outros plugins, como o do Reanimated):

```bash
npm install -D babel-plugin-react-compiler
```

```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'babel-plugin-react-compiler', // primeiro!
    // …outros plugins
  ],
};
```

### React Native antigo, ainda com React 18

Como na web: instalar também o `react-compiler-runtime` (nas `dependencies`) e configurar `target: '18'`. Abaixo do React 17 não é suportado.

## Referências

- [React Compiler — introdução (react.dev)](https://react.dev/learn/react-compiler)
- [React Compiler — instalação, incluindo Metro / React Native (react.dev)](https://react.dev/learn/react-compiler/installation)
- [React Compiler no Expo (docs.expo.dev)](https://docs.expo.dev/guides/react-compiler/)
