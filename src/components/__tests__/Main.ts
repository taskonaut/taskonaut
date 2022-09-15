import { describe, expect, it } from 'vitest';

import { mount } from '@vue/test-utils';
import Main from '../MainView.vue';

describe('Main', () => {
    it('renders properly', () => {
        const wrapper = mount(Main, { props: { msg: 'Hello Vitest' } });
        expect(wrapper.text()).toContain('Hello Vitest');
    });
});
