import React from 'react';
import BudgetCalculatorProvider, {BudgetViewData} from "./BudgetCalculatorContext";
import {mount, ReactWrapper} from "enzyme";

const setup = () => mount(<BudgetCalculatorProvider />);

const sampleData: BudgetViewData = {
    items: [
        {
            month: 1,
            daysInMonth: 28,
            spends: {
                planned: 10000,
                actual: 11000
            }
        },
        {
            month: 2,
            daysInMonth: 31,
            spends: {
                planned: 10000,
                actual: 6000
            }
        },
    ]
};

describe("context", () => {
    let wrapper: ReactWrapper;
    let mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockClear();
        React.useReducer = jest.fn(() => [{
            cumulativeBudgets: [],
            currentPlannedSpend: 0,
            data: sampleData
        }, mockDispatch])
        wrapper = setup();
    });

    test("current planned spend is updated to the last month's on init", () => {
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "UPDATE_CURRENT_PLANNED_SPEND",
            payload: 10000
        });
    });

    test("update cumulative budget on items update", () => {
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "UPDATE_CUMULATIVE_BUDGETS",
            payload: [-0.1, 0.3]
        });
    });
});

