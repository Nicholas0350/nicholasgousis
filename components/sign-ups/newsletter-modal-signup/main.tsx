import { ModalPricing } from "./modal-pricing"


interface PlanOption {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
}

const plansSample: PlanOption[] = [
    {
        id: "basic",
        name: "Basic",
        price: "$9",
        description: "Perfect for side projects",
        features: ["5 projects", "Basic analytics", "24h support"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$19",
        description: "For professional developers",
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
        ],
    },
];


function DemoModal() {
    return <ModalPricing plans={plansSample} />
}

export { DemoModal }