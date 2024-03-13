import Image from "next/image";
import Link from "next/link";
import LoginCard from "./login-card";

export default async function Login() {
	return (
		<>
			<h1 className='text-2xl font-bold text-center mb-4'>Log in to SnapCode</h1>
			<LoginCard/>
		</>
	);
}