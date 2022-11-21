import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Filters } from "../pages/Transactions";
import { Dispatch, SetStateAction } from "react";

interface Props {
	filters: Filters;
	setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function FiltersBox({ filters, setFilters }: Props) {
	const handleWhereFilter = (
		event: React.MouseEvent<HTMLElement>,
		newWhereFilter: string | null
	) => {
		if (newWhereFilter !== null) {
			setFilters({ ...filters, where: newWhereFilter });
		}
	};

	const handleOrderByFilter = (
		event: React.MouseEvent<HTMLElement>,
		newOrderByFilter: string | null
	) => {
		if (newOrderByFilter !== null) {
			setFilters({ ...filters, orderBy: newOrderByFilter });
		}
	};

	return (
		<Stack direction="row" spacing={4} mb={8}>
			<ToggleButtonGroup
				value={filters.where}
				exclusive
				onChange={handleWhereFilter}
				aria-label="text alignment"
			>
				<ToggleButton value="" aria-label="All">
					all
				</ToggleButton>
				<ToggleButton value="debitedAccountId" aria-label="Cash out">
					cashout
				</ToggleButton>
				<ToggleButton value="creditedAccountId" aria-label="Cash in">
					cashin
				</ToggleButton>
			</ToggleButtonGroup>

			<ToggleButtonGroup
				value={filters.orderBy}
				onChange={handleOrderByFilter}
				aria-label="device"
				exclusive
			>
				<ToggleButton value="asc" aria-label="asc">
					asc
				</ToggleButton>
				<ToggleButton value="desc" aria-label="desc">
					desc
				</ToggleButton>
			</ToggleButtonGroup>
		</Stack>
	);
}
