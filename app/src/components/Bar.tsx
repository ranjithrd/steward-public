import React, { ReactElement } from "react"
import { IonLabel, IonTabBar, IonTabButton } from "@ionic/react"
import "./Bar.scss"

interface Props {
	tab: string
}

const pages = [
	{
		tabCheck: "home",
		href: "/home",
		name: "Home",
		icon: "home",
	},
	{
		tabCheck: "items",
		href: "/items",
		name: "Items",
		icon: "items",
	},
	{
		tabCheck: "chores",
		href: "/chores",
		name: "Chores",
		icon: "chores",
	},
	{
		tabCheck: "bills",
		href: "/bills",
		name: "Bills",
		icon: "bills",
	},
]

function NavigationBar({ tab }: Props): ReactElement {
	const isTabActive = (t: string) => tab === t

	return (
		<IonTabBar slot="bottom" id="bar">
			{pages.map((page) => (
				<IonTabButton
					tab={page.tabCheck}
					href={page.href}
					selected={isTabActive(page.tabCheck)}
					key={page.href}
				>
					<div className={`icon-${page.icon} bar-icon ${isTabActive(page.tabCheck) ? "active" : ""}`} />
					<IonLabel>{page.name}</IonLabel>
				</IonTabButton>
			))}
		</IonTabBar>
	)
}

export default NavigationBar
