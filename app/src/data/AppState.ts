import { proxy } from "valtio"
import { Storage } from "@capacitor/storage"
import { isEqual } from "lodash"

export const appState = proxy({
	key: "",
	hasFamily: false,
	hasPaid: false,
	familyId: "",
	familyCode: 0,
	currency: "",
	hasDecimals: true,
	loaded: false,
	savedTags: [""],
	savedItemTags: [""],
	notificationToken: "",
	publicKey: "",
	privateKey: "",
	deviceId: "",
	token: "",
	debugOutput: "",
})

export async function syncState(): Promise<void> {
	console.log("syncing app state")
	// fetch storage key
	const key = "XRHS9Yy4CDTnbMZKL9dUapYUxMaWFY"
	// get stored data
	const currStorage = JSON.parse(
		(
			await Storage.get({
				key,
			})
		).value ?? "{}"
	)
	if (isEqual(currStorage, {})) {
		Storage.set({
			key,
			value: JSON.stringify({ ...appState, loaded: undefined }),
		})
		appState.loaded = true
		return
	}
	// check if any diff between app state and stored
	console.log(currStorage)
	if (isEqual(currStorage, appState)) {
		console.log(currStorage, appState)
		return
	} else {
		console.log(appState)
		if (appState.loaded) {
			console.log(appState)
			// if app state is master
			Storage.set({
				key,
				value: JSON.stringify({ ...appState, loaded: undefined }),
			})
		} else {
			// if storage has recent data
			appState.key = currStorage.key
			appState.hasFamily = currStorage.hasFamily
			appState.hasPaid = currStorage.hasPaid
			appState.familyCode = currStorage.familyCode
			appState.familyId = currStorage.familyId
			appState.savedTags = currStorage.savedTags ?? []
			appState.savedItemTags = currStorage.savedItemTags ?? []
			appState.notificationToken = currStorage.notificationToken ?? ""
			appState.publicKey = currStorage.publicKey ?? ""
			appState.privateKey = currStorage.privateKey ?? ""
			appState.deviceId = currStorage.deviceId ?? ""
			appState.token = currStorage.token ?? ""
			appState.debugOutput = currStorage.debugOutput ?? ""
			appState.loaded = true
		}
	}
}
