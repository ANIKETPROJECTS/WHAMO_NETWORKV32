# How the Turbine TCHAR Q and Efficiency Matrices Are Created

This guide explains, in plain language, how the turbine curve data is used to create the **Q matrix** and **Efficiency matrix** in the software.

The examples refer to the supplied `QuadrantCurvesPredefined_Turbines` text file and the calculation currently implemented in the software.

## 1. What the supplied file contains

The file contains turbine curves grouped by specific speed. For example, its first group is:

```text
SPECIFIC SPEED (US/SI): 30 / 115
NUMGATES: 9
```

That group contains curves for nine gate openings: 20%, 30%, 40%, and so on up to 100%. Under each gate opening are rows of three numbers. The software interprets each row as:

```text
Head   Q (flow)   Torque
```

For example, under `GATE: 100.00`, the file contains this row:

```text
100  100  100
```

For that source curve point:

- Reference head is 100.
- Reference Q is 100.
- Torque is 100.

The file does **not** give a separate efficiency value in each row. The software calculates the efficiency matrix using the torque values.

## 2. The settings that affect the matrices

The user selects or enters:

- **Specific Speed (Ns):** chooses which group of source curves to use.
- **Gate openings:** chooses which gate rows to create in the output.
- **Design Head:** scales the source file's reference-head values to the output HEAD values.
- **Head Steps and HEAD values:** determine the HEAD columns in the output.
- **Design Flow:** scales the Q values.
- **Design Efficiency:** scales the calculated efficiency values.

The generated Q and Efficiency matrices use the same selected gates and HEAD values.

## 3. How the HEAD values relate to the file

The head numbers in the source file are reference curve coordinates. The software relates them to the output HEAD values using Design Head.

The scale is:

```text
Head scale = Design Head / 100
```

When the software looks up a source curve point for an output HEAD value, it converts that output value back to the source file's scale:

```text
Source head used for lookup = Output HEAD / (Design Head / 100)
```

### Example

If **Design Head = 50** and an output HEAD value is **50**:

```text
Source head = 50 / (50 / 100)
            = 100
```

So the software looks up the source curves around reference head 100.

The software can automatically fill the HEAD values, or the user can edit them. Automatic values are evenly spaced across the selected source curve group's head range and scaled by Design Head. If the user edits them, the edited values are used for the lookups.

For example, if the output preview shows:

```text
HEAD 68 58 48 38 28
```

and Design Head is 50, the corresponding source heads used for lookup are:

```text
136 116 96 76 56
```

These are the same HEAD positions expressed on the source file's reference scale.

## 4. How the software finds a value between source rows

The source file only lists certain head values and gate openings. A requested value may fall between listed values. In that case, the software estimates it by **linear interpolation**—in plain language, it takes the proportional position between the two nearest rows and estimates the value there.

The software does this in two directions when needed:

1. **Between head rows at one gate opening.**
   It estimates Q and torque at the requested source head using the two surrounding head rows.
2. **Between gate curves.**
   If the requested gate opening is between two source gate curves, it estimates Q and torque between those curves.

If a requested source head is below or above the range in the file, the software uses the nearest end value of the curve rather than extending the curve beyond its data.

## 5. How each Q value is calculated

For each selected gate and HEAD value, the software first obtains a source Q value from the selected curve. It then scales that value using Design Flow:

```text
Output Q = Source curve Q × (Design Flow / 100)
```

### What this means

- If Design Flow is 100, the output Q is the source curve Q.
- If Design Flow is 200, the output Q is twice the source curve Q.
- If Design Flow is 50, the output Q is half the source curve Q.

The software rounds output Q values to three decimal places.

## 6. How each efficiency value is calculated

The source file supplies torque, not efficiency. For each gate and HEAD position, the software uses the interpolated torque, source head, and source Q to estimate efficiency:

```text
Efficiency =
    (Torque / (Source head × Source curve Q))
    × (Design Efficiency × 100)
```

For example, if Design Efficiency is `0.90`, the multiplier in the formula is:

```text
0.90 × 100 = 90
```

The result is stored as a decimal fraction:

- `0.90` means 90%.
- `0.75` means 75%.
- `0.98` means 98%.

