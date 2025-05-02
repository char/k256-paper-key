import * as secp from "@noble/secp256k1";
import { Buffer } from "node:buffer";
import * as multibase from "npm:@atcute/multibase";
import * as bip39 from "npm:@scure/bip39";
import { BIP39_WORDS_EN } from "./bip39.ts";

export const generateMnemonic = () =>
  Buffer.from(secp.etc.randomBytes(384 / 8))
    .pipe((buf) => [buf.subarray(0, 32), buf.subarray(32)])
    .map((b) => bip39.entropyToMnemonic(b, BIP39_WORDS_EN))
    .join(" ");

export const mnemonicToBuffer = (words: string[]): Buffer =>
  [words.slice(0, 24), words.slice(24, 36)]
    .map((w) => w.join(" "))
    .map((m) => bip39.mnemonicToEntropy(m, BIP39_WORDS_EN))
    .pipe(Buffer.concat);

export const bufferToPrivKey = (buf: Buffer) => secp.etc.hashToPrivateKey(buf);
export const privToPubKey = (priv: secp.PrivKey) => secp.getPublicKey(priv);
export const exportAsDidKey = (pub: Uint8Array) => {
  const SECP256K1_PUBLIC_PREFIX = Uint8Array.from([0xe7, 0x01]);
  return `did:key:z${multibase.toBase58Btc(Buffer.concat([SECP256K1_PUBLIC_PREFIX, pub]))}`;
};
