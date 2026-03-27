import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  ForfettarioInputs,
  RegimeResult,
  formatCurrency,
} from "@/lib/forfettario-utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 28,
    borderBottomWidth: 3,
    borderBottomColor: "#09090b",
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 26,
    color: "#09090b",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    color: "#71717a",
    marginTop: 3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#fafaf9",
    borderLeftWidth: 2,
    borderLeftColor: "#09090b",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#71717a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 4,
  },
  label: {
    fontSize: 10,
    color: "#52525b",
  },
  value: {
    fontSize: 10,
    color: "#09090b",
    fontWeight: "bold",
  },
  comparisonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  card: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
  },
  cardWinner: {
    borderLeftWidth: 3,
    borderLeftColor: "#09090b",
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#71717a",
  },
  bigNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#09090b",
  },
  verdict: {
    marginTop: 20,
    padding: 18,
    backgroundColor: "#09090b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  verdictLabel: {
    fontSize: 9,
    color: "#a1a1aa",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  verdictText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    maxWidth: 280,
  },
  verdictDiff: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "right",
  },
  disclaimer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 7.5,
    color: "#a1a1aa",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 8,
  },
  warningBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderLeftWidth: 2,
    borderLeftColor: "#dc2626",
  },
  warningText: {
    fontSize: 9,
    color: "#3f3f46",
    marginTop: 2,
  },
  insightsBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fafaf9",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
  },
});

interface ReportProps {
  inputs: ForfettarioInputs;
  results: {
    forfettario: RegimeResult;
    ordinario: RegimeResult;
    difference: number;
    recommendation: string;
  };
}

