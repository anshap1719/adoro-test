import React, { ReactElement, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import {
  Dialog,
  IconButton,
  Theme
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import PopupContent from "./PopupContent/PopupContent";
import HiddenCss from "@material-ui/core/Hidden/HiddenCss";

export interface SliderPopupProps {
  children?: ReactElement;
  title: string;
  min: number;
  max: number;
  step: number;
  valuePrefix?: string;
  value: number;
  onChange: (value: any) => void;
}

const styles = (theme: Theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogCustom = withStyles({
  paper: {
    width: '100vw'
  }
})(Dialog);

type SliderPopupState = {
  isDialogOpen: boolean;
  val: number;
}

type Action = {
  type: string;
  payload: any;
}

const initialState: SliderPopupState = {
  isDialogOpen: false,
  val: 0
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "UPDATE_IS_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload }
    case "UPDATE_VAL":
      return { ...state, val: action.payload }
    default:
      return { ...state }
  }
};

const SliderPopup = (props: SliderPopupProps) => {
  const { children, title, min, value } = props;

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleChange = (event: any, newValue: number | number[]) => {
    dispatch({
      type: "UPDATE_VAL",
      payload: newValue as number
    })
  };

  useEffect(() => {
    if (state.val !== value) {
      dispatch({
        type: "UPDATE_VAL",
        payload: !!value ? value : min
      })
    }
  }, [value]);

  const updateDialog = (isOpen: boolean) => dispatch({
    type: "UPDATE_IS_DIALOG_OPEN",
    payload: isOpen
  })

  return (
    <>
      <HiddenCss smDown>
        <PopupState variant="popover" popupId="demo-popup-popover">
          {popupState => (
            <div>
              {React.cloneElement(children ?? <div />, {
                ...bindTrigger(popupState)
              })}
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <PopupContent
                  {...props}
                  value={state.val}
                  handleChange={handleChange}
                  onClose={popupState.close}
                />
              </Popover>
            </div>
          )}
        </PopupState>
      </HiddenCss>
      <HiddenCss mdUp>
        {React.cloneElement(children ?? <div />, {
          onClick: () => updateDialog(true)
        })}
        <DialogCustom onClose={e => updateDialog(false)} aria-labelledby="customized-dialog-title" open={state.isDialogOpen}>
          <DialogTitle id="customized-dialog-title" onClose={() => updateDialog(false)}>
            {title}
          </DialogTitle>
          <DialogContent dividers>
            <PopupContent
              isDialog
              {...props}
              value={state.val}
              handleChange={handleChange}
              onClose={() => updateDialog(false)}
            />
          </DialogContent>
        </DialogCustom>
      </HiddenCss>
    </>
  )
};

export default SliderPopup;
