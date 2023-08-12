import { Middleware, configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import usersReducer, { rollbackUser } from "./users/slice";
const persistanceLocalStorageMiddleware: Middleware =
	(store) => (next) => (action) => {
		next(action);
		localStorage.setItem("__redux_state__", JSON.stringify(store.getState()));
	};

const syncWithDatabaseMiddleware: Middleware =
	(store) => (next) => (action) => {
		const { type, payload: userIdToRemove } = action;

		const previousState = store.getState();

		next(action);

		if (type === "users/deleteUserById") {
			const userToRemove = previousState.users.find(
				(user) => user.id === userIdToRemove,
			);
			fetch(`https://jsonplaceholder.typicodasde.com/users/${userIdToRemove}`, {
				method: "DELETE",
			})
				.then((res) => {
					if (res.ok)
						toast.success(`Usuario ${userIdToRemove} eliminado con exito`);
					throw new Error("Error al eliminar el usuario");
				})
				.catch(() => {
					toast.error(`Error al eliminar al usuario ${userIdToRemove}`);
					if (userToRemove) {
						store.dispatch(rollbackUser(userToRemove));
					}
				});
		}
	};

export const store = configureStore({
	reducer: {
		users: usersReducer,
	},
	middleware: [persistanceLocalStorageMiddleware, syncWithDatabaseMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
