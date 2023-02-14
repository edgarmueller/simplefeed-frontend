import './Layout.css'
import { NavBar } from './NavBar'

export const Layout = ({ children }: any) => (
	<>
		<NavBar />
		<div className='wrapper'>
			{children}
		</div>
	</>
)