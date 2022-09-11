import React from "react"
import PlainLayout from "../../layouts/PlainLayout"
import Form from "../../components/Form"
import Currencies from "../../assets/currencies.json"
import { useHistory } from "react-router"
import { state } from "src/data/Data"

function Details() {
	const history = useHistory()

	return (
		<PlainLayout>
			<h1>Complete setup</h1>
			<p className="left">Choose your currency and you're good to go 🚀</p>
			<div className="spacer"></div>
			<Form
				columns={[
					{
						id: "currency",
						type: "choice",
						placeholder: "Choose your currency",
						label: "Currency",
						choices: Currencies.map((c) => ({
							text: `${c.code}: ${c.name} (${c.symbol})`,
							value: c.symbol,
						})),
					},
				]}
				submitText="Done"
				validate={(data) => {
					if (!data.currency) {
						return "Fill in all fields."
					}
					return true
				}}
				submit={(data) => {
					console.log(data)
					state.familyData.currency = data.currency
					history.push("/introduction")
				}}
			/>
		</PlainLayout>
	)
}

export default Details
