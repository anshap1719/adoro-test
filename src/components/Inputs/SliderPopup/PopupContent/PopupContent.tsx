import React from "react";
import {Button, createStyles, Divider, Grid} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import numeral from "numeral";
import {SliderPopupProps} from "../SliderPopup";
import { debounce } from 'lodash';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(
    createStyles({
        input: {
            width: '100%'
        }
    })
)

export interface PopupContentProps extends SliderPopupProps {
    value: number;
    handleChange: any;
    onClose?: any;
    isDialog?: boolean;
    onChange: (value: any) => void;
}

export const PopupContent = (props: PopupContentProps) => {
    const classes = useStyles();

    const {
        title,
        min,
        max,
        step,
        handleChange,
        onClose,
        isDialog = false,
        valuePrefix = "",
    } = props;

    const value = !!props.value ? props.value : min;
    const [val, setVal] = React.useState<number>(value);

    const updateParent = (val: any) => {
        handleChange(null, val);
    };

    const updateParentOptimized = debounce(updateParent, 100);

    const updateValue = (value: number) => {
        if (value < min) {
            setVal(min);
        } else if (value > max) {
            setVal(max);
        } else {
            setVal(value);
        }
    }

    React.useEffect(() => {
        updateParentOptimized(val);
    }, [val])

    return (
        <Box width={isDialog ? '100%' : 300} pb={3}>
            <Box py={2} width='100%'>
                {!isDialog && (
                    <>
                        <Typography variant='h6' style={{ fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{title}</Typography>
                        <Divider />
                    </>
                )}
                <Box mt={3} px={2}>
                    <Grid container item xs={12} alignItems='center'>
                        <Grid item xs={2}>&nbsp;</Grid>
                        <Grid item xs={8}>
                            <Typography
                                variant='h4'
                                style={{ fontWeight: 700, textAlign: 'center' }}
                            >
                                {valuePrefix}{numeral(val ?? min).format('0,0')}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>&nbsp;</Grid>
                    </Grid>
                </Box>
            </Box>
            <Box maxWidth={200} mx='auto'>
                <input
                    data-test="slider-input"
                    name="slider"
                    value={val}
                    onChange={(e) => updateValue(numeral(e.target.value).value())}
                    min={min}
                    max={max}
                    step={step}
                    type="range"
                    className={classes.input}
                />
            </Box>
            <Box mt={2} width='100%' textAlign='center'>
                <Button
                    onClick={e => {
                        props.onChange(val);
                        onClose?.();
                    }}
                >
                    <Typography variant='body1' style={{ fontWeight: 700, textAlign: 'center' }}>DONE</Typography>
                </Button>
            </Box>
        </Box>
    )
};

export default PopupContent;