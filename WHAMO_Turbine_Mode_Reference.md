# Turbine operation labels in WHAMO Designer

The current turbine Operation Mode choices in WHAMO Designer use documented `OPTURB` keywords in the WHAMO 3.0 User’s Manual.

## Reference mapping

| Current Designer label | WHAMO 3.0 manual reference |
| --- | --- |
| `GENERATE` | Exact `OPTURB` keyword for synchronous-speed turbine operation using a wicket-gate schedule. |
| `OFF` | Exact `OPTURB` keyword; the turbine is not operated and its wicket gates are closed. |
| `REJECT` | Exact `OPTURB` keyword for synchronous-speed operation until load rejection at `TOFF`; it uses a wicket-gate schedule. |
| `STARTUP` | Exact `OPTURB` keyword for starting from zero RPM under non-governor wicket-gate control. Speed varies without transition to synchronized operation. Pump-mode startup is not simulated. |

The current dropdown contains **GENERATE, OFF, REJECT, and STARTUP**. `TURBINE` remains the name of the turbine definition block, not an `OPTURB` operation.

## Manual-compatible `OPTURB` examples

Use a turbine ID that exists in the input file. These examples show the manual’s documented operation keywords; each mode should be tested in a copy of a known-working input file.

```text
OPTURB ID T1 GENERATE VSCHEDULE 1 FINISH
OPTURB ID T1 REJECT TOFF 2.0 VSCHEDULE 1 FINISH
OPTURB ID T1 STARTUP VSCHEDULE 1 FINISH
OPTURB ID T1 OFF FINISH
```

The referenced schedule numbers must exist in the input. `GENERATE`, `REJECT`, and `STARTUP` use a wicket-gate schedule (`VSCHEDULE`). `OFF` requires no schedule.

## Test the Designer labels with WHAMO.exe

Start from an input file that already runs successfully. Make a separate copy for each test, change only the turbine’s `OPTURB` line, and keep the existing turbine ID and schedule data. Run each copy with the same WHAMO check/run procedure you normally use. Record the first diagnostic and whether the run proceeds.

The current Designer emits these operation forms:

```text
OPTURB ID T1 GENERATE VSCHEDULE 1 FINISH
OPTURB ID T1 OFF FINISH
OPTURB ID T1 REJECT TOFF 2.0 VSCHEDULE 1 FINISH
OPTURB ID T1 STARTUP VSCHEDULE 1 FINISH
```

The Designer currently requires at least two gate-schedule pairs for GENERATE, REJECT, and STARTUP. Test each available mode separately in a copy of a known-working input file, with valid schedules and mode-specific data.

Do not change multiple modes in the same test. A mode is confirmed for the installed executable only if WHAMO accepts the input and proceeds past input checking; a successful parse alone does not validate the hydraulic results.

## Source

Fitzgerald, R. and Van Blaricum, V. L., *Water Hammer and Mass Oscillation (WHAMO) 3.0 User’s Manual*, USACERL ADP Report 98/129, September 1998:

- Section 2.5, “System Operating Conditions,” printed pages 20–22.
- Section 4.1, `OPTURB`, printed pages 148–150.
- [Official ERDC PDF](https://erdc-library.erdc.dren.mil/server/api/core/bitstreams/81b728f8-a880-4ef8-e053-411ac80adeb3/content)
- [ERDC catalog record](https://erdc-library.erdc.dren.mil/items/81b728f7-899f-4ef8-e053-411ac80adeb3)
