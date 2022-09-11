import React from "react"
import { Link } from "react-router-dom"
import Button from "../../components/Button"
import Slider from "../../components/Slider"
import PlainLayout from "../../layouts/PlainLayout"

function Introduction() {
	return (
		<PlainLayout
			footer={
				<Link to="/home">
					<Button expand="block">Done</Button>
				</Link>
			}
		>
			<div className="column-align">
				<h1>Using Steward</h1>
				{/* TODO tutorial */}
				<Slider
					slides={[
						<div className="column-align">
							<h3>Chores</h3>
							<p></p>
						</div>,
					]}
				/>
			</div>
		</PlainLayout>
	)
}

export default Introduction
