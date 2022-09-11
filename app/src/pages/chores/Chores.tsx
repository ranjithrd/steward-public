import { IonInput, IonRippleEffect, useIonAlert } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import Button from "../../components/Button"
import Card from "../../components/Card"
import Form from "../../components/Form"
import ImmediateActionCard from "../../components/ImmediateActionCard"
import { state, useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { v4 } from "uuid"
import ShowIf from "../../components/ShowIf"
import { ChoresModule } from "./Module"

function Chores() {
	useGuard()

	const [presentAlert] = useIonAlert()
	const [showForm, setShowForm] = useState(false)

	const data = useData()
	const chores = data.familyData.chores
		.slice()
		.sort((a, b) => moment(a.next_due).valueOf() - moment(b.next_due).valueOf())

	const completedChores = chores.filter((e) => e.completed === true)
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

	return (
		<BaseLayout tab="chores" title="Chores">
			{immediateChore ? (
				<>
					<ImmediateActionCard
						title={immediateChore.name}
						description={`Get this done by ${moment(immediateChore.next_due).format("D MMM")}`}
						cta={"PRESS TO COMPLETE"}
						gradient="blue"
						onClick={() => handleImmediate(immediateChore!)}
					/>
					{immediateChores.length > 1 ? (
						<>
							<div className="spacer"></div>
							<p>
								<strong>
									{immediateChores.length - 1} more {immediateChores.length > 2 ? "chores" : "chore"}
								</strong>{" "}
								to complete today
							</p>
						</>
					) : null}
				</>
			) : (
				<p className="margins">No more tasks left for today! 🥳</p>
			)}
			<div className="spacer"></div>

			{!showForm ? (
				<Button expand="block" onClick={() => setShowForm(true)}>
					Create a chore
				</Button>
			) : (
				<>
					<Form
						title="Create a chore"
						submitText="Create"
						validate={(data) => {
							if (
								!data.name ||
								data.repeats === undefined ||
								(data.repeats && !data.frequency) ||
								!data.next_due
							) {
								return "Please fill all the fields."
							}
							return true
						}}
						submit={(data) => {
							state.familyData.chores.push({ _id: v4(), ...data })
							setShowForm(false)
						}}
						columns={[
							{
								id: "name",
								label: "Name",
								placeholder: "E.g Clean room",
								type: "text",
							},
							{
								id: "repeats",
								label: "Chore repeats",
								type: "choice",
								placeholder: "Tap to select",
								choices: [
									{
										text: "Yes, every so days",
										value: true,
									},
									{
										text: "No, I'll do it only once",
										value: false,
									},
								],
							},
							{
								id: "frequency",
								label: "How often will this chore repeat?",
								type: "custom",
								placeholder: "E.g 5",
								showIf: (d) => d.repeats === true,
								custom: (val, setVal) => (
									<div className="row indent-left bold">
										<p>Every</p>
										<IonInput
											type="number"
											value={val}
											onIonChange={(e) => setVal(parseInt(e.detail.value ?? "0"))}
											className="inline-size"
										/>
										<p>days</p>
									</div>
								),
							},
							{
								id: "next_due",
								label: "When do you want to start this chore?",
								type: "date",
								showIf: (d) => d.repeats === true,
								placeholder: "Pick the date you want to start doing this on",
							},
							{
								id: "next_due",
								label: "When do you want to do this chore?",
								type: "date",
								showIf: (d) => d.repeats === false,
								placeholder: "Pick the date you want to complete this chore",
							},
						]}
					/>
					<button onClick={() => setShowForm(false)} className="danger">
						Cancel
					</button>
				</>
			)}

			<div className="spacer"></div>

			{chores.length > 0 ? (
				<div className="responsive-wide">
					{chores
						.filter((e) => e.completed !== true)
						.map((chore) => (
							<Card key={chore._id} to={`/chores/${chore._id}`}>
								<IonRippleEffect />
								<h4>{chore.name}</h4>
								<p>{chore.completed ? "Completed" : "Not Completed"}</p>
								<p>Complete by {moment(chore.next_due).format("D MMM")}</p>
							</Card>
						))}
				</div>
			) : (
				<p className="margins">
					Looks like you haven{"'"}t created a chore yet! Hit the button right above this to get started ☝️
				</p>
			)}

			<div className="spacer"></div>

			{completedChores.length > 0 ? (
				<ShowIf showMessage="Show completed chores" hideMessage="Hide">
					<div className="spacer"></div>
					{completedChores.map((chore) => (
						<Card key={chore._id} to={`/chores/${chore._id}`}>
							<IonRippleEffect />
							<h4>{chore.name}</h4>
							<p>Completed on {moment(chore.next_due).format("D MMM")}</p>
						</Card>
					))}
				</ShowIf>
			) : null}
		</BaseLayout>
	)
}

export default Chores