The software limits the calculated result to the range **0 to 0.98**. Negative values are set to zero, and values above 0.98 are capped at 0.98. If the source head or source Q is very small (1 or less), the software sets efficiency to zero instead of applying the formula. Efficiency values are rounded to four decimal places.

In the current implementation, **Design Flow scales the Q matrix, but the efficiency calculation uses the source curve Q before that Design Flow scaling**.

## 7. Worked example using an exact row from the supplied file

Use the first specific-speed group, **30 US / 115 SI**. Under the 100% gate curve, the file has:

```text
100  100  100
```

Assume these settings:

```text
Design Head       = 50
Output HEAD       = 50
Design Flow       = 100
Design Efficiency = 0.90
Gate opening      = 100%
```

### Step A: Convert the output HEAD to the source head

```text
Source head = 50 / (50 / 100) = 100
```

The source row at gate 100% and source head 100 is an exact match.

### Step B: Calculate Q

The source Q is 100:

```text
Output Q = 100 × (100 / 100)
         = 100
```

The Q matrix receives `100` for this gate-and-head position.

### Step C: Calculate efficiency

The source torque is 100, the source head is 100, and the source Q is 100:

```text
Efficiency = (100 / (100 × 100)) × (0.90 × 100)
           = 0.01 × 90
           = 0.90
```

The Efficiency matrix receives `0.9000` for this same position. The Q and Efficiency values refer to the same gate opening and HEAD value.

## 8. Worked example using interpolation between gate curves

This example shows how the software handles a gate value that is not explicitly listed in the file.

Assume:

```text
Specific-speed group = 30 US / 115 SI
Design Head          = 50
Output HEAD          = 50
Gate opening         = 25%
Design Flow          = 100
Design Efficiency    = 0.90
```

As shown earlier, output HEAD 50 maps to source head 100.

The file has curves at 20% and 30% gate, but not 25%. First, the software estimates values at source head 100 on each surrounding curve.

### At 20% gate

The surrounding file rows are:

```text
99.92   24.45   21.98
119.97  30.04   29.99
```

At source head 100, interpolation gives approximately:

```text
Q       = 24.472
Torque  = 22.012
```

### At 30% gate

The surrounding file rows are:

```text
99.91   38.76   36.17
119.91  45.96   48.92
```

At source head 100, interpolation gives approximately:

```text
Q       = 38.792
Torque  = 36.227
```

### Between 20% and 30% gate

25% is halfway between 20% and 30%, so the software interpolates halfway between the two results:

```text
Q       ≈ (24.472 + 38.792) / 2 = 31.632
Torque  ≈ (22.012 + 36.227) / 2 = 29.120
```

For Design Flow 100, the output Q is approximately `31.632`.

The efficiency is approximately:

```text
Efficiency = (29.120 / (100 × 31.632)) × 90
           ≈ 0.8285
```

So this matrix position is approximately:

```text
Q          = 31.632
Efficiency = 0.8285
```

The displayed results may differ slightly in the last decimal because the source data and output values are rounded.

## 9. How to read the two matrices

The output contains a GATE list and a HEAD list. The matrices line up with those lists:

- Each **matrix row** represents one gate opening, in ascending gate order.
- Each **value across a row** represents one HEAD value, in the order shown in the HEAD list.
- The Q matrix contains flow values.
- The Efficiency matrix contains efficiency values for those same gate/head positions.

For example, if the output says:

```text
GATE 20 40 60
HEAD 50 40 30
```

then:

- The first Q row and first Efficiency row are for gate 20%.
- The second rows are for gate 40%.
- The third rows are for gate 60%.
- Within each row, the first value is for HEAD 50, the second for HEAD 40, and the third for HEAD 30.

The gate and head lists identify the matrix positions. Q and Efficiency are not matched by looking at row order alone; the same GATE and HEAD position identifies the corresponding pair.

## 10. Important interpretation

This explains the software's current calculation. It uses the supplied curves, interpolation, Design Flow scaling, and the stated torque-based efficiency formula. The generated matrix is therefore based on the data and assumptions in that curve file and the user's settings; it is not an independent manufacturer test or a separate validation of the turbine.
