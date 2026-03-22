import Spinner from "./spinner"

function SuspenseLoader() {
	return (
		<div
			className='w-screen h-screen flex justify-center items-center fixed'
		>
			<Spinner />
		</div>
	)
}

export default SuspenseLoader