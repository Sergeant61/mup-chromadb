# mup-chromadb

Plugin for Meteor Up to setup and run Chromadb.

## Use

Install with `npm i -g mup-chromadb`.
Then, add to the `plugins` array in your mup config, and add a `chromadb` object.

```js
module.exports = {
  // rest of config

  plugins: ['mup-chromadb'],
  chromadb: {
    // Server to run chromadb on.
    servers: { one: {} },
    // Version of chromadb.
    version: 'latest',
    host: '127.0.0.1',
    port: '8000'
  }
}
```

Next, run

```bash
mup setup
mup reconfig
```

## Commands
- `mup chromadb setup`
- `mup chromadb start`
- `mup chromadb stop`
- `mup chromadb logs` View chromadb logs. Supports the same arguments as `mup logs`, including `--tail` and `--follow`.

