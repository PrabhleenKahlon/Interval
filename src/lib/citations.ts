export type Citation = {
  id: string;
  text: string;
  href: string;
};

/**
 * One object is one citation. The homepage list renders this array in order,
 * and each superscript uses the matching `id`.
 */
export const citations = [
  {
    id: "continuous-tracking",
    text: "Ratcliffe, A. M., Zhai, B., Guan, Y., Jackson, D. G., & Sneyd, J. R. (2020). Patient-centred measurement of recovery from day-case surgery using wrist worn accelerometers: a pilot and feasibility study. Anaesthesia, 76, 785–797. https://doi.org/10.1111/anae.15267",
    href: "https://doi.org/10.1111/anae.15267",
  },
  {
    id: "triage",
    text: "Toth, S., Barbierik Vachalcova, M., Barbierik, K., Jarolimkova, A., Fulop, P., Dvoroznakova, M., Pella, D., & Poruban, T. (2026). Application of Telemedicine and Artificial Intelligence in Outpatient Cardiology Care: TeleAI-CVD Study (Design). Diagnostics (Basel, Switzerland), 16(1), 145. https://doi.org/10.3390/diagnostics16010145",
    href: "https://doi.org/10.3390/diagnostics16010145",
  },
  {
    id: "care-transition",
    text: "Po, H. W., Chu, Y. C., Tsai, H. C., Lin, C. L., Chen, C. Y., & Ma, M. H. (2024). Efficacy of Remote Health Monitoring in Reducing Hospital Readmissions Among High-Risk Postdischarge Patients: Prospective Cohort Study. JMIR formative research, 8, e53455. https://doi.org/10.2196/53455",
    href: "https://doi.org/10.2196/53455",
  },
] as const satisfies readonly Citation[];

export type CitationId = (typeof citations)[number]["id"];

export function citationNumber(id: CitationId) {
  return citations.findIndex((item) => item.id === id) + 1;
}
