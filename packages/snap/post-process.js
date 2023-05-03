/* eslint-disable */
const fs = require('fs');
const pathUtils = require('path');

const bundlePath = pathUtils.join('dist', 'snap.js');
console.log('Bundle path', bundlePath);

let bundleString = fs.readFileSync(bundlePath, 'utf8');

// Alias `window` as `self`
// bundleString = 'var self = window;\n'.concat(bundleString);
bundleString = 'var Worker = {};\n'.concat(bundleString);

// Remove useless "stdlib" argument from bignumber.js asm module
// bundleString = bundleString
//   .replace(
//     `module.exports = function decodeAsm (stdlib, foreign, buffer) {`,
//     `module.exports = function decodeAsm (foreign, buffer) {`,
//   )
//   .replace(/stdlib\./gu, '');

// // Remove readonly assignment
// bundleString = bundleString.replace(
//   `Gp[iteratorSymbol] = function() {
//     return this;
//   };`,
//   '',
// );
// Remove eval
bundleString = bundleString.replaceAll(
  `eval(`,
  'evalIn(',
);
// Remove eval
bundleString = bundleString.replaceAll(
  `process.browser`,
  'true',
);// Remove eval
bundleString = bundleString.replaceAll(
  `Response,
      Request,`,
  'Request,',
);
// fix promise
bundleString = bundleString.replaceAll(
  `new Function('return this;')().Promise`,
  'Promise',
);
// fix webWorker
// bundleString = bundleString.replaceAll(
//   `tm.pOneT = wasm.pOneT;`,
//   `tm.pOneT = wasm.pOneT;
//                 return tm;`,
// );
// fix single thread
bundleString = bundleString.replaceAll(
  `if (singleThread)`,
  `if (true)`,
);
// fix single thread
bundleString = bundleString.replaceAll(
  `singleThread: singleThread ? true : false`,
  `singleThread: true`,
);
// bundleString = bundleString.replaceAll(
//   `if (true)`,
//   `if (1===1)`,
// );
// // fix promise
// bundleString = bundleString.replaceAll(
//   `"default": () => buildThreadManager`,
//   '"default": () => () => {}',
// );
// undefined Response
bundleString = bundleString.replaceAll(
  `class ResponseWithURL extends Response {
      constructor(url, body, options) {
        super(body, options);
        Object.defineProperty(this, 'url', {
          value: url
        });
      }
    }`,
  '',
);

// Fix TextEncoder and TextDecoder
bundleString = bundleString.replace(
  'const textEncoder = new TextEncoder();',
  '',
);

bundleString = bundleString.replace(
  'const textDecoder = new TextDecoder();',
  '',
);
bundleString = bundleString.replace('textEncoder.', 'new TextEncoder().');
bundleString = bundleString.replace('textDecoder.', 'new TextDecoder().');

// Fix import error
bundleString = bundleString.replaceAll('.import(', '.importPKey(');
bundleString = bundleString.replaceAll('import(args)', 'importPKey(args)');

// Fix root errors
bundleString = bundleString.replaceAll(
  "var coreJsData = root['__core-js_shared__'];",
  "if(root) {var coreJsData = root['__core-js_shared__'];}",
);

bundleString = bundleString.replaceAll(
  'var Symbol = root.Symbol',
  'if(root)var Symbol = root.Symbol',
);

bundleString = bundleString.replaceAll(
  'var Buffer = moduleExports ? root.Buffer : undefined,',
  'if(root)var Buffer = moduleExports ? root.Buffer : undefined,',
);

bundleString = bundleString.replaceAll(
  `process.env.NODE_ENV === 'production'`,
  `true`,
);

bundleString = bundleString.replaceAll(
  `Gp[iteratorSymbol]`,
  `Gp.iteratorSymbol`,
);

// Remove 'use asm' tokens; they cause pointless console warnings
bundleString = bundleString.replace(/^\s*'use asm';?\n?/gmu, '');

// workaround to be able to find the keys for a did:pkh:hedera.
bundleString = bundleString.replace(
  'let vmEthAddr = getEthereumAddress(verificationMethod);',
  "if (verificationMethod.blockchainAccountId?.startsWith('hedera')) { return true; };let vmEthAddr = getEthereumAddress(verificationMethod);",
);

fs.writeFileSync(bundlePath, bundleString);
