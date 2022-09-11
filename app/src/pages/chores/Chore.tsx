import { IonInput, useIonAlert } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import { RouteComponentProps } from "react-router"
import Button from "../../components/Button"
import Form from "../../components/Form"
import { useData, state } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { ChoresModule } from "./Module"

type Props = RouteComponentProps<{
	id: string
}>

function Chore({
	match: {
		params: { id },
	},
	history,
}: Props) {
	useGuard()

	const data = useData()
	const chore = data.familyData.chores?.filter((e) => e._id === id)[0]
	const [showForm, setShowForm] = useState(false)
	const [presentAlert] = useIonAlert()

	function handleComplete() {
		ChoresModule.completeChore(chore)
		history.goBack()
	}

	function handleDelete() {
		presentAlert({
			header: "Confirm deletion",
			message: `Confirm that you want to delete the chore ${chore.name}`,
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Delete",
					role: "danger",
					handler: () => {
						let newC = [...data.familyData.chores]
						newC = newC.filter((e) => e._id !== id)
						state.familyData.chores = newC
						history.goBack()
					},
				},
			],
		})
	}

	if (!chore) return <>Not found.</>

	return (
		<BaseLayout title={chore.name ?? "Chore"} tab="chores" child={true}>
			<div className="spacer"></div>
			<div className="spacer"></div>
			<h1>{chore.name}</h1>
			<div className="spacer"></div>
			<div className="space-between">
				<div className="column">
					<h4>Due {moment(chore.next_due).format("D MMM")}</h4>
					{chore.repeats ? (
						<p>
							<strong>Repeats</strong> every {chore.frequency} {chore.frequency !== 1 ? "days" : "day"}
						</p>
					) : null}
				</div>
				<Button onClick={handleComplete}>Complete</Button>
			</div>
			<div className="spacer"></div>
			{!showForm ? (
				<Button fill="outlined" expand="full" onClick={() => setShowForm(true)}>
					Edit
				</Button>
			) : (
				<>
					<Form
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
						defaultObj={chore}
						resetAfterSubmit={false}
						submitText="Save"
						submit={(formData) => {
							const newChoresList = [...data.familyData.chores]
							const indexOfChore = newChoresList.findIndex((e) => e._id === id)
							newChoresList[indexOfChore] = { ...chore, ...formData }
							state.familyData.chores = newChoresList
							setShowForm(false)
						}}
					/>
					<button onClick={() => setShowForm(false)} className="danger">
						Cancel
					</button>
				</>
			)}
			<button className="danger center" onClick={handleDelete}>
				Delete
			</button>
			<div className="spacer"></div>
			<p className="disabled margins small">ID: {chore._id}</p>
		</BaseLayout>
	)
}

export default Chore
