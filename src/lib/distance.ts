export function distance(point1: number[], point2: number[]): number {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function precomputeDistances(arr: number[][]): number[][] {
  const numPoints = arr.length;
  const distances: number[][] = new Array(numPoints);

  for (let i = 0; i < numPoints; i++) {
    distances[i] = new Array(numPoints);
    for (let j = 0; j < numPoints; j++) {
      distances[i][j] = i !== j ? distance(arr[i], arr[j]) : 0;
    }
  }

  return distances;
}


export function sortArrayByClosestDistance(arr: number[][]): number[][] {
  const sortedArray = [] as number[][];
  const remainingPoints = [...arr];

  if (remainingPoints.length > 0) {
    sortedArray.push(remainingPoints.pop() as number[]);

    while (remainingPoints.length > 0) {
      const prevPoint = sortedArray[sortedArray.length - 1] as number[];
      let closestPointIndex = 0;
      let closestDistance = distance(prevPoint, remainingPoints[0]);

      for (let i = 1; i < remainingPoints.length; i++) {
        const dist = distance(prevPoint, remainingPoints[i]);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestPointIndex = i;
        }
      }

      sortedArray.push(remainingPoints.splice(closestPointIndex, 1)[0]);
    }
  }

  return sortedArray;
}