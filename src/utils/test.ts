import {ShallowWrapper, ReactWrapper} from "enzyme";

type Wrapper = ShallowWrapper | ReactWrapper;

export const findByTestAttr = <T extends Wrapper>(wrapper: T, attrVal: string): T | T[] => (
    wrapper.find(`[data-test="${attrVal}"]`) as (T | T[])
)