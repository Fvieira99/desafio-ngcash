import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";

export default function useAuth() {
	const authContext = useContext(AuthContext);

	const navigate = useNavigate();

	if (!authContext.token) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "You are not logged in!",
		}).then(() => {
			navigate("/signin");
		});
	}

	return authContext;
}
