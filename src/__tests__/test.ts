import { lookUpConfigValue, ConfigNode } from '../index';

test('lookUpConfigValue', () => {
    let configuration: ConfigNode = {
        matches: "all"
    };
    let parameters = []
    expect(lookUpConfigValue(configuration, parameters)).toBe(undefined);
});

test('lookUpConfigValue - available movies by region', () => {

    // Configuration describing if a movie is available in
    // a certain area. The rules include multiple dimensions:
    // year, country, local language, and city.

    const movieAvailabilityConfiguration: ConfigNode = {
        matches: [{
            key: "year",
            value: "2040",
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
            value: true, // movie available to these countries
            groups: [{
                // except where local rules require non-English language
                value: false,
                matches: [{
                    key: "local_language",
                    value: "french"
                }],
                groups: [{
                    // unless a specific city made an exception
                    value: true,
                    matches: [{
                        key: "city",
                        value: "toronto"
                    }]
                }]
            }]
        }]
    };
    let parameters = [];
    // TODO - add assertions
    expect(lookUpConfigValue(movieAvailabilityConfiguration, parameters)).toBe(false);
});