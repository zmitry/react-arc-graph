export const nodesFromEdges = (d: any[]) => {
  return [...new Set(d.flatMap(el => [el.from, el.to]))]
    .sort()
    .map(id => ({ id: id }));
};
