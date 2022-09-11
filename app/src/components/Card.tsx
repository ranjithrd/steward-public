import { IonRippleEffect } from "@ionic/react"
import React from "react"
import { Link } from "react-router-dom"

function Card(
	props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & any
) {
	const linkTo = props.to ?? null

	const className = `card ${props.hideRipple !== true ? "ion-activatable ripple-parent" : null} ${props.className}`
	const children = (
		<>
			{props.hideRipple !== true ? <IonRippleEffect /> : null}
			{props.children}
		</>
	)

	if (linkTo) {
		return (
			<Link {...props} className={className}>
				{children}
			</Link>
		)
	}

	return (
		<div {...props} className={className}>
			{children}
		</div>
	)
}

export default Card
