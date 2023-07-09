type MatchingParameter = {
    key: string;
    value: string;
}
export type ConfigNode = {
    matches: MatchingParameter[] | "all";
    value?: any;
    groups?: ConfigNode[];
}

const atLeastOneParamMatches = (matches: MatchingParameter[] | "all", parameters: MatchingParameter[]): boolean => {
    return matches === "all" || !!matches.find(p1 => parameters.find(p2 => (p1.key === p2.key && p1.value === p2.value)));
}

const lookUpConfigValueRecursive = (config: ConfigNode, parameters: MatchingParameter[], depth: number): any => {
    // TODO - if depth is beyond a configurable max, throw error
    if (atLeastOneParamMatches(config.matches, parameters)) {
        const matchedSubgroup = config.groups?.find(g => atLeastOneParamMatches(g.matches, parameters));
        return matchedSubgroup ? lookUpConfigValueRecursive(matchedSubgroup, parameters, depth + 1) : config.value;
    }
}

export const lookUpConfigValue = (config: ConfigNode, parameters: MatchingParameter[]): any => {
    return lookUpConfigValueRecursive(config, parameters, 0);
}
