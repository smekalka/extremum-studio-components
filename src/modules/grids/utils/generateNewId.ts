export const generateNewId = (
  dataArray: Array<{ id: number | string; [key: string]: any }>
) => {
  let maxValue = dataArray.length;
  return () => {
    maxValue++;
    return maxValue;
  };
};
