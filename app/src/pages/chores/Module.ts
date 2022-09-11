import moment from "moment"
import { state } from "../../data/Data"

export class ChoresModule {
	static completeChore(chore: Chore) {
		console.log(chore)
		const newC = [...state.familyData.chores]
		const i = newC.findIndex((v) => v._id === chore._id)
		if (i === -1) return
		if (chore.repeats) {
			if (moment(chore.next_due).isBefore(moment())) {
				newC[i] = {
					...chore,
					next_due: moment().add({ days: chore.frequency! }).toISOString(),
				}
			} else {
				newC[i] = {
					...chore,
					next_due: moment(chore.next_due).add({ days: chore.frequency! }).toISOString(),
				}
			}
		} else {
			newC[i] = {
				...chore,
				completed: true,
			}
		}
		console.log(chore)
		console.log(newC[i])
		state.familyData.chores = newC
	}
}
