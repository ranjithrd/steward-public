import { AlertOptions } from "@ionic/react"
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions"
import moment from "moment"
import { appState } from "../../data/AppState"
import { state } from "../../data/Data"

export class BillsModule {
	static getTags(): string[] {
		// TODO default tags
		const defaultTags = ["Monthly", "Repair", "Others", "Utilities"]
		const savedTags = appState.savedTags
		return [...defaultTags, ...savedTags]
	}

	static processBills(bills: Bill[]): PBill[] {
		return bills
			.map((e) => {
				const lastDate = e.payments
					.slice()
					.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
					.reverse()[0]
				if (e.repeats) {
					const [frequencyVal, frequencyDur] = e.frequency!.split(" ")
					const obj =
						frequencyDur === "mo" ? { months: parseInt(frequencyVal) } : { days: parseInt(frequencyVal) }
					const nextDate = moment(lastDate.date).add(obj)
					return {
						...e,
						next_pay: nextDate.toISOString(),
						last_paid: lastDate.date,
					}
				} else {
					return {
						...e,
						last_paid: lastDate.date,
					}
				}
			})
			.sort((a, b) => moment(b.last_paid).valueOf() - moment(a.last_paid).valueOf())
	}

	static findBillsIn(bills: Bill[], days: number): PBill[] {
		const processed = this.processBills(bills)
		return processed.filter((e) => e.repeats && moment(e.next_pay).isBefore(moment().add({ days })))
	}

	static convertToAmount(amount: string) {
		const nv = parseFloat(amount ?? "0")
		const hasDecimals = nv.toString().split(".").length > 1
		let stVal = ""
		if (!hasDecimals) {
			stVal = `${nv.toFixed(0)}`
		} else {
			const decPlace = nv.toString().split(".")[1]
			if (parseInt(decPlace) > 1) {
				stVal = `${nv.toFixed(2)}`
			} else {
				stVal = `${nv.toFixed(0)}`
			}
		}
		return `${state.familyData.currency ?? ""}${stVal}`
	}

	static payBill(bill: PBill, amount: string): void {
		const newB = [...state.familyData.bills]
		const i = newB.findIndex((e) => e._id === bill._id)
		if (bill.repeats) {
			const newPayments = [...newB[i].payments]
			newPayments.push({
				amount: amount,
				date: moment().toISOString(),
			})
			newB[i] = {
				...newB[i],
				payments: newPayments,
			}
		}
		state.familyData.bills = newB
	}

	static payBillAlert(b: Bill, presentAlert: (options: AlertOptions & HookOverlayOptions) => void) {
		presentAlert({
			header: `How much did you pay for ${b.name}?`,
			message: `Enter in how much you paid for ${b.name}`,
			inputs: [
				{
					name: "cost",
					type: "number",
					label: "Cost",
					placeholder: "Enter how much you paid",
				},
			],
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Confirm",
					role: "destructive",
					cssClass: "alert-cta",
					handler: (data) => {
						const cost = data.cost
						this.payBill(b, BillsModule.convertToAmount(cost ?? "0"))
					},
				},
			],
		})
	}

	static delete(bill: PBill) {
		let newB = [...state.familyData.bills]
		newB = newB.filter((e) => e._id !== bill._id)
		state.familyData.bills = newB
	}
}
