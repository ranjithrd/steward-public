import { AnimatePresence, motion } from "framer-motion"
import React, { useMemo, useState } from "react"

interface Props {
	showMessage?: string
	hideMessage?: string
	children?: any
	shouldNotAnimateHeight?: boolean
	shouldNotShowMargins?: boolean
	shouldNotShowHide?: boolean
	customButtonStyle?: string
	render?: (hide: () => void) => JSX.Element
}

function ShowIf(props: Props) {
	const [show, setShow] = useState(false)
	const k = useMemo(() => Math.random(), [])
	const animateHeight = !(props.shouldNotAnimateHeight ?? false)

	return (
		<AnimatePresence>
			{show && props.shouldNotShowHide ? null : (
				<button
					className={`danger ${props.shouldNotShowMargins ? "nomargin" : ""} ${
						props.customButtonStyle ?? ""
					}`}
					onClick={() => setShow(!show)}
				>
					{show ? props.hideMessage ?? "Hide" : props.showMessage ?? "Show"}
				</button>
			)}
			<div className="spacer"></div>
			{show ? (
				<motion.div
					key={k + 0.1}
					className="responsive"
					initial="closed"
					animate="open"
					exit="closed"
					variants={{
						open: { opacity: 1, height: animateHeight ? "100%" : undefined },
						closed: { opacity: 0, height: animateHeight ? 0 : undefined },
					}}
					transition={{
						ease: "easeInOut",
					}}
				>
					{props.children ? props.children : props.render!(() => setShow(false))}
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

export default ShowIf
