import React, { createContext, useState } from "react";

interface LoadingProps {
	children: React.ReactNode;
}

const initialValue = {
	isLoading: false,
	setIsLoading: (data: boolean) => {},
};

const LoadingContext = createContext(initialValue);

function LoadingProvider({ children }: LoadingProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
		</LoadingContext.Provider>
	);
}

export { LoadingContext, LoadingProvider };
