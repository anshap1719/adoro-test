import React from 'react';
import './App.css';
import BudgetView from "./components/BudgetView/BudgetView";
import BudgetCalculatorProvider from "./contexts/BudgetCalculatorContext";
import {ThemeProvider, useTheme} from '@material-ui/core';



function App() {
    const theme = useTheme();
    return (
        <ThemeProvider theme={theme}>
            <BudgetCalculatorProvider>
                <BudgetView />
            </BudgetCalculatorProvider>
        </ThemeProvider>
    );
}

export default App;
