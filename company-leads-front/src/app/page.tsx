export default function Home() {
	return (
		<div>
			<header>
				<nav className="tab_container">
					<button className="tab_button">Invited</button>
					<button className="tab_button">Accepted</button>
				</nav>
			</header>

			<main></main>

			<div className="pagination_container"></div>
		</div>
	);
}
