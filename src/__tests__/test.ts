import { lookUpConfigValue, ConfigNode } from '../index';

test('lookUpConfigValue', () => {
    const configuration: ConfigNode = {
        matches: "all"
    };
    expect(lookUpConfigValue(configuration, [])).toBe(undefined);
});