import { Storage } from "@capacitor/storage"
import { isPlatform } from "@ionic/react"
import { Encrypt } from "./Encrypt"

export class FileManager {
	static async writeData(data: Family) {
		if (!isPlatform("capacitor")) {
			localStorage.setItem("familyData", Encrypt.encrypt(data))
		}
		await Storage.set({
			key: "familyData",
			value: Encrypt.encrypt(data),
		})
	}

	static async readFile(): Promise<Family> {
		console.log(!isPlatform("capacitor"))
		if (!isPlatform("capacitor")) {
			return Encrypt.decrypt(localStorage.getItem("familyData") ?? "{}")!
		}
		console.log("mobile")
		return Encrypt.decrypt(
			(
				await Storage.get({
					key: "familyData",
				})
			).value ?? ""
		)!
	}

	static async deleteFile(): Promise<void> {
		if (!isPlatform("capacitor")) {
			await localStorage.removeItem("familyData")
			return
		}
		return await Storage.remove({
			key: "familyData",
		})
	}
}
