import moment from "moment"
import React from "react"
import { v4 } from "uuid"
import { state } from "../data/Data"
import { BillsModule } from "../pages/bills/Module"
import Form from "./Form"

function BillForm(props: any) {
	return (
		<Form
			title="Add a bill"
			submitText="Add"
			validate={(data) => {
				if (
					(data.repeats === true && data.frequency === undefined) ||
					!data.name ||
					data.repeats === undefined ||
					!data.date ||
					!data.amount ||
					!data.tag
				) {
					return "Please fill all fields."
				}
				return true
			}}
			submit={(data) => {
				console.log(data)
				if (props.defaultObj === undefined) {
					state.familyData.bills.push({
						_id: v4(),
						tag: data.tag,
						name: data.name,
						frequency: data.frequency ?? "",
						repeats: data.repeats,
						payments: [
							{
								date: data.date,
								amount: data.amount,
							},
						],
					})
				} else {
					const newB = [...state.familyData.bills]
					const i = newB.findIndex((e) => e._id === data._id)
					if (i === -1) return
					newB[i] = {
						...props.defaultObj,
						name: data.name,
						frequency: data.frequency ?? "",
						repeats: data.repeats,
						payments: [...props.defaultObj.payments],
					}
					state.familyData.bills = newB
				}
				if (props.onDone) {
					props.onDone()
				} else {
					props.history.goBack()
				}
			}}
			columns={[
				{
					id: "name",
					label: "Name",
					placeholder: "E.g Water bill",
					type: "text",
				},
				{
					id: "repeats",
					label: "Bill repeats",
					type: "choice",
					placeholder: "Tap to select",
					choices: [
						{
							text: "Yes, every so days",
							value: true,
						},
						{
							text: "No, it's a one time expense",
							value: false,
						},
					],
					showIf: () => props.showPayments,
				},
				{
					id: "tag",
					label: "Tag",
					type: "tag",
					placeholder: "Choose a tag",
					tags: BillsModule.getTags(),
				},
				{
					id: "frequency",
					label: "How often will you pay this bill?",
					type: "choice",
					placeholder: "E.g 1 month",
					showIf: (d) => d.repeats === true,
					customChoices: [
						{
							name: "val",
							options: [...Array(30).keys()].map((e) => ({ value: `${e + 1}`, text: `${e + 1}` })),
						},
						{
							name: "dur",
							options: [
								{
									value: "days",
									text: "days",
								},
								{
									value: "mo",
									text: "months",
								},
							],
						},
					],
					customValue: (d) => {
						return `${d.val.value} ${d.dur.value}`
					},
				},
				{
					id: "date",
					label: "When did you last pay this bill?",
					type: "date",
					lastDate: moment().toISOString(),
					showIf: (d) => d.repeats === true && props.showPayments,
					placeholder: "Pick the date you started paying this",
				},
				{
					id: "date",
					label: "When did you pay this bill?",
					type: "date",
					lastDate: moment().toISOString(),
					showIf: (d) => d.repeats === false && props.showPayments,
					placeholder: "Pick when you paid the bill",
				},
				{
					id: "amount",
					label: "How much did you pay?",
					type: "number",
					showIf: (d) => d.repeats !== undefined && props.showPayments,
					placeholder: "E.g $500",
				},
			]}
			{...props}
		/>
	)
}

export default BillForm
