import React from "react"
import { Link } from "react-router-dom"
import Button from "../../components/Button"
import Logo from "../../components/Logo"
import PlainLayout from "../../layouts/PlainLayout"
import Slider from "../../components/Slider"

function Welcome() {
	return (
		<PlainLayout
			header={<Logo />}
			footer={
				<>
					<Link to="/join">
						<Button fill="outlined" expand="full">
							Join a Family
						</Button>
					</Link>
					<div className="half-spacer"></div>
					<Link to="/premium">
						<Button expand="full">Create a New Family</Button>
					</Link>
				</>
			}
		>
			<h1 className="center">Welcome to Steward!</h1>
			<p>We{"'"}re so glad to see you here. Steward is the best way to manage your household.</p>
			<div className="spacer"></div>
			<Slider
				slides={[
					<div className="column">
						{/* <img src={ChoresImage} alt="Chores" className="s-img" /> */}
						<h1 className="center">Chores</h1>
						<p className="center">
							With Steward, you can keep track of any and all groceries, toiletries, and more in your
							household and make sure that they{"'"}re always in stock.
						</p>
					</div>,
					<div className="column">
						{/* <img src={ItemsImage} alt="Items" className="s-img" /> */}
						<h1 className="center">Items</h1>
						<p className="center">
							Make sure you don{"'"}t miss a clean with Steward{"'"}s Chores feature. With it, you{"'"}ll
							be able to see exactly what you have to do and when.
						</p>
					</div>,
					<div className="column">
						{/* <img src={BillsImage} alt="Bills" className="s-img" /> */}
						<h1 className="center">Bills</h1>
						<p className="center">
							Steward handles bill reminders and can store your payments, so you{"'"}ll always know what
							you{"'"}ve paid and what you need to.
						</p>
					</div>,
				]}
			/>
		</PlainLayout>
	)
}

export default Welcome
