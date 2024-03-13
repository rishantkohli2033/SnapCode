import ChatSideBar from "@/components/chat/ChatSidebar";

const Layout = ({ children }: React.PropsWithChildren) => {
	return (
		<main className='flex h-screen'>
			<ChatSideBar />
			{children}
		</main>
	);
};
export default Layout;
