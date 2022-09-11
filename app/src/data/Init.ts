import { StatusBar, Style } from "@capacitor/status-bar"
import { Notifications } from "./../pages/general/Notifications"
import { isPlatform, useIonAlert, useIonToast } from "@ionic/react"
import { state } from "./Data"
import { subscribe } from "valtio"
import { Sync, SYNC_INTERVAL } from "./Sync"
import { appState, syncState } from "./AppState"
import { useEffect, useRef } from "react"

export class Init {
	static async bootState(
		toast: (message: string, duration?: number | undefined) => Promise<void>,
		setScreen: (c: any) => void
	) {
		if (isPlatform("android")) {
			Notifications.register(toast, setScreen)
		}
	}

	static ionicConfig() {
		if (isPlatform("mobile")) {
			StatusBar.setStyle({
				style: Style.Dark,
			})
			StatusBar.setBackgroundColor({
				color: "#DE5900",
			})
		}
	}
}

export async function useInitialise(setScreen: (c: React.Component) => void) {
	const [toast] = useIonToast()
	const [alert] = useIonAlert()
	const initialised = useRef(false)

	useEffect(() => {
		;(async () => {
			console.log("init")
			Init.ionicConfig()
			syncState()
			subscribe(appState, async () => {
				try {
					// throw new Error("Somerror")
					console.log(initialised.current)
					console.log(appState)
					if (initialised.current) return
					if (appState.loaded === false) {
						try {
							syncState()
							if (appState.familyId !== "") {
								Sync.syncRemote()
							}
						} catch (e) {
							console.log("Error.")
							alert(`${JSON.stringify(e)}`)
						}
					} else {
						try {
							if (appState.familyId !== "") {
								Sync.syncRemote()
							}
							const stateCb = setInterval(() => {
								if (appState.familyId) Sync.syncRemote()
							}, SYNC_INTERVAL)

							const stateUb = subscribe(state, () => {
								console.log(state.familyData)
								Sync.syncData(state.familyData)
							})
							const appUb = subscribe(appState, () => {
								Sync.reviewState()
								syncState()
							})

							await Init.bootState(toast, setScreen)

							console.log("completed boot")

							return () => {
								clearInterval(stateCb)
								stateUb()
								appUb()
							}
						} catch (e) {
							console.log("Error detected!")
							alert(`${JSON.stringify(e)}`)
						}
						initialised.current = true
					}
				} catch (e) {
					console.log("Error detected!")
					alert(`${JSON.stringify(e)}`)
				}
			})
			console.log("completed init")
		})().catch(e => console.log(e))
	}, [])
}
