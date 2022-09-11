import React from "react"
import { useIonAlert } from "@ionic/react"
import Card from "../../components/Card"
import ItemForm from "../../components/ItemForm"
import { state, useData } from "../../data/Data"
import BaseLayout from "../../layouts/BaseLayout"
import { ItemsModule } from "./Module"
import ShowIf from "../../components/ShowIf"
import { useGuard } from "../../data/useGuard"

// type Props = RouteComponentProps

function ManageItemDiv({ item }: { item: PItem }) {
	useGuard()

	const data = useData()
	const [presentAlert] = useIonAlert()

	function handleDelete() {
		presentAlert({
			header: "Confirm deletion",
			message: `Confirm that you want to delete ${item.name}`,
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Delete",
					role: "danger",
					handler: () => {
						let newI = [...data.familyData.items]
						newI = newI.filter((e) => e._id !== item._id)
						state.familyData.items = newI
					},
				},
			],
		})
	}

	return (
		<div className="space-between">
			<Card className="full-height" hideRipple={true}>
				<div className="space-between">
					<h4>{item.name}</h4>
					<button className="red danger nomargin" onClick={handleDelete}>
						Delete
					</button>
				</div>
				<ShowIf
					hideMessage=""
					showMessage="Edit"
					shouldNotAnimateHeight={true}
					shouldNotShowHide={true}
					customButtonStyle="danger outline ion-activatable ripple-parent center"
					render={(dismiss) => (
						<>
							<div className="spacer"></div>
							<ItemForm
								defaultObj={ItemsModule.returnItem(item)}
								submitText="Save"
								title={undefined}
								onDone={() => dismiss()}
							/>
						</>
					)}
				/>
			</Card>
		</div>
	)
}

function ManageItems() {
	const data = useData()
	const items = ItemsModule.processItems(data.familyData.items)

	return (
		<BaseLayout title="Manage items" tab="items" child={true}>
			<div className="responsive">
				{items.map((item) => (
					<ManageItemDiv item={item} key={item._id} />
				))}
			</div>
		</BaseLayout>
	)
}

export default ManageItems
