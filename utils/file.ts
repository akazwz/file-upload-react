import CryptoJs from 'crypto-js'
import encHex from 'crypto-js/enc-hex'

export interface Encoder{
	stringify(wordArray: WordArray): string;

	parse(str: string): WordArray;
}

export interface WordArray{
	words: number[];
	sigBytes: number;

	toString(encoder?: Encoder): string;

	concat(wordArray: WordArray): this;

	clamp(): void;

	clone(): WordArray;
}

export interface Hasher{
	reset(): void;

	update(messageUpdate: WordArray | string): this;

	finalize(messageUpdate?: WordArray | string): WordArray;
}

const hashFileInternal = async(file: Blob, algo: Hasher, chunkSize: number): Promise<string> => {
	let promise = Promise.resolve()
	// chunks
	for (let index = 0; index < file.size; index += chunkSize) {
		promise = promise.then(() => hashBlob(file.slice(index, index + chunkSize)))
	}

	/* arraybuffer to word array */
	function arrayBufferToWordArray(ab: ArrayBuffer) {
		const i8a = new Uint8Array(ab)
		const a = []
		for (let i = 0; i < i8a.length; i += 4) {
			a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3])
		}
		return CryptoJs.lib.WordArray.create(a, i8a.length)
	}

	/* hash blob */
	const hashBlob = (blob: Blob) => {
		return new Promise<void>((resolve) => {
			const reader = new FileReader()
			reader.onload = ({ target }) => {
				if (!target!.result) return
				if (typeof target!.result === 'string') return
				const wordArray = arrayBufferToWordArray(target!.result)
				// update hash
				algo.update(wordArray)
				resolve()
			}
			reader.readAsArrayBuffer(blob)
		})
	}

	return promise.then(() => encHex.stringify(algo.finalize()))
}

type Algo = 'md5' | 'sha1' | 'sha256' | 'sha224' | 'sha512' | 'sha384' | 'sha3'

const getAlgoInstance = (algo: Algo): Hasher => {
	switch (algo) {
		case 'md5':
			return CryptoJs.algo.MD5.create()
		case 'sha1':
			return CryptoJs.algo.SHA1.create()
		case 'sha256':
			return CryptoJs.algo.SHA256.create()
		case 'sha224':
			return CryptoJs.algo.SHA224.create()
		case 'sha512':
			return CryptoJs.algo.SHA512.create()
		case 'sha384':
			return CryptoJs.algo.SHA384.create()
		case 'sha3':
			return CryptoJs.algo.SHA3.create()
		default:
			return CryptoJs.algo.SHA256.create()
	}
}

export const HashFile = async(file: Blob, algo: Algo, chunkSize: number = 1024 * 1024 * 10): Promise<string> => {
	const algoInstance = getAlgoInstance(algo)
	return await hashFileInternal(file, algoInstance, chunkSize)
}