export const ForfettarioReport = ({ inputs, results }: ReportProps) => {
  const forfettarioWins = results.difference > 0;
  const isOverCliff = inputs.expectedRevenue > 100000;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Bur0</Text>
            <Text style={styles.subtitle}>
              Simulazione Fiscale — Forfettario vs Ordinario
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 9, color: "#71717a", letterSpacing: 0.5 }}>
              {new Date().toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={{ fontSize: 9, color: "#a1a1aa", marginTop: 2 }}>
              bur0.click
            </Text>
          </View>
        </View>

        {/* INPUT SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dati Inseriti</Text>
          {[
            ["Fatturato Previsto", formatCurrency(inputs.expectedRevenue)],
            ["Coefficiente ATECO", `${inputs.atecoCoefficient * 100}%`],
            ["Spese Reali Deducibili", formatCurrency(inputs.realExpenses)],
            ["INPS Anno Precedente", formatCurrency(inputs.previousYearINPS)],
            [
              "Tipo Clientela",
              inputs.clientType === "b2c" ? "Privati (B2C)" : "Aziende (B2B)",
            ],
            [
              "Cassa Previdenziale",
              inputs.cassaType === "gestione_separata"
                ? "Gestione Separata INPS (26.07%)"
                : inputs.cassaType === "artigiani"
                  ? "Artigiani"
                  : inputs.cassaType === "commercianti"
                    ? "Commercianti"
                    : "Cassa Professionale",
            ],
            [
              "Regime Start-up",
              inputs.isNewBusiness
                ? "Sì — Aliquota 5% (primi 5 anni)"
                : "No — Aliquota 15%",
            ],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        {/* WARNINGS */}
        {(results.forfettario.warnings.length > 0 ||
          results.ordinario.warnings.length > 0) && (
          <View style={styles.warningBox}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#dc2626",
                marginBottom: 4,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Avvisi
            </Text>
            {[...results.forfettario.warnings, ...results.ordinario.warnings]
              .filter((w) => w && typeof w === "string")
              .map((warning, idx) => (
                <Text key={idx} style={styles.warningText}>
                  — {warning}
                </Text>
              ))}
          </View>
        )}

        {/* COMPARISON CARDS */}
        <View style={styles.comparisonContainer}>
          {/* FORFETTARIO */}
          <View
            style={[
              styles.card,
              forfettarioWins && !isOverCliff ? styles.cardWinner : {},
            ]}
          >
            <Text style={styles.cardTitle}>Regime Forfettario</Text>
            <Text style={{ fontSize: 9, color: "#71717a", marginBottom: 4 }}>
              Netto Annuale
            </Text>
            <Text
              style={[
                styles.bigNumber,
                isOverCliff ? { color: "#a1a1aa" } : {},
              ]}
            >
              {isOverCliff
                ? "Non disponibile"
                : formatCurrency(results.forfettario.netIncome)}
            </Text>
            {!isOverCliff && (
              <View>
                {[
                  [
                    `Imposta (${inputs.isNewBusiness ? "5%" : "15%"})`,
                    `−${formatCurrency(results.forfettario.taxAmount)}`,
                  ],
                  [
                    "INPS Contributi",
                    `−${formatCurrency(results.forfettario.inpsContributes)}`,
                  ],
                  [
                    "Aliquota Effettiva",
                    isFinite(results.forfettario.effectiveTaxRate)
                      ? `${results.forfettario.effectiveTaxRate.toFixed(1)}%`
                      : "—",
                  ],
                ].map(([label, value]) => (
                  <View key={label} style={styles.row}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </View>
            )}
            {isOverCliff && (
              <Text style={{ fontSize: 9, color: "#dc2626" }}>
                Sopra €100k si esce dal forfettario con effetto retroattivo.
              </Text>
            )}
          </View>

          {/* ORDINARIO */}
          <View
            style={[
              styles.card,
              !forfettarioWins && !isOverCliff
                ? styles.cardWinner
                : isOverCliff
                  ? styles.cardWinner
                  : {},
            ]}
          >
            <Text style={styles.cardTitle}>Regime Ordinario</Text>
            <Text style={{ fontSize: 9, color: "#71717a", marginBottom: 4 }}>
              Netto Annuale
            </Text>
            <Text style={styles.bigNumber}>
              {formatCurrency(results.ordinario.netIncome)}
            </Text>
            <View>
              {[
                ["IRPEF", `−${formatCurrency(results.ordinario.taxAmount)}`],
                [
                  "Addizionali Reg./Com.",
                  `−${formatCurrency(results.ordinario.addizionali || 0)}`,
                ],
                [
                  "INPS Contributi",
                  `−${formatCurrency(results.ordinario.inpsContributes)}`,
                ],
                ...(results.ordinario.ivaAmount > 0
                  ? [
                      [
                        "IVA Persa (B2C)",
                        `−${formatCurrency(results.ordinario.ivaAmount)}`,
                      ],
                    ]
                  : []),
                [
                  "Aliquota Effettiva",
                  isFinite(results.ordinario.effectiveTaxRate)
                    ? `${results.ordinario.effectiveTaxRate.toFixed(1)}%`
                    : "—",
                ],
              ].map(([label, value]) => (
                <View key={label} style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* VERDICT */}
        <View style={styles.verdict}>
          <View>
            <Text style={styles.verdictLabel}>Risultato</Text>
            <Text style={styles.verdictText}>{results.recommendation}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.verdictLabel}>Differenza Annuale</Text>
            <Text style={styles.verdictDiff}>
              {results.difference > 0 ? "+" : ""}
              {formatCurrency(results.difference)}
            </Text>
          </View>
        </View>

        {/* INSIGHTS */}
        <View style={styles.insightsBox}>
          <Text
            style={{
              fontSize: 9,
              color: "#71717a",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Analisi
          </Text>
          <Text style={{ fontSize: 9, color: "#52525b", marginBottom: 3 }}>
            Base imponibile forfettario:{" "}
            {formatCurrency(results.forfettario.taxableBase)} (coeff.{" "}
            {inputs.atecoCoefficient * 100}%)
          </Text>
          <Text style={{ fontSize: 9, color: "#52525b", marginBottom: 3 }}>
            Base imponibile IRPEF:{" "}
            {formatCurrency(results.ordinario.taxableBase)}
          </Text>
          {inputs.clientType === "b2c" && (
            <Text style={{ fontSize: 9, color: "#dc2626", marginTop: 2 }}>
              Attenzione B2C: in regime ordinario si perde il 22% di IVA sulle
              vendite a privati.
            </Text>
          )}
        </View>

        {/* DISCLAIMER */}
        <Text style={styles.disclaimer}>
          Simulazione indicativa basata sui dati forniti e sulla normativa
          fiscale italiana vigente al {new Date().getFullYear()}. Non
          costituisce consulenza fiscale o contabile. Per decisioni definitive,
          consulta un Commercialista abilitato. bur0.click · Bur0 non si assume
          responsabilità per decisioni prese sulla base di questo report.
        </Text>
      </Page>
    </Document>
  );
};
