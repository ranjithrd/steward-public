import { appState } from "./../../data/AppState"
import { AlertOptions } from "@ionic/react"
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions"
import { http } from "../../data/http"
import { Device } from "@capacitor/device"
import NodeRSA from "node-rsa"
import CryptoJS from "crypto-js"
import { Encrypt } from "../../data/Encrypt"

const OPTIONS = {
	format: CryptoJS.format.OpenSSL,
	padding: CryptoJS.pad.AnsiX923,
}

export class KeyModule {
	static encryptKey(key: string): string {
		return CryptoJS.AES.encrypt(key, "mB4DDmWEDaJLWYk1ETvYI0GjoJLLAmny", OPTIONS).toString(CryptoJS.format.OpenSSL)
	}

	static decryptKey(cipherText: string): string {
		return CryptoJS.AES.decrypt(cipherText, "mB4DDmWEDaJLWYk1ETvYI0GjoJLLAmny", OPTIONS).toString(CryptoJS.enc.Utf8)
	}

	static async storeKeys() {
		;(async () => {
			console.log("starting to store keys")
			console.log(appState)
			console.log(appState.publicKey === "")
			console.log(appState.privateKey === "")
			const key = new NodeRSA()
			const newKey = key.generateKeyPair()
			const publicKey = newKey.exportKey("public")
			const privateKey = newKey.exportKey("private")
			appState.publicKey = publicKey
			appState.privateKey = this.encryptKey(privateKey)
			console.log("completed storing keys")
		})()
	}

	static async startShare(
		presentAlert: (options: AlertOptions & HookOverlayOptions) => Promise<void>,
		presentToast: (
			message: string,
			duration?: number | undefined
		) => Promise<void> | ((options: AlertOptions & HookOverlayOptions) => Promise<void>),
		code: number
	) {
		presentToast("Generating keys...", 1000)
		await this.storeKeys()
		presentToast("Attempting to join family...", 500)
		const devInfo = await Device.getInfo()
		const id = (
			await http.post("/device/register", {
				deviceDetails: {
					os: devInfo.operatingSystem.valueOf(),
					manufacturer: devInfo.manufacturer,
					name: devInfo.name ?? "Web",
				},
				publicKey: appState.publicKey,
				requestingFamily: code,
				notificationId: (await Device.getId()).uuid,
			})
		).data
		appState.deviceId = id ?? ""
		presentToast("Request to join family sent.", 1000)
	}

	static async approveShare(deviceId: string, publicKey: string, alert: Function) {
		try {
			const rsa = new NodeRSA()
			rsa.importKey(publicKey, "public")
			const rsaEncKey = rsa.encrypt(Encrypt.getKey(), "base64")
			console.log(deviceId)
			console.log(publicKey)
			console.log(rsaEncKey)
			await http
				.post("/device/approve", {
					familyCode: appState.familyCode,
					familyId: appState.familyId,
					familyKey: rsaEncKey,
					deviceId: deviceId,
					approval: true,
				})
				.catch((e) => alert(`${e}`))
				.then(() => alert("Approved"))
		} catch (e) {
			alert(`${e}`)
		}
	}

	static async denyShare(deviceId: string) {
		http.post("/device/approve", {
			deviceId,
			approval: false,
		})
	}

	static async enterFamily(key: string) {
		const rsa = new NodeRSA()
		const pKey = this.decryptKey(appState.privateKey)
		rsa.importKey(pKey, "private")
		const famKey = rsa.decrypt(Buffer.from(key, "base64"), "utf8")
		console.log(famKey)
		Encrypt.storeKey(famKey)
	}
}
