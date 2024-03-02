function Profile({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" aria-label="Profile">
			<circle cx={12} cy={7} r="4.5" stroke="currentColor" />
			<path d="M3.5 21.5v-4.34C3.5 15.4 7.3 14 12 14s8.5 1.41 8.5 3.16v4.34" stroke="currentColor" strokeLinecap="round" />
		</svg>
	);
}

export default Profile;
