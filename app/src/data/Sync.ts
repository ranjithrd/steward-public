import { Remote } from "./Remote"
import { state } from "./Data"
import { appLog } from "../helpers/Log"
import moment from "moment"
import _ from "lodash"
import { appState } from "./AppState"
import { FileManager } from "./FileManager"

let oldData: any

export const SYNC_INTERVAL = 30 * 1000 // seconds

export class Sync {
	static async syncRemote() {
		appLog(`Syncing data. Current time: ${moment().format("HH:mm:ss DD/MM/YY")}`)
		console.log(appState.hasFamily)
		console.log(appState.hasPaid)
		console.log(appState.familyId)
		console.log(appState.key)
		let newD
		if (appState.hasPaid) {
			newD = await Remote.getRemote()
		} else {
			newD = await FileManager.readFile()
		}
		state.familyData = newD
		state.loaded = true
		oldData = newD
		console.log(newD)
		return newD
	}

	static async syncData(data: Family) {
		if (!_.isEqual(data, oldData)) {
			// data is different
			if (appState.hasPaid) {
				await Remote.setRemote({ ...data })
			} else {
				await FileManager.writeData({ ...data })
			}
		} else {
			// nothing to sync
			return
		}
	}

	static reviewState() {
		// bill tags
		const tags = _.uniqBy(
			state.familyData.bills.map((b) => b.tag),
			(e) => e
		)
		const isDifferent = _.xor(tags, appState.savedTags).length !== 0
		if (isDifferent) {
			appState.savedTags = tags
		}
		// item tags
		const itemTags = _.uniqBy(
			state.familyData.bills.map((b) => b.tag),
			(e) => e
		)
		const isItemDifferent = _.xor(itemTags, appState.savedItemTags).length !== 0
		if (isItemDifferent) {
			appState.savedItemTags = itemTags
		}
	}
}
