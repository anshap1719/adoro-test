import React from 'react';
import {mount, ReactWrapper} from "enzyme";
import PopupContent, {PopupContentProps} from "./PopupContent";
import {findByTestAttr} from "../../../../utils/test";

import {Button} from "@material-ui/core";

const setup = (props: PopupContentProps) => mount(
    <PopupContent {...props}>
        <h1>Example Child</h1>
    </PopupContent>
);

describe('popup slider input - slider component', () =>  {
    const mockHandleChange = jest.fn((e, val) => {});
    const mockOnChange = jest.fn();

    const testProps: PopupContentProps = {
        title: "Test",
        min: 0,
        max: 1200,
        step: 100,
        value: 0,
        handleChange: mockHandleChange,
        onChange: mockOnChange
    };

    let wrapper: ReactWrapper;
    let slider: ReactWrapper;

    beforeEach(() => {
        mockHandleChange.mockClear();
        mockOnChange.mockClear();

        wrapper = setup({ ...testProps });
        slider = findByTestAttr(wrapper, 'slider-input') as ReactWrapper;
    });

    test("slider updates local value on update", (done) => {
        slider.simulate('change', {
            target: {
                value: 100
            }
        });

        setTimeout(() => {
            expect(mockHandleChange).toHaveBeenCalledWith(null, 100);
            done();
        }, 100);
    });


    test('slider respects min value prop', (done) => {
        slider.simulate('change', { target: { value: -100 }});

        setTimeout(() => {
            expect(mockHandleChange).toHaveBeenCalledWith(null, testProps.min);
            done();
        }, 100);
    });

    test('slider respects max value prop', (done) => {
        slider.simulate('change', { target: { value: 10000 }});

        setTimeout(() => {
            expect(mockHandleChange).toHaveBeenCalledWith(null, testProps.max);
            done();
        }, 100);
    });
});


describe('popup slider input - dialog component', () => {
    const mockHandleChange = jest.fn((e, val) => {});
    const mockOnChange = jest.fn();

    const testProps: PopupContentProps = {
        title: "Test",
        min: 0,
        max: 1200,
        step: 100,
        value: 0,
        handleChange: mockHandleChange,
        onChange: mockOnChange
    };

    let wrapper: ReactWrapper;
    let slider: ReactWrapper;
    let doneBtn: ReactWrapper;

    beforeEach(() => {
        mockHandleChange.mockClear();
        mockOnChange.mockClear();
        wrapper = setup(testProps);
        slider = findByTestAttr(wrapper, 'slider-input') as ReactWrapper;
        doneBtn = wrapper.find(Button).at(0);
    });

    test('calls onChange from parent on close with latest value', (done) => {
        slider.simulate('change', { target: { value: 500 } });

        setTimeout(() => {
            doneBtn.simulate('click');
            expect(mockOnChange).toHaveBeenCalledWith(500);
            done();
        }, 100);
    });
});