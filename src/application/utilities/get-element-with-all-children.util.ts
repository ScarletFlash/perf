export function getElementWithAllChildren(rootElement: Element): Set<Element> {
  const response: Set<Element> = new Set<Element>([rootElement]);

  const parentsToCheck: Set<Element> = new Set<Element>([rootElement]);

  while (parentsToCheck.size !== 0) {
    const groupedCurrentLevelChildren: Element[][] = [];
    parentsToCheck.forEach((parent: Element) => {
      const children: Element[] = Array.from(parent.children);
      groupedCurrentLevelChildren.push(children);
      parentsToCheck.delete(parent);
    });
    const currentLevelChildren: Element[] = groupedCurrentLevelChildren.reduce(
      (accumulatedElements: Element[], currentChildrenSection: Element[]) =>
        accumulatedElements.concat(currentChildrenSection),
      []
    );
    currentLevelChildren.forEach((child: Element) => {
      response.add(child);
      parentsToCheck.add(child);
    });
  }

  return response;
}
