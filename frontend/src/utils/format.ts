const daysOfWeek = {
  sunday: "D",
  monday: "S",
  tuesday: "T",
  wednesday: "Q",
  thursday: "Q",
  friday: "S",
  saturday: "S",
};

export const formatNumberToReal = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatWeekDay = (value: string): string => daysOfWeek[value as keyof typeof daysOfWeek];
