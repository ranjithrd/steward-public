import React, { useState } from "react"
import { IonSegment, IonSegmentButton } from "@ionic/react"
import { Link } from "react-router-dom"
import Button from "../../components/Button"
import BuyCard from "../../components/BuyCard"
import CheckCard from "../../components/CheckCard"
import ImmediateActionCard from "../../components/ImmediateActionCard"
import { useData } from "../../data/Data"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { AnimatePresence, motion } from "framer-motion"
import ShowIf from "../../components/ShowIf"
import { ItemsModule } from "./Module"

function Items() {
	useGuard()

	const [toShow, setToShow] = useState<string>("toBuy")

	const data = useData()
	const items: PItem[] = ItemsModule.processItems(data.familyData.items)

	const toBuy = items.filter((e) => e.supply_left <= 1)
	const toCheck = items.filter((e) => e.supply_left <= 3)

	const notToBuy = items.filter((e) => e.supply_left > 1)
	const notToCheck = items.filter((e) => e.supply_left > 3)

	const shouldShowImmediate = toBuy.length > 0 || toCheck.length > 0

	return (
		<BaseLayout tab="items" title="Items">
			{items.length > 0 ? (
				shouldShowImmediate ? (
					<>
						{toBuy.length > 0 ? (
							<ImmediateActionCard
								title={`${toBuy.length} items to buy!`}
								description={`Make sure you buy these items to stay in stock`}
								cta={"PRESS TO VIEW"}
								gradient="blue"
								to="/items/buy"
							/>
						) : null}
						<div className="spacer"></div>
						{toCheck.length > 0 ? (
							<ImmediateActionCard
								title={`Check if ${toCheck.length} items are in stock`}
								description={`Make sure that these items are still in stock`}
								cta={"PRESS TO VIEW"}
								gradient="cyan"
								to="/items/check"
							/>
						) : null}
					</>
				) : (
					<p className="margins">Everything{"'"}s in stock! 🥳</p>
				)
			) : null}

			{items.length > 0 ? (
				<>
					<div className="spacer"></div>
					<Link to="/items/manage">
						<Button expand="block" fill="outline">
							Edit or remove items
						</Button>
					</Link>
					<div className="spacer"></div>
				</>
			) : (
				<p className="margins">You haven{"'"}t added any items. Add one with this button 👇</p>
			)}

			<Link to="/items/add">
				<Button expand="block">Add an item</Button>
			</Link>

			<div className="spacer"></div>

			<IonSegment value={toShow} onIonChange={(e) => setToShow(e.detail.value!)} mode="md">
				<IonSegmentButton value="toBuy">To Buy</IonSegmentButton>
				<IonSegmentButton value="toCheck">To Check</IonSegmentButton>
			</IonSegment>

			<AnimatePresence exitBeforeEnter={true}>
				<div className="spacer"></div>
				{toShow === "toBuy" ? (
					<motion.div
						initial={{ y: 300, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 300, opacity: 0 }}
						transition={{ bounce: 0, ease: "easeInOut", duration: 0.25 }}
						key="buy"
					>
						{toBuy.length > 0 ? (
							<div className="responsive-wide">
								{toBuy.map((item) => (
									<BuyCard item={item} key={item._id} />
								))}
							</div>
						) : (
							<p className="margins">Nothing to buy!</p>
						)}
						{notToBuy.length > 0 ? (
							<ShowIf hideMessage="Hide already bought" showMessage="Show already bought">
								<div className="responsive">
									{notToBuy.map((item) => (
										<BuyCard item={item} key={item._id} />
									))}
								</div>
							</ShowIf>
						) : null}
					</motion.div>
				) : (
					<motion.div
						initial={{ y: 300, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 300, opacity: 0 }}
						transition={{ bounce: 0, ease: "easeInOut", duration: 0.25 }}
						key="check"
					>
						{toCheck.length > 0 ? (
							<div className="responsive-wide">
								{toCheck.map((item) => (
									<CheckCard item={item} key={item._id} />
								))}
							</div>
						) : (
							<p className="margins">Nothing to check!</p>
						)}
						<AnimatePresence initial={false}>
							{notToCheck.length > 0 ? (
								<ShowIf hideMessage="Hide completed" showMessage="Show completed">
									{notToCheck.map((item) => (
										<CheckCard item={item} key={item._id} />
									))}
								</ShowIf>
							) : null}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</BaseLayout>
	)
}

export default Items
