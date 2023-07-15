# Multi Dimensional Config

This project provides a system for defining and retrieving configuration based on multiple dimensions.

## Usage Example

Here is a sample onfiguration that describes when a movie will be available in movie theaters. The rules specify:

- The movie will only show in the year 2023
- The movie is only available in the USA, the UK, and Canada
- Within those countries, only English speaking areas will show the movie
- Toronto is excluded from the last rule since their mayor has made a one time exception

```json
{
  "subGroups": [
    {
      "matches": [
        {
          "key": "year",
          "value": 2023,
          "comparator": "gt"
        }
      ],
      "resolvedValue": false
    },
    {
      "subGroups": [
        {
          "matches": [
            {
              "key": "country",
              "value": "usa"
            },
            {
              "key": "country",
              "value": "canada"
            },
            {
              "key": "country",
              "value": "uk"
            }
          ],
          "resolvedValue": true, // movie available to these countries
          "subGroups": [
            {
              // except where local rules require non-English language
              "resolvedValue": false,
              "matches": [
                {
                  "key": "local_language",
                  "value": "french"
                }
              ],
              "subGroups": [
                {
                  // unless a specific city made an exception
                  "resolvedValue": true,
                  "matches": [
                    {
                      "key": "city",
                      "value": "toronto"
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
}
```
