type Comparator = 'eq' | 'lt' | 'lte' | 'gt' | 'gte';
type ParamType = number | boolean | string;
type MatchingParameter = {
  [key: string]: ParamType;
};
type MatchingParameterRule = {
  key: string;
  value: ParamType;
  comparator?: Comparator;
};
export type ConfigNode = {
  matches?: MatchingParameterRule[] | 'all';
  resolvedValue?: any;
  subGroups?: ConfigNode[];
};

const satisfiesCondition = (p1: MatchingParameterRule, paramValue: ParamType, comp: Comparator) => {
  if (comp === 'eq') {
    return p1.value === paramValue;
  } else if (comp === 'lt') {
    return paramValue < p1.value;
  } else if (comp === 'lte') {
    return paramValue <= p1.value;
  } else if (comp === 'gt') {
    return paramValue > p1.value;
  } else if (comp === 'gte') {
    return paramValue >= p1.value;
  } else {
    return false;
  }
};

const atLeastOneParamMatches = (parameters: MatchingParameter, matches?: MatchingParameterRule[] | 'all'): boolean => {
  return (
    !matches ||
    matches === 'all' ||
    !!matches.find((p1) => Object.keys(parameters).find((key) => p1.key === key && satisfiesCondition(p1, parameters[key], p1.comparator || 'eq')))
  );
};

const lookUpConfigValueRecursive = (config: ConfigNode, parameters: MatchingParameter, depth: number): any => {
  // TODO - if depth is beyond a configurable max, throw error
  if (atLeastOneParamMatches(parameters, config.matches)) {
    const matchedSubgroup = config.subGroups?.find((g) => atLeastOneParamMatches(parameters, g.matches));
    return matchedSubgroup ? lookUpConfigValueRecursive(matchedSubgroup, parameters, depth + 1) : config.resolvedValue;
  }
};

export const lookUpConfigValue = (config: ConfigNode, parameters: MatchingParameter): any => {
  return lookUpConfigValueRecursive(config, parameters, 0);
};
