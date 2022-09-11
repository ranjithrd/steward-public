import React from "react"
import "./Slider.scss"
import AliceCarousel from "react-alice-carousel"
import "react-alice-carousel/lib/alice-carousel.css"

interface Props {
	slides: JSX.Element[]
}

function Slider(props: Props) {
	return (
		<div className="slider">
			<AliceCarousel
				autoPlay
				autoPlayStrategy="none"
				autoPlayInterval={5 * 1000}
				animationDuration={1000}
				animationType="slide"
				infinite
				disableButtonsControls
				mouseTracking
				items={props.slides.map((slide) => (
					<div className="slide">{slide}</div>
				))}
			/>
		</div>
	)
}

export default Slider
