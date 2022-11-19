import React, { createContext, useState } from "react";

interface LoadingProps {
	children: React.ReactNode;
}

const initialValue = {
	isLoading: false,
	toggleLoading: () => {},
};

const LoadingContext = createContext(initialValue);

function LoadingProvider({ children }: LoadingProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	function toggleLoading() {
		setIsLoading(!isLoading);
	}

	return (
		<LoadingContext.Provider value={{ isLoading, toggleLoading }}>
			{children}
		</LoadingContext.Provider>
	);
}

export { LoadingContext, LoadingProvider };
