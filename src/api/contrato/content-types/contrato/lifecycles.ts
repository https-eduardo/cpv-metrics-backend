import { getContractMonths } from "../../../../utils/getContractMonths";
import { parseISO } from "date-fns";

function handleLtvCalc(data) {
  const startDate = parseISO(data.dataInicio);
  const endDate = parseISO(data.dataFinal);

  const monthsInContract = getContractMonths(startDate, endDate);
  const calculatedLtv = data.mensalidade * monthsInContract;
  return calculatedLtv;
}

export default {
  beforeCreate(event) {
    const { data } = event.params;
    const calculatedLtv = handleLtvCalc(data);

    data.ltv = calculatedLtv;
  },

  beforeUpdate(event) {
    const { data } = event.params;
    const calculatedLtv = handleLtvCalc(data);

    data.ltv = calculatedLtv;
  },
};
