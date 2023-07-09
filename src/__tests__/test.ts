import { lookUpConfigValue, ConfigNode } from '../index';

test('lookUpConfigValue', () => {
    let configuration: ConfigNode = {
        matches: "all"
    };
    let parameters = {}
    expect(lookUpConfigValue(configuration, parameters)).toBe(undefined);
});

test('lookUpConfigValue - available movies by region', () => {

    // Configuration describing when movies are available in
    // a certain area. The rules include multiple dimensions:
    // year, country, local language, and city.

    const movieConfig: ConfigNode = {
        matches: [{
            key: "year",
            value: 2040,
            comparator: "lt" // movie available until rights expire in year 2040
        }],
        groups: [{
            matches: [{
                key: "country",
                value: "usa"
            }, {
                key: "country",
                value: "canada"
            }, {
                key: "country",
                value: "uk"
            }],
            resolvedValue: true, // movie available to these countries
            groups: [{
                // except where local rules require non-English language
                resolvedValue: false,
                matches: [{
                    key: "local_language",
                    value: "french"
                }],
                groups: [{
                    // unless a specific city made an exception
                    resolvedValue: true,
                    matches: [{
                        key: "city",
                        value: "toronto"
                    }]
                }]
            }]
        }]
    };
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "usa" })).toBe(true);
    expect(lookUpConfigValue(movieConfig, { year: 2043, country: "usa" })).toBe(undefined);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "uk" })).toBe(true);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "canada" })).toBe(true);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "canada", local_language: "english" })).toBe(true);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "canada", local_language: "french" })).toBe(false);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "canada", local_language: "french", city: "toronto" })).toBe(true);
    expect(lookUpConfigValue(movieConfig, { year: 2023, country: "canada", local_language: "french", city: "quebec" })).toBe(false);
});