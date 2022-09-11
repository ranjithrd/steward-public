import { IonAccordion, IonAccordionGroup, IonItem } from "@ionic/react"
import React from "react"
import BuyCard from "../../components/BuyCard"
import ShowIf from "../../components/ShowIf"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { ItemsModule } from "./Module"

function Buy() {
	useGuard()

	const data = useData()
	const items: PItem[] = ItemsModule.processItems(data.familyData.items)

	const toBuy = items.filter((e) => e.supply_left <= 1)
	const notToBuy = items.filter((e) => e.supply_left > 1)

	const accordions: { type: string; items: PItem[] }[] = []
	for (const t of toBuy) {
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
		<BaseLayout tab="items" title="Items to buy" child={true}>
			<div className="spacer"></div>
			<h4>Purchase these items to stay in stock</h4>
			<div className="spacer"></div>
			{toBuy.length > 0 ? (
				<IonAccordionGroup multiple={true}>
					<div className="spacer"></div>
					{accordions.map((accordion) => (
						<IonAccordion value={accordion.type} key={accordion.type}>
							<IonItem slot="header">
								<h4>{accordion.type}</h4>
							</IonItem>

							<div slot="content" className="responsive-wide">
								{accordion.items.map((item) => (
									<BuyCard item={item} key={item._id} />
								))}
							</div>
						</IonAccordion>
					))}
				</IonAccordionGroup>
			) : (
				<p className="margins">Nothing to buy!</p>
			)}
			{notToBuy.length > 0 ? (
				<ShowIf hideMessage="Hide already bought" showMessage="Show already bought">
					<div className="spacer"></div>
					<div className="responsive">
						{notToBuy.map((item) => (
							<BuyCard item={item} key={item._id} />
						))}
					</div>
				</ShowIf>
			) : null}
		</BaseLayout>
	)
}

export default Buy
