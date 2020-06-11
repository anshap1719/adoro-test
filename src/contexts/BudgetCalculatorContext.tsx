import React, {createContext, useEffect} from 'react';

type BudgetViewMonthItem = {
    month: number;
    daysInMonth: number;
    spends: { // in %ages
        planned: number;
        actual: number;
    }
}

export type BudgetViewData = {
    items: BudgetViewMonthItem[]
}

const sampleData: BudgetViewData = {
    items: [
        {
            month: 1,
            daysInMonth: 31,
            spends: {
                planned: 10000,
                actual: 9000
            }
        },
        {
            month: 2,
            daysInMonth: 28,
            spends: {
                planned: 10000,
                actual: 11000
            }
        },
        {
            month: 3,
            daysInMonth: 31,
            spends: {
                planned: 10000,
                actual: 6000
            }
        },
    ]
};

export type BudgetCalculator = {
    currentPlannedSpend: number;
    updateCurrentPlannedSpend: (to: number) => void;
    updatePlannedSpend: (forItemAtIndex: number, to: number) => void;
    data: BudgetViewData;
    cumulativeBudgets: number[];
};

export const BudgetCalculatorContext = createContext(null as (BudgetCalculator | null));

type BudgetCalculatorState = {
    cumulativeBudgets: number[];
    currentPlannedSpend: number;
    data: BudgetViewData;
}

type Action = {
    type: string;
    payload: any;
}

const initialState: BudgetCalculatorState = {
    cumulativeBudgets: [],
    currentPlannedSpend: 0,
    data: sampleData
}

const reducer = (state: BudgetCalculatorState = initialState, action: Action) => {
    switch (action.type) {
        case "UPDATE_CUMULATIVE_BUDGETS":
            return {...state, cumulativeBudgets: action.payload}
        case "UPDATE_CURRENT_PLANNED_SPEND":
            return {...state, currentPlannedSpend: action.payload}
        case "UPDATE_DATA":
            return {...state, data: action.payload}
        default:
            return {...state}
    }
}

const BudgetCalculatorProvider = ({ children }: any) => {
    const [
        { data, cumulativeBudgets, currentPlannedSpend},
        dispatch
    ] = React.useReducer(reducer, initialState);

    useEffect(() => {
        updateCurrentPlannedSpend(data.items[data.items.length - 1].spends.planned);
    }, []);

    useEffect(() => {
        let cumulativeBudgets: number[] = [];

        data.items.reduce((prev: number, curr: BudgetViewMonthItem) => {
            const spent = (curr.spends.actual / curr.spends.planned);
            let currentCumulative: number;

            if (spent >= 0) {
                currentCumulative = prev + 1 - (curr.spends.actual / curr.spends.planned);
            } else {
                currentCumulative = prev + (curr.spends.actual / curr.spends.planned);
            }

            // Next line is for avoiding floating point precision issues
            currentCumulative = parseFloat(parseFloat(`${currentCumulative}`).toPrecision(2));

            cumulativeBudgets.push(currentCumulative);

            return currentCumulative;
        }, 0);

        dispatch({
            type: "UPDATE_CUMULATIVE_BUDGETS",
            payload: [ ...cumulativeBudgets ]
        });
    }, [data.items]);

    const updateCurrentPlannedSpend = (to: number) => {
        dispatch({
            type: "UPDATE_CURRENT_PLANNED_SPEND",
            payload: to
        });
    };

    const updatePlannedSpend = (forItemAtIndex: number, to: number) => {
        let newItems = Array.from(data.items) as BudgetViewMonthItem[];

        if (forItemAtIndex >= newItems.length) {
            return;
        }

        newItems[forItemAtIndex] = {
            ...(newItems[forItemAtIndex]),
            spends: {
                ...(newItems?.[forItemAtIndex]?.spends ?? {}),
                planned: to
            }
        };

        dispatch({
            type: "UPDATE_DATA",
            payload: { ...data, items: [ ...newItems ]}
        });
    };

    return (
        <BudgetCalculatorContext.Provider value={{
            data,
            currentPlannedSpend,
            cumulativeBudgets,
            updateCurrentPlannedSpend,
            updatePlannedSpend
        }}>
            {children}
        </BudgetCalculatorContext.Provider>
    )
};

export default BudgetCalculatorProvider;