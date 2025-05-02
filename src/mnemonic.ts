import * as multibase from "@atcute/multibase";
import { concat } from "@atcute/uint8array";
import * as secp from "@noble/secp256k1";
import * as bip39 from "@scure/bip39";
import { BIP39_WORDS_EN } from "./bip39.ts";

export const generateEntropy = (): Uint8Array => {
  while (true) {
    const bytes = secp.etc.randomBytes(256 / 8);
    const num = secp.etc.bytesToNumberBE(bytes);
    if (num !== 0n && num < secp.CURVE.n) {
      return bytes;
    }
  }
};

export const bufferToMnemonic = (buf: Uint8Array): string =>
  bip39.entropyToMnemonic(buf, BIP39_WORDS_EN);

export const mnemonicToBuffer = (words: string[]) =>
  words.join(" ").pipe((m) => bip39.mnemonicToEntropy(m, BIP39_WORDS_EN));

export const privToPubKey = (priv: secp.PrivKey) => secp.getPublicKey(priv);
export const exportAsDidKey = (pub: Uint8Array) => {
  const SECP256K1_PUBLIC_PREFIX = Uint8Array.from([0xe7, 0x01]);
  return `did:key:z${multibase.toBase58Btc(concat([SECP256K1_PUBLIC_PREFIX, pub]))}`;
};
