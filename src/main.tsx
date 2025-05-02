import "https://char.lt/esm/pipe.ts";

import { Signal } from "@char/aftercare";
import * as secp from "@noble/secp256k1";
import { BIP39_WORDS_EN } from "./bip39.ts";
import {
  bufferToMnemonic,
  exportAsDidKey,
  generateEntropy,
  mnemonicToBuffer,
  privToPubKey,
} from "./mnemonic.ts";
import { bindText, bindValue } from "./util.ts";

const main = document.querySelector("main")!;

const mnemonic = new Signal(bufferToMnemonic(generateEntropy()));

const wordCount = new Signal(0);
const privKey = new Signal("");
const didKey = new Signal("");

mnemonic.subscribeImmediate((m) => {
  const words = m.split(/\s+/).filter((it) => BIP39_WORDS_EN.includes(it));
  wordCount.set(words.length);

  const paperKeyElem = document.querySelector(
    "form > #paper-key"
  ) as HTMLTextAreaElement;

  try {
    const pk = words.pipe(mnemonicToBuffer);
    privKey.set(pk.pipe(secp.etc.bytesToHex));
    didKey.set(pk.pipe(privToPubKey).pipe(exportAsDidKey));

    paperKeyElem?.setCustomValidity("");
  } catch (err) {
    privKey.set("");
    didKey.set("");

    paperKeyElem?.setCustomValidity(String(err));
    paperKeyElem?.reportValidity();
  }
});

main.append(
  <form>
    <label htmlFor="paper-key">
      paper key (<data _tap={bindText(wordCount)} /> / 24)
    </label>
    <button
      id="generate-paper-key"
      type="button"
      _onclick={() => mnemonic.set(bufferToMnemonic(generateEntropy()))}
    >
      generate
    </button>
    <textarea id="paper-key" rows={4} _tap={bindValue(mnemonic)} />

    <label htmlFor="public-key">public key</label>
    <input id="public-key" type="text" readOnly _tap={bindValue(didKey)} />

    <label htmlFor="private-key">private key</label>
    <input id="private-key" type="text" readOnly _tap={bindValue(privKey)} />
  </form>
);
