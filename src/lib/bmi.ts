import { bmiThresholds, categoryConfig, type Gender, type Thresholds, type Category, type WeightThresholds } from "./constants";

export function calculateBMI(weight: number, height: number, weightUnit: "kg" | "jin" = "kg"): number | null {
    if (!weight || !height || weight <= 0 || height <= 0) return null;

    let weightKg = weight;
    if (weightUnit === "jin") weightKg = weight / 2;

    const heightM = height / 100;
    if (heightM <= 0 || weightKg <= 0) return null;

    return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export function getThresholds(stage: string, gender: Gender): Thresholds | null {
    const thresholds = bmiThresholds.get(stage);
    if (!thresholds) return null;
    return gender === "male" ? thresholds[0] : thresholds[1];
}

export function classifyBMI(bmi: number | null, thresholds: Thresholds | null): Category | null {
    if (bmi === null || bmi === undefined || !thresholds) return null;

    const [under, normal, over] = thresholds;

    if (bmi < under) return categoryConfig.underweight;
    if (bmi < normal) return categoryConfig.normal;
    if (bmi < over) return categoryConfig.overweight;
    return categoryConfig.obese;
}

export function calculateWeightThresholds(height: number, thresholds: Thresholds | null): WeightThresholds | null {
    if (!height || !thresholds) return null;
    const heightM = height / 100;
    if (heightM <= 0) return null;
    const [under, normal, over] = thresholds;
    return {
        underweightMax: (under * heightM * heightM).toFixed(1),
        normalMax: (normal * heightM * heightM).toFixed(1),
        overweightMax: (over * heightM * heightM).toFixed(1),
    };
}

export function calculateSegmentWidths(category: Category | null): [number, number, number, number] {
    if (!category) return [10, 70, 10, 10];
    const widths: [number, number, number, number] = [10, 10, 10, 10];
    widths[category.index] = 70;
    return widths;
}

export function calculateBarPosition(
    bmi: number | null,
    thresholds: Thresholds | null,
    category: Category | null,
    segmentWidths: [number, number, number, number]
): number {
    if (!bmi || !thresholds || !category) return 0;

    const [under, normal, over] = thresholds;
    const currentIndex = category.index;

    const segmentPositions: number[] = [];
    let pos = 0;
    for (let i = 0; i < 4; i++) {
        segmentPositions.push(pos);
        pos += segmentWidths[i];
    }

    let segmentStart: number, segmentEnd: number;
    switch (currentIndex) {
        case 0:
            segmentStart = Math.max(10, under - 5);
            segmentEnd = under;
            break;
        case 1:
            segmentStart = under;
            segmentEnd = normal;
            break;
        case 2:
            segmentStart = normal;
            segmentEnd = over;
            break;
        case 3:
            segmentStart = over;
            segmentEnd = over + 7;
            break;
        default:
            return 0;
    }

    const progress = Math.min(
        Math.max((bmi - segmentStart) / (segmentEnd - segmentStart), 0),
        1
    );
    const segmentWidth = segmentWidths[currentIndex];

    return segmentPositions[currentIndex] + progress * segmentWidth;
}

export function convertWeightText(weight: number, weightUnit: "kg" | "jin"): string {
    if (!weight || weight <= 0) return "";
    return weightUnit === "kg" ? `= ${(weight * 2).toFixed(1)} 斤` : `= ${(weight / 2).toFixed(1)} kg`;
}
