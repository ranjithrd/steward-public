import { useIonAlert } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import ImmediateActionCard from "../../components/ImmediateActionCard"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { BillsModule } from "./Module"
import Card from "../../components/Card"
import BillForm from "../../components/BillForm"
import Button from "../../components/Button"

function Bills() {
	useGuard()

	const [presentAlert] = useIonAlert()
	const [showForm, setShowForm] = useState(false)

	const data = useData()

	const rbills = data.familyData.bills
	const bills = BillsModule.processBills(rbills)

	const billsThisWeek = BillsModule.findBillsIn(rbills, 7)
	const firstBill = billsThisWeek[0]

	function handleImmediatePay(b: PBill) {
		BillsModule.payBillAlert(b, presentAlert)
	}

	return (
		<BaseLayout title="Bills" tab="bills">
			{billsThisWeek.length > 0 ? (
				<>
					<ImmediateActionCard
						gradient="blue"
						title={`Pay ${firstBill.name} this week`}
						description={
							billsThisWeek.length > 1
								? `${firstBill.name} and ${billsThisWeek.length - 1} more ${
										billsThisWeek.length > 2 ? "bills" : "bill"
								  } to pay this week`
								: undefined
						}
						cta="CLICK TO MARK AS PAID"
						key="paybill"
						onClick={() => handleImmediatePay(firstBill)}
					/>
					<div className="spacer"></div>
				</>
			) : (
				<p className="margins">All of this week{"'"}s bills paid! 🥳</p>
			)}

			{!showForm ? (
				<>
					<Button expand="block" onClick={() => setShowForm(true)}>
						Add a bill
					</Button>
				</>
			) : (
				<>
					<BillForm onDone={() => setShowForm(false)} />
					<button onClick={() => setShowForm(false)} className="danger">
						Cancel
					</button>
				</>
			)}

			<div className="spacer"></div>

			{bills.length < 1 ? (
				<p>Looks like you{"'"}ve not created any bills! Hit the button to get tracking! ☝️</p>
			) : (
				<div className="responsive">
					{bills.map((bill) => (
						<Card to={`/bills/${bill._id}`} key={bill._id}>
							<h4>{bill.name}</h4>
							<p>
								{bill.repeats
									? `Last paid on ${moment(bill.last_paid).format("D MMM")}`
									: `Paid on ${moment(bill.next_pay).format("D MMM")}`}
							</p>
							{bill.repeats ? <p>Pay next on {moment(bill.next_pay).format("D MMM")}</p> : null}
						</Card>
					))}
				</div>
			)}
		</BaseLayout>
	)
}

export default Bills
