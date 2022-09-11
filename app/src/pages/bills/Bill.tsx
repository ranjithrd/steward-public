import { useIonAlert } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import { RouteComponentProps, useHistory } from "react-router"
import BillForm from "../../components/BillForm"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { BillsModule } from "./Module"

type Props = RouteComponentProps<{ id: string }>

function Bill(props: Props) {
	useGuard()

	const [presentAlert] = useIonAlert()
	const history = useHistory()
	const [showForm, setShowForm] = useState(false)

	const data = useData()
	const bills = BillsModule.processBills(data.familyData.bills)
	const bill = bills.find((e) => e._id === props.match.params.id)

	if (!bill) return null

	function handlePay() {
		BillsModule.payBillAlert(bill!, presentAlert)
	}

	function handleDelete() {
		presentAlert({
			header: "Confirm deletion",
			message: `Confirm that you want to delete the bill ${bill!.name}`,
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Delete",
					role: "danger",
					handler: () => {
						BillsModule.delete(bill!)
						history.goBack()
					},
				},
			],
		})
	}

	return (
		<BaseLayout title={bill.name} tab="bills" child={true}>
			<div className="spacer"></div>
			<div className="spacer"></div>
			{bill.repeats ? (
				<h1>{bill.name}</h1>
			) : (
				<div className="space-between">
					<h1>{bill.name}</h1>
					<h1 className="regular">{BillsModule.convertToAmount(bill.payments[0]?.amount ?? "")}</h1>
				</div>
			)}
			<p className="left">{bill.tag}</p>
			<div className="spacer"></div>
			<div className="space-between">
				<div className="column">
					{bill.repeats ? (
						<h4>Due {moment(bill.next_pay).format("D MMM")}</h4>
					) : (
						<h4>Paid on {moment(bill.payments[0].date).format("D MMM")}</h4>
					)}
					{bill.repeats ? (
						<p>
							<strong>Repeats</strong> every {bill.frequency}
						</p>
					) : null}
				</div>
				{bill.repeats ? <Button onClick={handlePay}>Mark as paid</Button> : null}
			</div>
			<div className="spacer"></div>
			{!showForm ? (
				<>
					<Button
						expand="block"
						onClick={() => setShowForm(true)}
						fill="outline"
						title={undefined}
						submitText="Save"
					>
						Edit this bill
					</Button>
				</>
			) : (
				<>
					<BillForm onDone={() => setShowForm(false)} defaultObj={bill} showPayments={false} />
					<button onClick={() => setShowForm(false)} className="danger">
						Cancel
					</button>
				</>
			)}
			<button className="danger center" onClick={handleDelete}>
				Delete
			</button>
			<p className="disabled margins small">ID: {bill._id}</p>
			<div className="spacer"></div>
			{bill.repeats ? (
				<>
					<h3>Payments made</h3>
					<div className="spacer"></div>
					<div className="responsive">
						{bill.payments.map((payment) => (
							<Card hideRipple={true} key={payment.date}>
								<div className="space-between">
									<h4>{moment(payment.date).format("D MMM")}</h4>
									<h4 className="regular">{BillsModule.convertToAmount(payment.amount)}</h4>
								</div>
							</Card>
						))}
					</div>
					<div className="spacer"></div>
				</>
			) : null}
		</BaseLayout>
	)
}

export default Bill
