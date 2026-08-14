import { StyleSheet, View } from "react-native";

import {
  Field,
  OptionGroup,
  Section,
  TextField,
} from "@/components/form-controls";
import type { Motor, MotorType, WindingInfo } from "@/lib/motors";

function updateWinding(
  base: WindingInfo,
  // allow extra transient properties like coilGroups/slots coming from the form
  patch: Partial<WindingInfo> & { [key: string]: any },
): WindingInfo {
  return { ...base, ...patch };
}

export function MotorForm({
  value,
  onChange,
}: {
  value: Motor;
  onChange: (next: Motor) => void;
}) {
  const set = (patch: Partial<Motor>) => onChange({ ...value, ...patch });

  return (
    <View style={styles.container}>
      <Section title="Motor type">
        <Field label="Type" required>
          <OptionGroup<MotorType>
            value={value.type}
            onValueChange={(type) => {
              if (type === value.type) return;
              if (type === "single-phase") {
                set({
                  type,
                  threePhaseWinding: undefined,
                  startingWinding: {
                    pitch: "",
                    turns: "",
                    swg: "",
                    connection: "",
                  },
                });
              } else {
                set({
                  type,
                  startingWinding: undefined,
                  threePhaseWinding: {
                    pitch: "",
                    turns: "",
                    swg: "",
                    connection: "",
                  },
                });
              }
            }}
            options={[
              { value: "single-phase", label: "Single-phase" },
              { value: "three-phase", label: "Three-phase" },
            ]}
          />
        </Field>
      </Section>

      <Section title="Basic information">
        <Field label="Motor name / ID" required>
          <TextField
            value={value.name}
            onChangeText={(name) => set({ name })}
            placeholder="e.g. Motor #001"
          />
        </Field>
        <Field label="Manufacturer">
          <TextField
            value={value.manufacturer}
            onChangeText={(manufacturer) => set({ manufacturer })}
            placeholder="e.g. Siemens"
          />
        </Field>
        <Field label="Model">
          <TextField
            value={value.model}
            onChangeText={(model) => set({ model })}
            placeholder="e.g. 1LE0001"
          />
        </Field>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Field label="HP">
              <TextField
                value={value.hp}
                onChangeText={(hp) => set({ hp })}
                placeholder="5"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
          <View style={styles.flex}>
            <Field label="kW">
              <TextField
                value={value.kw}
                onChangeText={(kw) => set({ kw })}
                placeholder="3.7"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Field label="Voltage (V)">
              <TextField
                value={value.voltage}
                onChangeText={(voltage) => set({ voltage })}
                placeholder="415"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
          <View style={styles.flex}>
            <Field label="Current (A)">
              <TextField
                value={value.current}
                onChangeText={(current) => set({ current })}
                placeholder="8.2"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Field label="RPM">
              <TextField
                value={value.rpm}
                onChangeText={(rpm) => set({ rpm })}
                placeholder="1440"
                keyboardType="number-pad"
              />
            </Field>
          </View>
          <View style={styles.flex}>
            <Field label="Frequency (Hz)">
              <TextField
                value={value.frequency}
                onChangeText={(frequency) => set({ frequency })}
                placeholder="50"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
        </View>
      </Section>

      <Section title="Running winding">
        <WindingFields
          winding={value.runningWinding}
          onChange={(rw) => set({ runningWinding: rw })}
          showWireDiameter
          showCoils
        />
      </Section>

      {value.type === "single-phase" && value.startingWinding ? (
        <Section title="Starting winding">
          <WindingFields
            winding={value.startingWinding}
            onChange={(sw) => set({ startingWinding: sw })}
          />
        </Section>
      ) : null}

      {value.type === "three-phase" && value.threePhaseWinding ? (
        <Section title="Three-phase winding">
          <WindingFields
            winding={value.threePhaseWinding}
            onChange={(tw) => set({ threePhaseWinding: tw })}
            showCoils
          />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Field label="Coil groups">
                <TextField
                  value={value.threePhaseWinding.coilGroups ?? ""}
                  onChangeText={(coilGroups) =>
                    set({
                      threePhaseWinding: updateWinding(
                        value.threePhaseWinding!,
                        { coilGroups },
                      ),
                    })
                  }
                  placeholder="e.g. 4"
                  keyboardType="number-pad"
                />
              </Field>
            </View>
            <View style={styles.flex}>
              <Field label="Slots">
                <TextField
                  value={value.threePhaseWinding.slots ?? ""}
                  onChangeText={(slots) =>
                    set({
                      threePhaseWinding: updateWinding(
                        value.threePhaseWinding!,
                        { slots },
                      ),
                    })
                  }
                  placeholder="e.g. 24"
                  keyboardType="number-pad"
                />
              </Field>
            </View>
          </View>
        </Section>
      ) : null}

      <Section title="Notes">
        <Field label="Notes">
          <TextField
            value={value.notes ?? ""}
            onChangeText={(notes) => set({ notes })}
            placeholder="Any extra details…"
            multiline
          />
        </Field>
      </Section>
    </View>
  );
}

function WindingFields({
  winding,
  onChange,
  showCoils,
  showWireDiameter,
}: {
  winding: WindingInfo;
  onChange: (w: WindingInfo) => void;
  showCoils?: boolean;
  showWireDiameter?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Field label="Pitch">
            <TextField
              value={winding.pitch}
              onChangeText={(pitch) => onChange({ ...winding, pitch })}
              placeholder="1–6"
            />
          </Field>
        </View>
        <View style={styles.flex}>
          <Field label="Turns">
            <TextField
              value={winding.turns}
              onChangeText={(turns) => onChange({ ...winding, turns })}
              placeholder="36"
              keyboardType="number-pad"
            />
          </Field>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Field label="SWG / wire gauge">
            <TextField
              value={winding.swg}
              onChangeText={(swg) => onChange({ ...winding, swg })}
              placeholder="22"
            />
          </Field>
        </View>
        <View style={styles.flex}>
          <Field label="Connection">
            <TextField
              value={winding.connection}
              onChangeText={(connection) =>
                onChange({ ...winding, connection })
              }
              placeholder="Star / Delta"
            />
          </Field>
        </View>
      </View>
      <View style={styles.row}>
        {showCoils ? (
          <View style={styles.flex}>
            <Field label="Number of coils">
              <TextField
                value={winding.coils ?? ""}
                onChangeText={(coils) => onChange({ ...winding, coils })}
                placeholder="12"
                keyboardType="number-pad"
              />
            </Field>
          </View>
        ) : null}
        {showWireDiameter ? (
          <View style={styles.flex}>
            <Field label="Wire diameter (mm)">
              <TextField
                value={winding.wireDiameter ?? ""}
                onChangeText={(wireDiameter) =>
                  onChange({ ...winding, wireDiameter })
                }
                placeholder="0.7"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.four },
  row: { flexDirection: 'row', gap: Spacing.three },
  flex: { flex: 1 },
});
