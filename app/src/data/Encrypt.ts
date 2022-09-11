import CryptoJS from "crypto-js"
import { appState } from "./AppState"

const OPTIONS = {
	format: CryptoJS.format.OpenSSL,
	padding: CryptoJS.pad.AnsiX923,
}

export class Encrypt {
	static getKey(): string {
		const storedK = appState.key
		const k = CryptoJS.AES.decrypt(storedK, "z$C&F)J@NcRfTjWnabcdef!A%D*G-abc", OPTIONS).toString(CryptoJS.enc.Utf8)
		return k
	}

	static storeKey(key: string): void {
		appState.loaded = true
		if (key === "") return
		appState.key = CryptoJS.AES.encrypt(key, "z$C&F)J@NcRfTjWnabcdef!A%D*G-abc", OPTIONS).toString(
			CryptoJS.format.OpenSSL
		)
	}

	static encrypt(data: Family): string {
		console.log("req encrypt")
		console.log(data)
		console.log(this.getKey())
		const stringified = JSON.stringify(data)
		const ciphertext = CryptoJS.AES.encrypt(stringified, this.getKey(), OPTIONS).toString(CryptoJS.format.OpenSSL)
		return ciphertext
	}

	static decrypt(ciphertext: string): Family {
		console.log(this.getKey())
		const stringified = CryptoJS.AES.decrypt(ciphertext, this.getKey(), OPTIONS).toString(CryptoJS.enc.Utf8)
		console.log(ciphertext)
		console.log(stringified)
		const data = JSON.parse(stringified)!
		return data
	}
}
