import React from "react"
import moment from "moment"
import { state, useData } from "../data/Data"
import Card from "./Card"
import SmallOutlined from "./SmallOutlined"

function CheckCard({ item }: { item: PItem }) {
	const data = useData()

	function checkHandler(days: number) {
		return () => {
			const newI = [...data.familyData.items]
			const i = newI.findIndex((e) => e._id === item._id)
			newI[i] = { ...newI[i], last_checked: moment().toISOString(), supplied: days }
			state.familyData.items = newI
		}
	}

	return (
		<Card key={item._id} hideRipple={true}>
			<div className="column">
				<div className="column nogap">
					<h4>{item.name}</h4>
					<p>Check on {moment(item.next_check).format("D MMM")}</p>
					<p>
						{item.supply_left > 0 ? (
							`Supply for ${item.supply_left} days left`
						) : (
							<span className="danger">Supply over</span>
						)}
					</p>
				</div>
				<div className="row space-between full-width">
					<SmallOutlined onClick={checkHandler(0)}>Empty</SmallOutlined>
					<SmallOutlined onClick={checkHandler(3)}>3 days</SmallOutlined>
					<SmallOutlined onClick={checkHandler(5)}>5 days</SmallOutlined>
					<SmallOutlined onClick={checkHandler(7)}>1 week</SmallOutlined>
				</div>
			</div>
		</Card>
	)
}

export default CheckCard
