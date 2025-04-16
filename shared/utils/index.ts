export const convertStatusToText = (status: number) => {
  switch (status) {
    case 0:
      return 'cancelled';
    case 1:
      return 'done';
    case 2:
    default:
      return 'processing';
  }
};

export const convertStatusToNumber = (status: string) => {
  switch (status) {
    case 'cancelled':
      return 0;
    case 'done':
      return 1;
    case 'processing':
    default:
      return 2;
  }
};