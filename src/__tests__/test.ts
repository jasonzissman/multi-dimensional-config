import { lookUpConfigValue, ConfigNode } from '../index';

test('lookUpConfigValue - available movies by region', () => {
  // Configuration describing when movies are available in
  // a certain area. The rules include multiple dimensions:
  // year, country, local language, and city.

  const movieConfig: ConfigNode = {
    subGroups: [
      {
        matches: [
          {
            key: 'year',
            value: 2040,
            comparator: 'gt' // movie rights expire in year 2040
          }
        ],
        resolvedValue: false
      },
      {
        subGroups: [
          {
            matches: [
              {
                key: 'country',
                value: 'usa'
              },
              {
                key: 'country',
                value: 'canada'
              },
              {
                key: 'country',
                value: 'uk'
              }
            ],
            resolvedValue: true, // movie available to these countries
            subGroups: [
              {
                // except where local rules require non-English language
                resolvedValue: false,
                matches: [
                  {
                    key: 'local_language',
                    value: 'french'
                  }
                ],
                subGroups: [
                  {
                    // unless a specific city made an exception
                    resolvedValue: true,
                    matches: [
                      {
                        key: 'city',
                        value: 'toronto'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  let testParams;

  testParams = { year: 2023, country: 'usa' };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(true);

  testParams = { year: 2043, country: 'usa' };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(false);

  testParams = { year: 2023, country: 'uk' };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(true);

  testParams = { year: 2023, country: 'canada' };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(true);

  testParams = {
    year: 2023,
    country: 'canada',
    local_language: 'english'
  };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(true);

  testParams = {
    year: 2023,
    country: 'canada',
    local_language: 'french'
  };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(false);

  testParams = {
    year: 2023,
    country: 'canada',
    local_language: 'french',
    city: 'toronto'
  };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(true);

  testParams = {
    year: 2023,
    country: 'canada',
    local_language: 'french',
    city: 'quebec'
  };
  expect(lookUpConfigValue(movieConfig, testParams)).toBe(false);
});
