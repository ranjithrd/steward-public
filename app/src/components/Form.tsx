import { IonDatetime, IonInput, PickerColumn, useIonPicker } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import Button from "./Button"
import Card from "./Card"
import ChooseAutofillInput from "./ChooseAutofillInput"
import "./Form.scss"

interface Input {
	id: string
	label: string
	placeholder: string
	type: "text" | "number" | "date" | "choice" | "tag" | "custom"
	tags?: string[]
	lastDate?: string
	showIf?: (data: any) => boolean
	choices?: {
		text: string
		value: any
	}[]
	customChoices?: PickerColumn[]
	customValue?: (data: any) => any
	custom?: (value: any, setValue: (data: any) => void) => JSX.Element
}

interface Props {
	title?: string
	columns: Input[]
	submitText?: string
	submit: (data: any) => void
	validate?: (data: any) => boolean | string
	defaultObj?: any
	resetAfterSubmit?: boolean
}

const Form = (props: Props) => {
	const [formData, setFormData] = useState<any>({
		...(props.defaultObj ?? {}),
	})
	const [error, setError] = useState<string | undefined>()
	const [showPicker] = useIonPicker()

	function handleFormChange(id: string, date?: boolean) {
		return (e: any) => {
			setFormData({
				...formData,
				[id]: date ? moment(e.detail.value).toISOString() : e.detail.value,
			})
		}
	}

	function handleSubmit() {
		const validationResults = props.validate?.(formData) ?? true
		if (validationResults === true) {
			props.submit(formData)
			if (props.resetAfterSubmit === false && props.resetAfterSubmit !== undefined) {
				return
			} else {
				setFormData({})
			}
		} else {
			setError(validationResults as string)
		}
	}

	return (
		<Card hideRipple={true} className="form">
			<h4 className="header">{props.title}</h4>
			<div className="spacer"></div>
			{props.columns.map((column) => {
				let input
				switch (column.type) {
					case "text":
						input = (
							<IonInput
								type="text"
								placeholder={column.placeholder}
								value={formData[column.id]}
								onIonChange={handleFormChange(column.id)}
							/>
						)
						break
					case "number":
						input = (
							<IonInput
								type="number"
								placeholder={column.placeholder}
								value={formData[column.id]}
								onIonChange={handleFormChange(column.id)}
							/>
						)
						break
					case "date":
						input = (
							<IonDatetime
								placeholder={column.placeholder}
								value={formData[column.id]}
								onIonChange={handleFormChange(column.id, true)}
								max={column.lastDate ?? moment().add({ years: 1 }).toISOString()}
								presentation="date"
							/>
						)
						break
					case "tag":
						input = (
							<ChooseAutofillInput
								default={column.tags ?? []}
								placeholder={column.placeholder}
								val={formData[column.id]}
								onChange={(v) => handleFormChange(column.id)({ detail: { value: v } })}
							/>
						)
						break
					case "choice":
						input = (
							<button
								onClick={() => {
									const buttons = [
										{
											text: "Confirm",
											handler: (selected: any) => {
												console.log(selected)
												console.log(column.customValue?.(selected))
												handleFormChange(column.id)({
													detail: {
														value: column.customChoices
															? column.customValue!(selected)
															: selected?.picker?.value,
													},
												})
											},
										},
									]
									if (column.customChoices) {
										showPicker(column.customChoices, buttons)
									} else {
										showPicker(
											[
												{
													name: "picker",
													options: column.choices ?? [],
												},
											],
											buttons
										)
									}
								}}
								className="picker-button"
							>
								{formData[column.id] !== undefined
									? column.customChoices
										? formData[column.id]
										: (column.choices ?? []).filter((e) => e.value === formData[column.id])[0].text
									: column.placeholder}
								<p className="tap-change">
									{formData[column.id] !== undefined ? "TAP TO CHANGE" : null}
								</p>
							</button>
						)
						break
					case "custom":
						input = column.custom!(formData[column.id], (d) =>
							handleFormChange(column.id)({ detail: { value: d } })
						)
						break
					default:
						input = null
				}
				if (column.showIf?.(formData) ?? true) {
					return (
						<>
							<p className="label">{column.label}</p>
							{input}
							<div className="spacer"></div>
						</>
					)
				} else {
					return null
				}
			})}
			{error ? (
				<>
					<div className="spacer"></div>
					<p className="error">{error}</p>
				</>
			) : null}
			<Button expand="block" onClick={handleSubmit}>
				{props.submitText ?? "Submit"}
			</Button>
		</Card>
	)
}

export default Form
