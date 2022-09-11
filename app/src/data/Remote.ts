import moment from "moment"
import { appState } from "./AppState"
import { Encrypt } from "./Encrypt"
import { http } from "./http"

const canUseRemote = true

export const Remote = {
	getRemote: async (): Promise<Family> => {
		console.log("req get remote")
		if (canUseRemote) {
			const fId = appState.familyId
			const t = appState.token
			if (!t) throw new Error("Unauthenticated.")
			const d = await http.get(`/${fId}`, {
				headers: {
					token: t,
				},
			})
			const family = Encrypt.decrypt(d.data.data)
			return family
		} else {
			throw new Error("Unauthorized to connect to backend (Remote.ts)")
		}
	},
	setRemote: async (data: Family): Promise<any | null> => {
		if (canUseRemote) {
			const fId = appState.familyId
			const t = appState.token
			if (!t) throw new Error("Unauthenticated.")
			const encData = Encrypt.encrypt(data)
			return await http.post(
				`/update/${fId}`,
				{
					active: true,
					last_updated: moment().toISOString(),
					users: data.users,
					data: encData,
				},
				{
					headers: { token: t },
				}
			)
		} else {
			return null
		}
	},
}
