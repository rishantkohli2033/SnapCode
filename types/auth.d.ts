import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
	interface Session {
		user: {
			_id: string;
		} & DefaultSession["user"];
	}
}
//for fixing the error with "session.user._id" in auth.ts file under session function
//Error: Property '_id' does not exist 
// https://next-auth.js.org/getting-started/typescript