import { IonAccordion, IonAccordionGroup, useIonAlert, useIonToast } from "@ionic/react"
import React, { useState } from "react"
import { v4 } from "uuid"
import { state, useData } from "../../data/Data"
import BaseLayout from "../../layouts/BaseLayout"
import moment from "moment"
import ItemForm from "../../components/ItemForm"
import Card from "../../components/Card"
import { useGuard } from "../../data/useGuard"

const templateItems: {
	name: string
	type: string
}[] = [
	{
		name: "Potatoes",
		type: "Vegetable",
	},
	{
		name: "Tomatoes",
		type: "Vegetable",
	},
	{
		name: "Cabbages",
		type: "Vegetable",
	},
	{
		name: "Apples",
		type: "Fruits",
	},
]

function NewItem() {
	useGuard()

	const [toast] = useIonToast()
	const [presentAlert] = useIonAlert()
	const [selected, setSelected] = useState()

	const data = useData()
	const items = data.familyData.items

	const filteredTemplates = templateItems.filter((m) => items.findIndex((e) => e.name === m.name) === -1)
	const accordions: { type: string; items: string[] }[] = []
	for (const t of filteredTemplates) {
		const i = accordions.findIndex((e) => e.type === t.type)
		if (i >= 0) {
			accordions[i].items.push(t.name)
		} else {
			accordions.push({
				type: t.type,
				items: [t.name],
			})
		}
	}

	function handleCreate(type: string, item: string) {
		presentAlert({
			header: `Add ${item}`,
			message: `Confirm that you'll add ${item}`,
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Confirm",
					handler: () => {
						const newI = [...items]
						newI.push({
							_id: v4(),
							last_checked: moment().toISOString(),
							supplied: 0,
							name: item,
							tag: type,
						})
						state.familyData.items = newI
						toast(`Added item ${item}`, 500)
					},
				},
			],
		})
	}

	return (
		<BaseLayout title="Add an item" tab="items" child={true}>
			<ItemForm title="Add an item" submitText="Add" />
			<div className="spacer"></div>
			{accordions.length > 0 ? (
				<>
					<h3 className="left left-indent">Suggested items</h3>
					<div className="spacer"></div>
					<IonAccordionGroup onIonChange={(e) => setSelected(e.detail.value)}>
						<div className="responsive">
							{accordions.map((accordion) => (
								<IonAccordion value={accordion.type} toggleIconSlot="end" key={accordion.type}>
									<Card slot="header" className="small-margins full-width">
										<div className="space-between">
											<h4 className="left">{accordion.type}</h4>
											<p className="small">{selected === accordion.type ? "CLOSE" : "ADD"}</p>
										</div>
									</Card>
									<div className="responsive margins" slot="content">
										{accordion.items.map((item) => (
											<Card onClick={() => handleCreate(accordion.type, item)} key={item}>
												<p>{item}</p>
											</Card>
										))}
									</div>
								</IonAccordion>
							))}
						</div>
					</IonAccordionGroup>
				</>
			) : null}
		</BaseLayout>
	)
}

export default NewItem
