import React from "react"
import { IonContent, IonList, IonMenu, IonRippleEffect, useIonAlert, AlertOptions } from "@ionic/react"
import { Link, useLocation, useHistory } from "react-router-dom"
import Button from "./Button"
import { menuController } from "@ionic/core"
import { appState } from "../data/AppState"
import Logo from "./Logo"
import "./Menu.scss"

interface AppPage {
	url: string
	title: string
	grayed?: boolean
	cta?: boolean
	condition?: () => boolean
	onClick?: (alert: (options: AlertOptions) => Promise<void>, push: (path: string) => any) => any
}

const appPages: AppPage[] = [
	{
		title: "Home",
		url: "/home",
	},
	{
		title: "Items",
		url: "/items",
	},
	{
		title: "Chores",
		url: "/chores",
	},
	{
		title: "Bills",
		url: "/bills",
	},
	{
		title: "",
		url: "hr",
	},
	{
		title: "Reset",
		url: "/",
		grayed: true,
		onClick: (alert, replace) => {
			alert({
				header: "You'll be signed out!",
				message:
					"By resetting, you'll be losing all data if this is where you bought the subscription! Please reconfirm!",
				buttons: [
					{
						text: "Confirm",
						role: "danger",
						handler: () => {
							appState.familyId = ""
							appState.familyCode = 0
							appState.hasFamily = false
							appState.hasPaid = false
							appState.key = ""
							replace("/welcome")
						},
					},
					{
						text: "Cancel",
						role: "cancel",
					},
				],
			})
		},
	},
	{
		title: "Add to Family",
		url: "/invite",
		grayed: true,
		condition: () => appState.hasPaid,
	},
	{
		title: "Settings",
		url: "/settings",
		grayed: true,
	},
	{
		title: "Go Premium",
		url: "/premium",
		cta: true,
		condition: () => !appState.hasPaid,
	},
]

const Menu: React.FC = () => {
	const location = useLocation()
	const [alert] = useIonAlert()
	const history = useHistory()

	return (
		<IonMenu contentId="main" type="overlay" id="menu">
			<IonContent>
				<IonList>
					<div id="menu-items">
						<div className="spacer"></div>
						<div className="spacer"></div>
						<div className="spacer"></div>
						<div className="menu-item">
							<Logo />
						</div>
						<div className="spacer"></div>
						<div className="spacer"></div>
						{appPages.map((appPage, index) => {
							if (appPage.condition?.() === false) {
								return null
							}
							if (appPage.cta === true) {
								return (
									<Link
										to={appPage.url}
										className="menu-item"
										onClick={() => menuController.close()}
										key={appPage.url}
									>
										<Button expand="block">{appPage.title}</Button>
									</Link>
								)
							}
							if (appPage.url === "hr") {
								return <hr key={index} />
							}
							return (
								<Link
									to={appPage.url}
									key={index}
									onClick={() => {
										if (appPage.onClick) appPage.onClick(alert, history?.replace)
										menuController.close()
									}}
								>
									<div
										className={
											"menu-item ion-activatable ripple-parent " +
											(location.pathname === appPage.url ? "selected" : "") +
											(appPage.grayed === true ? "grayed" : "")
										}
									>
										<IonRippleEffect />
										{appPage.title}
									</div>
								</Link>
							)
						})}
					</div>
				</IonList>
			</IonContent>
		</IonMenu>
	)
}

export default Menu
