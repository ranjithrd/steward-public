import React from "react"
import { appState } from "../../data/AppState"
import OneSignal from "onesignal-cordova-plugin"
import { Device } from "@capacitor/device"
import Accept from "./Accept"

// TODO iOS implementation

export class Notifications {
	static async register(
		toast: (message: string, duration?: number | undefined) => Promise<void>,
		setScreen: (c: any) => void
	) {
		OneSignal.setAppId("46854e80-5d49-4479-b5e6-4e58d08ca25c")
		OneSignal.setNotificationOpenedHandler((e) => {
			const jsonData = e.notification.additionalData as any
			if (jsonData.type === "approve") {
				setScreen(<Accept deviceId={jsonData.deviceId ?? ""} reset={() => setScreen(undefined)} />)
				toast("Accept new device!!!", 60 * 1000)
			}
			console.log("notificationOpenedCallback: " + JSON.stringify(jsonData))
		})
		const uid = (await Device.getId()).uuid
		appState.notificationToken = uid
		OneSignal.setExternalUserId(uid)
	}
}
