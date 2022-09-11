import { Device } from "@capacitor/device"
import { Encrypt } from "./Encrypt"
import { appState } from "./AppState"
import { http } from "./http"
import { v4 } from "uuid"
import { emptyFamily, state } from "./Data"
import { Sync } from "./Sync"

export class Create {
	static async createFamily(premium: boolean, receipt?: string) {
		console.log("Create family")

		const newFamily: Family = {
			...emptyFamily,
		}

		if (appState.hasFamily && premium) {
			// throw new Error("Family already exists.")
			if (!receipt) throw new Error("Token not there")
			console.log("upgrading")
			const oldData = state.familyData
			console.log(oldData)
			const data = Encrypt.encrypt(oldData)
			console.log(data)
			const res = await http.post("/create", {
				code: appState.familyCode,
				data,
				receipt: receipt,
				deviceId: (await Device.getId()).uuid,
				premium,
			})
			console.log("req sent")
			console.log(res.data)
			if (!res.data) {
				throw Error("Server error.")
			}
			appState.hasPaid = true
			appState.hasPaid = premium
			appState.familyId = res.data?.id?.insertedId ?? ""
			appState.loaded = true
			await Sync.syncRemote()
			return
		}

		let newRandom = Math.random()
		while (newRandom <= 0.1) {
			newRandom = Math.random()
		}
		const newCode = Math.ceil(newRandom * 100 * 1000)
		const newKey =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		let newId = v4()
		await Encrypt.storeKey(newKey)
		console.log(newKey)
		console.log(Encrypt.getKey())
		console.log(newFamily)
		appState.hasFamily = true
		if (premium) {
			if (!receipt) throw new Error("Token not there")
			const res = await http.post("/create", {
				code: newCode,
				data: Encrypt.encrypt(newFamily),
				receipt: receipt,
				deviceId: (await Device.getId()).uuid,
				premium,
			})
			if (!res.data) {
				throw Error("Server error.")
			}
			newId = res.data?.id?.insertedId ?? ""
			console.log(newId)
			console.log(res.data)
			if (!res.data?.token) throw new Error("Token not returned by server.")
			console.log(res.data?.token)
			console.log(appState)
			appState.token = res.data?.token
			console.log(appState)
			console.log(appState.token)
			if (!newId) throw new Error("Wrong ID returned")
		} else {
			Sync.syncData(newFamily)
			state.familyData = newFamily
		}
		appState.familyId = newId
		appState.familyCode = newCode
		appState.hasPaid = premium
		appState.loaded = true
		await Sync.syncRemote()
	}
}
