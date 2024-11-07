import { getContractMonths } from "../../../../utils/getContractMonths";
import { parseISO } from "date-fns";

function handleLtvCalc(data) {
  if (!data.startDate || !data.endDate) return data.ltv;

  const startDate =
    data.dataInicio instanceof Date
      ? data.dataInicio
      : parseISO(data.dataInicio);
  const endDate =
    data.dataFinal instanceof Date ? data.dataFinal : parseISO(data.dataFinal);

  const monthsInContract = getContractMonths(startDate, endDate);
  const calculatedLtv = data.mensalidade * monthsInContract;
  return calculatedLtv;
}

export default {
  beforeCreate(event) {
    const { data } = event.params;
    const calculatedLtv = handleLtvCalc(data);

    if (data.ltv === undefined || data.ltv === null) data.ltv = calculatedLtv;
  },

  beforeUpdate(event) {
    const { data } = event.params;
    const calculatedLtv = handleLtvCalc(data);

    if (data.ltv === undefined || data.ltv === null) data.ltv = calculatedLtv;
  },
};
