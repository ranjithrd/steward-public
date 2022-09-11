import { IonAccordion, IonAccordionGroup, IonItem } from "@ionic/react"
import React from "react"
import CheckCard from "../../components/CheckCard"
import ShowIf from "../../components/ShowIf"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { ItemsModule } from "./Module"

function Check() {
	useGuard()

	const data = useData()
	const items: PItem[] = ItemsModule.processItems(data.familyData.items)

	const toCheck = items.filter((e) => e.supply_left <= 3)
	const notToCheck = items.filter((e) => e.supply_left > 3)

	const accordions: { type: string; items: PItem[] }[] = []
	for (const t of toCheck) {
		const i = accordions.findIndex((e) => e.type === t.tag)
		if (i >= 0) {
			accordions[i].items.push(t)
		} else {
			accordions.push({
				type: t.tag,
				items: [t],
			})
		}
	}

	return (
		<BaseLayout tab="items" title="Items to check" child={true}>
			<div className="spacer"></div>
			<p>Check these items to stay on top of your stock</p>
			<div className="spacer"></div>
			{toCheck.length > 0 ? (
				<IonAccordionGroup multiple={true}>
					<div className="spacer"></div>
					{accordions.map((accordion) => (
						<IonAccordion value={accordion.type} key={accordion.type}>
							<IonItem slot="header">
								<h4>{accordion.type}</h4>
							</IonItem>

							<div slot="content" className="responsive-wide">
								{accordion.items.map((item) => (
									<CheckCard item={item} key={item._id} />
								))}
							</div>
						</IonAccordion>
					))}
				</IonAccordionGroup>
			) : (
				<p className="margins">Nothing to check!</p>
			)}
			{notToCheck.length > 0 ? (
				<ShowIf hideMessage="Hide already bought" showMessage="Show already bought">
					<div className="spacer"></div>
					<div className="responsive">
						{notToCheck.map((item) => (
							<CheckCard item={item} key={item._id} />
						))}
					</div>
				</ShowIf>
			) : null}
		</BaseLayout>
	)
}

export default Check
