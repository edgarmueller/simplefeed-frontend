import './Layout.css'

export const Layout = ({ children }: any) => (
	<>
	<div className="top_bar">
		<div className="logo">
			<a href="/">Swirlfeed</a>
		</div>
	</div>
	{children}
	</>
)