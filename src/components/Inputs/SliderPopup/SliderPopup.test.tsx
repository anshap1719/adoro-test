import React from 'react';
import {mount, ReactWrapper} from "enzyme";
import SliderPopup, { SliderPopupProps } from "./SliderPopup";
import {findByTestAttr} from "../../../utils/test";

const setup = (props: SliderPopupProps) => mount(
    <SliderPopup {...props}>
        <h1 data-test="popup-trigger">Trigger</h1>
    </SliderPopup>
);

describe("slider popup", () => {
    let wrapper: ReactWrapper;
    let mockOnChange = jest.fn();
    let mockUpdateDialog = jest.fn();

    beforeEach(() => {
        const props: SliderPopupProps = {
            title: "Test",
            min: 0,
            max: 1200,
            step: 100,
            value: 100,
            onChange: mockOnChange,
        };

        React.useReducer = jest.fn(() => ([
            { isDialogOpen: false, val: props.value },
            mockUpdateDialog
        ]))

        wrapper = setup(props);
    });

    test('clicking on immediate child opens popup', () => {
        let child = (findByTestAttr(wrapper, 'popup-trigger') as ReactWrapper).at(1);

        expect(child.exists()).toBe(true);

        child.simulate('click');

        expect(mockUpdateDialog).toHaveBeenCalledWith({
            type: "UPDATE_IS_DIALOG_OPEN",
            payload: true
        });
    });
});