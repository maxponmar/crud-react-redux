import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hooks/useUserActions";

export function CreateNewUser() {
	const { addUser } = useUserActions();
	const [result, setResult] = useState<"ok" | "ko" | null>(null);
	const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setResult(null);

		const form = event.target;
		const formData = new FormData(form);

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) {
			return setResult("ko");
		}
		addUser({ name, email, github });
		setResult("ok");
		form.reset();
	};
	return (
		<Card className="mt-8">
			<Title>Create New User</Title>
			<form onSubmit={handlesubmit}>
				<TextInput name="name" placeholder="Aqui el nombre" />
				<TextInput name="email" placeholder="Aqui el email" />
				<TextInput name="github" placeholder="Aqui el usuario de Github" />
				<div>
					<Button type="submit" className="mt-8">
						Crear Usuario
					</Button>
					<div>
						{result === "ok" ? (
							<Badge color="green">Guardado correctamente</Badge>
						) : null}
						{result === "ko" ? (
							<Badge color="red">Guardado correctamente</Badge>
						) : null}
					</div>
				</div>
			</form>
		</Card>
	);
}
