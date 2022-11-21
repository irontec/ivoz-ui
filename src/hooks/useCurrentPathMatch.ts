import React from 'react';
import { PathMatch, UNSAFE_RouteContext, useMatch } from 'react-router-dom';

const useCurrentPathMatch = function (): PathMatch {
  const { matches } = React.useContext(UNSAFE_RouteContext);
  const routeMatch = matches[matches.length - 1];

  return useMatch(routeMatch.route.path as string) as PathMatch;
};

export default useCurrentPathMatch;
