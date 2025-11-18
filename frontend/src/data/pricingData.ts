export type PricingPlan = {
  plan: string;
  ideal: string;
  monthly: string;
  annualHtml: string;
  annualText: string;
  feeHtml: string;
  feeText: string;
  range: string;
  highlight?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    plan: "Starter (Launch Plan)",
    ideal: "New or small sellers testing automation",
    monthly: "$29.99 / month",
    annualHtml:
      "$299 / year  —  <span class='text-green-600 font-semibold'>(Save 2 months)</span>",
    annualText: "$299 / year — Save 2 months",
    feeHtml: "10% of recovered amount",
    feeText: "10% recovery commission",
    range: "Up to $30,000 / month",
  },
  {
    plan: "Growth Plan 🌟",
    ideal: "Growing sellers scaling operations",
    monthly: "$69.99 / month",
    annualHtml:
      "$699 / year  —  <span class='text-green-600 font-semibold'>(Save 15%)</span>",
    annualText: "$699 / year — Save 15%",
    feeHtml:
      "9% monthly — <span class='text-green-700 font-semibold'>8% with annual plan</span>",
    feeText: "9% monthly • 8% annual",
    range: "$30,001 – $100,000 / month",
    highlight: true,
  },
  {
    plan: "Enterprise Plan",
    ideal: "Large or multi-account sellers",
    monthly: "$149.99 / month",
    annualHtml:
      "$1,399 / year  —  <span class='text-green-600 font-semibold'>(Save 20%)</span>",
    annualText: "$1,399 / year — Save 20%",
    feeHtml: "7% (negotiable for high volume)",
    feeText: "7% (negotiable)",
    range: "$100,000+ / month",
  },
];

