# BMI Calculator

A privacy-first, client-side BMI calculator that classifies a person's Body Mass Index against multiple authoritative standards (WHO, China Ministry of Health/Education), adapting to the person's life stage and locale.

## Language

**BmiStandard**:
A classification system with fixed BMI thresholds from an authoritative body (WHO Adult, China Adult, China Elderly, China Student, WHO Child). Each standard's level structure faithfully reflects its source document — level counts are not normalized across standards.
*Avoid*: Standard (without prefix, though unambiguous in context)

**BmiCategory**:
The age-based grouping that determines which BmiStandards are available: `student`, `adult`, or `senior`. The UI presents this as "Age Group" / "年龄段".
*Avoid*: Age (ambiguous with chronological age)

**BmiLevel**:
A classification bucket within a BmiStandard (e.g., underweight, normal, overweight, obese). A Level has visual properties (color, lightColor, textColor, borderColor) used by the gauge visualization. The number of levels varies per standard (3 in China Elderly, up to 6 in WHO Adult).

**Classification**:
The operation that maps a person's BMI value + demographics (Gender, optionally Age or Grade) to a specific BmiLevel. Returns a ClassificationResult containing the Level and its index.

**Gender**:
`male` or `female`. Required by some standards (China Student, WHO Child) that differentiate thresholds by biological sex.

**Grade**:
An atomic education level in the Chinese student system, from `grade-1` through `grade-12` plus `college`. Used by the China Student BmiStandard.

**Stage**:
A parent group of Grades (primary, junior high, senior high, other). Each Grade belongs to exactly one Stage.

**Healthy Weight Range**:
The weight range (in the current Weight Unit) corresponding to the `normal` BmiLevel for the person's height. Derived by reversing the BMI formula.

**Weight Threshold**:
The boundary weight (in kg) at which a person would transition between BmiLevels for a given height. Computed by multiplying a level's BMI cutoff by height².

**Weight Unit**:
A measurement system for weight: `kg`, `斤` (jin, 0.5 kg), or `lb` (pound, ≈0.454 kg). Locale determines the default pair: zh → kg + jin, en → kg + lb.

## Relationships

- A **BmiCategory** contains one or more **BmiStandards**
- A **BmiStandard** belongs to exactly one **BmiCategory**
- A **BmiStandard** has one or more **BmiLevels**
- A **BmiStandard** accepts a **ClassificationInput** and returns a **ClassificationResult**
- A **Stage** contains one or more **Grades**
- A **Healthy Weight Range** is derived from a **BmiStandard**'s normal **BmiLevel** + height

## Example dialogue

> **Dev:** "When a user selects 'Adult' as the BmiCategory, which BmiStandard should we use?"
> **Domain expert:** "Default to the locale-appropriate Adult standard — China Adult for zh, WHO Adult for en. But the user can switch to any standard within that category."
>
> **Dev:** "What if someone selects 'Senior' but doesn't enter an age?"
> **Domain expert:** "The China Elderly standard doesn't require age — it's a flat 22/27 cutoff. That's intentional per the WS/T 428-2013 criteria."
>
> **Dev:** "The China Student standard needs both Gender and Grade. Can we show the result without both?"
> **Domain expert:** "No — Classification requires all fields a BmiStandard lists as required. Missing fields means null result."

## Flagged ambiguities

- `BmiCategory` type is `"student" | "adult" | "senior"` but the UI label reads "Age Group" / "年龄段" — the code type name differs from the UI presentation term.
