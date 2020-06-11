import React from "react";
import {
    Box,
    Button, Container,
    createStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography, useTheme,
    withStyles
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import numeral from 'numeral';
import {monthsIndex} from "../../utils/constants";
import {BudgetCalculator, BudgetCalculatorContext} from "../../contexts/BudgetCalculatorContext";
import {Edit} from "@material-ui/icons";
import SliderPopup from "../Inputs/SliderPopup/SliderPopup";

const useStyles = makeStyles(theme =>
    createStyles({
        icon: {
            marginLeft: theme.spacing(1)
        },
        table: {
            minWidth: 650,
        },
        heading: {
            textAlign: 'center',
            marginTop: 100,
            fontSize: 24
        }
    })
);

const TableRoot = withStyles(
    createStyles({
        root: {
            maxWidth: 1200,
            margin: "40px auto"
        }
    })
)(Paper);

const BudgetView = () => {
    const theme = useTheme();
    const classes = useStyles();

    const context = React.useContext(BudgetCalculatorContext);
    const items = (context as BudgetCalculator).data.items;
    const cumulativeBudgets = (context as BudgetCalculator).cumulativeBudgets;

    return (
        <Container>
            <Typography variant="subtitle1" className={classes.heading}>
                Adoro Budget Calculator
            </Typography>
            <TableContainer component={TableRoot}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell align="left">Planned Spend</TableCell>
                            <TableCell align="left">Actual Spend</TableCell>
                            <TableCell align="left">% of Budget Spend<br />(Of This Month)</TableCell>
                            <TableCell align="left">% of Budget Remaining<br />(Cumulative)</TableCell>
                            <TableCell align="left">Days Left in Month</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, index) => {
                            let remainingDays = 0;
                            let editable = false;

                            if (item.month === items[items.length - 1].month) {
                                const today = 11;
                                remainingDays = item.daysInMonth - today;

                                editable = true;
                            }

                            return (
                                <TableRow key={item.month}>
                                    <TableCell component="th" scope="row">
                                        {monthsIndex[item.month - 1]}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editable && (
                                            <SliderPopup
                                                title="Planned Spend"
                                                min={item.spends.actual}
                                                max={30000}
                                                step={100}
                                                valuePrefix={"$"}
                                                value={item.spends.planned}
                                                onChange={value => context?.updatePlannedSpend(index, value)}
                                            >
                                                <Button>
                                                    {numeral(item.spends.planned).format('$0,0')}
                                                    <Edit fontSize="small" htmlColor={theme.palette.action.disabled} className={classes.icon} />
                                                </Button>
                                            </SliderPopup>
                                        )}
                                        {!editable && (
                                            <Box p={1}>
                                                {numeral(item.spends.planned).format('$0,0')}
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell align="left">{numeral(item.spends.actual).format('$0,0')}</TableCell>
                                    <TableCell align="left">{numeral(item.spends.actual / item.spends.planned).format('0.0%')}</TableCell>
                                    <TableCell align="left">{numeral(cumulativeBudgets[index]).format('0.0%')}</TableCell>
                                    <TableCell align="left">{remainingDays}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
};

export default BudgetView;