import moment from "moment"
import React from "react"
import { v4 } from "uuid"
import { state } from "../data/Data"
import { ItemsModule } from "../pages/items/Module"
import Form from "./Form"
import { useHistory } from "react-router-dom"

function ItemForm(props: any) {
	const history = useHistory()

	return (
		<Form
			title="Add an item"
			submitText="Add"
			validate={(data) => {
				if (!data.name || !data.tag) {
					return "Please fill all fields."
				}
				return true
			}}
			submit={(data) => {
				if (!props.defaultObj) {
					state.familyData.items.push({
						_id: v4(),
						image: "https://steward.co.in/image/1/1",
						last_checked: moment().toISOString(),
						supplied: 3,
						...data,
					})
				} else {
					const newI = [...state.familyData.items]
					const i = newI.findIndex((e) => e._id === data._id)
					if (i === -1) return
					newI[i] = { ...data }
					state.familyData.items = newI
				}
				if (props.onDone) {
					props.onDone()
				} else {
					history.goBack()
				}
			}}
			columns={[
				{
					id: "name",
					label: "Name",
					placeholder: "E.g Carrots",
					type: "text",
				},
				{
					id: "tag",
					label: "Tag",
					type: "tag",
					placeholder: "E.g vegetables",
					tags: ItemsModule.getTags(),
				},
			]}
			{...props}
		/>
	)
}

export default ItemForm
