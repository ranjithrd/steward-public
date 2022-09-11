import { IonCheckbox, useIonAlert } from "@ionic/react"
import moment from "moment"
import React from "react"
import { state, useData } from "../data/Data"
import Card from "./Card"

function BuyCard({ item }: { item: PItem }) {
	const data = useData()
	const [presentAlert] = useIonAlert()
	const checkboxValue = item.supply_left > 2

	function alertHandler(days: number) {
		return () => {
			const newI = [...data.familyData.items]
			const i = newI.findIndex((e) => e._id === item._id)
			newI[i] = { ...newI[i], last_checked: moment().toISOString(), supplied: days }
			state.familyData.items = newI
		}
	}

	function handleCompleteBuy() {
		if (checkboxValue) {
			// reset to buy
			console.log("mark as not bought")
			const newI = [...data.familyData.items]
			const i = newI.findIndex((e) => e._id === item._id)
			newI[i] = { ...newI[i], last_checked: moment().toISOString(), supplied: 0 }
			state.familyData.items = newI
		} else {
			// mark as bought
			console.log("mark as bought")
			presentAlert({
				header: "How long will this last?",
				message: `How long will the new supply of ${item.name} last?`,
				buttons: [
					{
						text: "3 days",
						handler: alertHandler(3),
					},
					{
						text: "5 days",
						handler: alertHandler(5),
					},
					{
						text: "1 week",
						handler: alertHandler(7),
					},
				],
			})
		}
	}

	return (
		<Card key={item._id}>
			<div className="row">
				<IonCheckbox checked={checkboxValue} onIonChange={handleCompleteBuy} />
				<div className="column nogap">
					<h4>{item.name}</h4>
					<p>
						Buy from {item.buy_from} on {moment(item.next_check).format("D MMM")}
					</p>
					<p>
						{item.supply_left > 0 ? (
							`Supply for ${item.supply_left} days left`
						) : (
							<span className="danger">Supply over</span>
						)}
					</p>
				</div>
			</div>
		</Card>
	)
}

export default BuyCard
