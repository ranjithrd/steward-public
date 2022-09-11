import React from "react"
import { Link } from "react-router-dom"
import Card from "./Card"
import "./ImmediateActionCard.scss"

interface Props {
	onClick?: () => void
	title: string
	description?: string
	cta?: string
	to?: string
	gradient: "blue" | "red" | "cyan" | "white"
}

function ImmediateActionCard(props: Props) {
	const c = (
		<Card onClick={() => props.onClick?.()} className="parent">
			<div className={`immediate gradient-${props.gradient}`}>
				<div className="main-content">
					<p>{props.description}</p>
					<h3>{props.title}</h3>
				</div>
				<p className="cta">{props.cta}</p>
			</div>
		</Card>
	)

	if (props.to) {
		return <Link to={props.to}>{c}</Link>
	} else {
		return c
	}
}

export default ImmediateActionCard
