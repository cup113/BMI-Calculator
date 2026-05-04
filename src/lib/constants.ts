export type Thresholds = [number, number, number];
export type GenderThresholds = [Thresholds, Thresholds];
export type Gender = "male" | "female";

export interface Category {
    index: number;
    label: string;
    color: string;
    lightColor: string;
    textColor: string;
    borderColor: string;
}

export interface WeightThresholds {
    underweightMax: string;
    normalMax: string;
    overweightMax: string;
}

export interface StageGroup {
    label: string;
    stages: string[];
}

export const bmiThresholds = new Map<string, GenderThresholds>([
    ["一年级", [[13.5, 18.2, 20.4], [13.3, 17.4, 19.3]]],
    ["二年级", [[13.7, 18.5, 20.5], [13.5, 17.9, 20.3]]],
    ["三年级", [[13.9, 19.5, 22.2], [13.6, 18.7, 21.2]]],
    ["四年级", [[14.2, 20.2, 22.7], [13.7, 19.5, 22.1]]],
    ["五年级", [[14.4, 21.5, 22.8], [13.8, 20.6, 23.0]]],
    ["六年级", [[14.7, 21.9, 24.3], [14.2, 20.9, 23.7]]],
    ["七年级", [[15.5, 22.2, 24.6], [14.8, 21.8, 24.5]]],
    ["八年级", [[15.7, 22.6, 25.0], [15.3, 22.3, 24.9]]],
    ["九年级", [[15.8, 22.9, 25.3], [16.0, 22.7, 25.2]]],
    ["高一", [[16.5, 23.3, 26.1], [16.5, 22.8, 25.3]]],
    ["高二", [[16.8, 23.8, 26.4], [16.9, 23.3, 25.5]]],
    ["高三", [[17.3, 23.9, 26.6], [17.1, 23.4, 25.8]]],
    ["大学", [[17.9, 24.0, 27.4], [17.2, 24.0, 28.0]]],
    ["成年", [[18.5, 24.0, 28.0], [18.5, 24.0, 28.0]]],
]);

export const stageGroups: StageGroup[] = [
    { label: "小学", stages: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"] },
    { label: "初中", stages: ["七年级", "八年级", "九年级"] },
    { label: "高中", stages: ["高一", "高二", "高三"] },
    { label: "其他", stages: ["大学", "成年"] },
];

export const categoryConfig: Record<string, Category> = {
    underweight: {
        index: 0,
        label: "偏瘦",
        color: "bg-blue-500",
        lightColor: "bg-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-500",
    },
    normal: {
        index: 1,
        label: "正常",
        color: "bg-green-500",
        lightColor: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-500",
    },
    overweight: {
        index: 2,
        label: "超重",
        color: "bg-amber-500",
        lightColor: "bg-amber-100",
        textColor: "text-amber-600",
        borderColor: "border-amber-500",
    },
    obese: {
        index: 3,
        label: "肥胖",
        color: "bg-red-500",
        lightColor: "bg-red-100",
        textColor: "text-red-600",
        borderColor: "border-red-500",
    },
};
