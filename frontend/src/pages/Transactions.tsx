import { useEffect, useState } from "react";
import Bar from "../components/Bar";
import FiltersBox from "../components/FiltersBox";
import MainContainer from "../components/MainContainer";
import TransactionBox, { TransactionData } from "../components/TransactionBox";
import useAuth from "../hooks/useAuth";
import apiService from "../services/API";

export interface Filters {
	orderBy: string;
	where: string;
}

const initialFiltersValue = {
	orderBy: "",
	where: "",
};

export default function Transactions() {
	const [filters, setFilters] = useState<Filters>(initialFiltersValue);

	const [transactions, setTransactions] = useState<TransactionData[] | null>(
		null
	);

	const { token } = useAuth();

	useEffect(() => {
		async function fetchData() {
			const response = await apiService.getUserTransactions(token, filters);
			setTransactions(response.data);
		}

		fetchData();
	}, [token, filters]);

	return (
		<MainContainer>
			<Bar />
			<FiltersBox filters={filters} setFilters={setFilters} />
			{!transactions
				? "Loading"
				: transactions.length === 0
				? "You don't have any transactions"
				: transactions.map((transaction) => {
						return (
							<TransactionBox transaction={transaction} key={transaction.id} />
						);
				  })}
		</MainContainer>
	);
}
