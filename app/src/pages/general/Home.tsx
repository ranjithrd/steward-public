import React from "react"
import "./Home.scss"
import BaseLayout from "../../layouts/BaseLayout"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import moment from "moment"
import { ItemsModule } from "../items/Module"
import ImmediateActionCard from "../../components/ImmediateActionCard"
import { ChoresModule } from "../chores/Module"
import { useIonAlert } from "@ionic/react"
import { BillsModule } from "../bills/Module"
import Button from "../../components/Button"
import { appState } from "../../data/AppState"
import Card from "../../components/Card"
import { Link } from "react-router-dom"
import ShowIf from "../../components/ShowIf"

function Home() {
	useGuard()

	const data = useData()
	const [presentAlert] = useIonAlert()

	let greeting = "Hello!"
	const hour = moment().hour()
	if (hour <= 12) {
		greeting = "Good morning!"
	} else if (hour <= 17) {
		greeting = "Good afternoon!"
	} else {
		greeting = "Good evening!"
	}

	// items
	const items: PItem[] = ItemsModule.processItems(data.familyData.items)
	const toBuy = items.filter((e) => e.supply_left <= 1)
	const toCheck = items.filter((e) => e.supply_left <= 3)

	// chores
	const chores = data.familyData.chores
		.slice()
		.sort((a, b) => moment(a.next_due).valueOf() - moment(b.next_due).valueOf())
	const immediateChores = chores.filter(
		(e) => e.completed !== true && moment(e.next_due).isSameOrBefore(moment().add({ days: 1 }))
	)
	const immediateChore: Chore | undefined = immediateChores[0] ?? undefined
	function handleImmediate(chore: Chore) {
		presentAlert({
			header: `Complete ${chore.name}`,
			message: `Please confirm that you want to complete the chore ${chore.name}`,
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Confirm",
					role: "destructive",
					cssClass: "alert-cta",
					handler: () => {
						ChoresModule.completeChore(chore)
					},
				},
			],
		})
	}

	// bills
	const rbills = data.familyData.bills
	const billsThisWeek = BillsModule.findBillsIn(rbills, 7)
	const firstBill = billsThisWeek[0]
	function handleImmediatePay(b: PBill) {
		BillsModule.payBillAlert(b, presentAlert)
	}

	// summary
	const tasksToComplete =
		firstBill !== undefined || toBuy.length > 0 || toCheck.length > 0 || immediateChore !== undefined

	const familyLoaded =
		data.loaded &&
		(data.familyData.bills.length > 0 || data.familyData.items.length > 0 || data.familyData.chores.length > 0)

	return (
		<BaseLayout title="Home" tab="home">
			<div className="spacer"></div>
			<h3 className="left">{greeting}</h3>
			{!familyLoaded ? (
				<div className="left">
					<div className="spacer"></div>
					<h4>Start using Steward.</h4>
					<p>Steward can help you manage items, keep track on chores, and manage bills.</p>
					<p>Click any of the links at the bottom to add an item, manage a chore, or record a bill.</p>
					<div className="spacer"></div>
				</div>
			) : (
				<>
					{tasksToComplete ? (
						<p className="left">Welcome back to Steward.</p>
					) : (
						<p>You{"'"}re up to date on all tasks.</p>
					)}
					<div className="spacer"></div>
					<Card hideRipple={true}>
						<h4>Your summary</h4>
						<ul>
							<li>
								{billsThisWeek.length > 0 ? (
									<p>
										{billsThisWeek.length} {billsThisWeek.length > 1 ? "bills" : "bill"} to pay this
										week
									</p>
								) : (
									<p>All bills paid</p>
								)}
							</li>
							<li>
								{immediateChores.length > 0 ? (
									<p>
										{immediateChores.length} {immediateChores.length > 1 ? "chores" : "chore"} to
										complete
									</p>
								) : (
									<p>All chores completed</p>
								)}
							</li>
							<li>
								{toCheck.length > 0 ? (
									<p>
										{toCheck.length} {toCheck.length > 1 ? "items" : "items"} to check
									</p>
								) : (
									<p>All items checked</p>
								)}
							</li>
							<li>
								{toBuy.length > 0 ? (
									<p>
										{toBuy.length} {toBuy.length > 1 ? "items" : "items"} to buy
									</p>
								) : (
									<p>All items bought</p>
								)}
							</li>
						</ul>
					</Card>
					<div className="spacer"></div>
					{appState.hasPaid ? (
						<>
							<p className="left">Add another device or member to your family</p>
							<Link to="/invite">
								<Button expand="block">Invite</Button>
							</Link>
							<div className="spacer"></div>
						</>
					) : (
						<>
							<p className="left">Want to invite other members to your family?</p>
							<Link to="/premium">
								<Button expand="block">Buy Premium</Button>
							</Link>
							<div className="spacer"></div>
						</>
					)}
					{billsThisWeek.length > 0 ? (
						<>
							<ImmediateActionCard
								gradient="white"
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
					) : null}
					{immediateChore ? (
						<>
							<ImmediateActionCard
								title={immediateChore.name}
								description={`Get this done by ${moment(immediateChore.next_due).format("D MMM")}`}
								cta={"PRESS TO COMPLETE"}
								gradient="white"
								onClick={() => handleImmediate(immediateChore!)}
							/>
							<div className="spacer"></div>
						</>
					) : null}
					{toBuy.length > 0 ? (
						<>
							<ImmediateActionCard
								title={`${toBuy.length} items to buy!`}
								description={`Make sure you buy these items to stay in stock`}
								cta={"PRESS TO VIEW"}
								gradient="white"
								to="/items/buy"
							/>
							<div className="spacer"></div>
						</>
					) : null}
					{toCheck.length > 0 ? (
						<>
							<ImmediateActionCard
								title={`Check if ${toCheck.length} items are in stock`}
								description={`Make sure that these items are still in stock`}
								cta={"PRESS TO VIEW"}
								gradient="white"
								to="/items/check"
							/>
							<div className="spacer"></div>
						</>
					) : null}
					<p className="disabled medium center">
						You{"'"}re on the {appState.hasPaid ? "premium" : "free"} plan
					</p>
				</>
			)}
			<ShowIf customButtonStyle="disabled small center" showMessage="Debug">
				{JSON.stringify(data)}
			</ShowIf>
		</BaseLayout>
	)
}

export default Home
