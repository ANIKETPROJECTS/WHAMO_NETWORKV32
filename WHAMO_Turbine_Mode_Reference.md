# Turbine operation labels in WHAMO Designer

The turbine choices in WHAMO Designer refer to operating situations described in the WHAMO 3.0 User’s Manual. The interface labels are not all literal `OPTURB` keywords, so they should not be presented as an exact transcription of the manual.

## Reference mapping

| Designer label | WHAMO 3.0 manual reference |
| --- | --- |
| `GENERATE` | Exact `OPTURB` keyword. The manual defines it as synchronous-speed turbine operation. |
| `TURBGOV` | Refers to governor-controlled operation. The manual’s exact keyword is `GOVERN`, for governor-controlled turbine operation serving an isolated load. |
| `EMERGENCY` | Intended as an emergency/load-rejection closure scenario. The manual’s documented operation is `REJECT`, with a load-rejection time (`TOFF`) and a wicket-gate schedule. `EMERGENCY` is not listed as an `OPTURB` keyword in the manual. |
| `TURBINE` | General/default turbine label in the interface. The manual uses `TURBINE` to define the turbine element; it is not listed as an `OPTURB` operation keyword. Confirm this label against the installed WHAMO executable. |

The manual also documents `STARTUP` and `OFF`, which are not choices in the current Designer dropdown.

## Manual-compatible `OPTURB` examples

Use a turbine ID that exists in the input file. These examples show the manual’s documented operation keywords; each mode should be tested in a copy of a known-working input file.

```text
OPTURB ID T1 GENERATE VSCHEDULE 1 FINISH
OPTURB ID T1 REJECT TOFF 2.0 VSCHEDULE 1 FINISH
OPTURB ID T1 GOVERN LSCHEDULE 1 FINISH
OPTURB ID T1 STARTUP VSCHEDULE 1 FINISH
OPTURB ID T1 OFF FINISH
```

The referenced schedule numbers must exist in the input. `GENERATE`, `REJECT`, and `STARTUP` use a wicket-gate schedule (`VSCHEDULE`). `GOVERN` uses a generator-load schedule (`LSCHEDULE`) and governor properties. `OFF` requires no schedule.

## Test the Designer labels with WHAMO.exe

Start from an input file that already runs successfully. Make a separate copy for each test, change only the turbine’s `OPTURB` line, and keep the existing turbine ID and schedule data. Run each copy with the same WHAMO check/run procedure you normally use. Record the first diagnostic and whether the run proceeds.

These are the forms currently emitted by Designer:

```text
OPTURB ID T1 TURBINE FINISH
OPTURB ID T1 GENERATE VSCHEDULE 1 FINISH
OPTURB ID T1 TURBGOV VSCHEDULE 1 FINISH
OPTURB ID T1 EMERGENCY VSCHEDULE 1 FINISH
```

For a comparison, test the documented equivalents separately:

- Compare `TURBGOV VSCHEDULE 1` with `GOVERN LSCHEDULE 1` in an input that has a valid governor and load schedule.
- Compare `EMERGENCY VSCHEDULE 1` with `REJECT TOFF 2.0 VSCHEDULE 1` in an input that has a valid wicket-gate schedule.
- Test `TURBINE` exactly as Designer emits it; the manual does not identify it as an `OPTURB` mode.

Do not change multiple modes in the same test. A mode is confirmed for the installed executable only if WHAMO accepts the input and proceeds past input checking; a successful parse alone does not validate the hydraulic results.

## Source

Fitzgerald, R. and Van Blaricum, V. L., *Water Hammer and Mass Oscillation (WHAMO) 3.0 User’s Manual*, USACERL ADP Report 98/129, September 1998:

- Section 2.5, “System Operating Conditions,” printed pages 20–22.
- Section 4.1, `OPTURB`, printed pages 148–150.
- [Official ERDC PDF](https://erdc-library.erdc.dren.mil/server/api/core/bitstreams/81b728f8-a880-4ef8-e053-411ac80adeb3/content)
- [ERDC catalog record](https://erdc-library.erdc.dren.mil/items/81b728f7-899f-4ef8-e053-411ac80adeb3)
