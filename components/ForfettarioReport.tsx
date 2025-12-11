import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  ForfettarioInputs,
  RegimeResult,
  formatCurrency,
} from "@/lib/forfettario-utils";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#1e293b",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#334155",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 2,
  },
  label: {
    fontSize: 10,
    color: "#475569",
  },
  value: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  comparisonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  cardForf: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  cardOrd: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  bigNumber: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  verdict: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1e293b",
    color: "white",
    borderRadius: 8,
    textAlign: "center",
  },
  verdictTitle: {
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  verdictText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disclaimer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  warningBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fef3c7",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  warningText: {
    fontSize: 9,
    color: "#92400e",
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

export const ForfettarioReport = ({ inputs, results }: ReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bur0 - Simulazione Fiscale</Text>
          <Text style={styles.subtitle}>
            Report generato il {new Date().toLocaleDateString("it-IT")}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 12,
              color: "#4f46e5",
              fontWeight: "bold",
              marginBottom: 3,
            }}
          >
            Forfettario vs Ordinario
          </Text>
          <Text style={{ fontSize: 8, color: "#64748b" }}>
            Powered by alecsdesign.xyz
          </Text>
        </View>
      </View>

      {/* INPUT SUMMARY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dati Inseriti</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fatturato Previsto</Text>
          <Text style={styles.value}>
            {formatCurrency(inputs.expectedRevenue)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Coefficiente ATECO</Text>
          <Text style={styles.value}>{inputs.atecoCoefficient * 100}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Spese Reali</Text>
          <Text style={styles.value}>
            {formatCurrency(inputs.realExpenses)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>INPS Anno Precedente</Text>
          <Text style={styles.value}>
            {formatCurrency(inputs.previousYearINPS)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tipo Clientela</Text>
          <Text style={styles.value}>
            {inputs.clientType === "b2c" ? "Privati (B2C)" : "Aziende (B2B)"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cassa Previdenziale</Text>
          <Text style={styles.value}>
            {inputs.cassaType === "gestione_separata"
              ? "Gestione Separata INPS"
              : inputs.cassaType === "artigiani_commercianti"
              ? "Artigiani/Commercianti"
              : "Cassa Professionale"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start-up (Primi 5 anni)</Text>
          <Text style={styles.value}>
            {inputs.isNewBusiness ? "Sì (5%)" : "No (15%)"}
          </Text>
        </View>
      </View>

      {/* WARNINGS */}
      {(results.forfettario.warnings.length > 0 ||
        results.ordinario.warnings.length > 0) && (
        <View style={styles.warningBox}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#92400e",
              marginBottom: 4,
            }}
          >
            AVVISI IMPORTANTI
          </Text>
          {[...results.forfettario.warnings, ...results.ordinario.warnings]
            .filter((w) => w && typeof w === "string")
            .map((warning, idx) => (
              <Text key={idx} style={styles.warningText}>
                • {warning}
              </Text>
            ))}
        </View>
      )}

      {/* COMPARISON */}
      <View style={styles.comparisonContainer}>
        {/* Forfettario Column */}
        <View style={[styles.card, styles.cardForf]}>
          <Text style={[styles.cardTitle, { color: "#047857" }]}>
            REGIME FORFETTARIO
          </Text>
          <Text style={{ fontSize: 10, textAlign: "center", color: "#047857" }}>
            Netto in Tasca
          </Text>
          <Text style={[styles.bigNumber, { color: "#047857" }]}>
            {inputs.expectedRevenue > 100000
              ? "€0 (NON DISPONIBILE)"
              : formatCurrency(results.forfettario.netIncome)}
          </Text>

          <View style={{ marginTop: 10 }}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Imposta Sostitutiva ({inputs.isNewBusiness ? "5%" : "15%"})
              </Text>
              <Text style={styles.value}>
                -{formatCurrency(results.forfettario.taxAmount)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>INPS Contributi</Text>
              <Text style={styles.value}>
                -{formatCurrency(results.forfettario.inpsContributes)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Aliquota Effettiva</Text>
              <Text style={styles.value}>
                {isFinite(results.forfettario.effectiveTaxRate)
                  ? `${results.forfettario.effectiveTaxRate.toFixed(1)}%`
                  : "0.0%"}
              </Text>
            </View>
          </View>
        </View>

        {/* Ordinario Column */}
        <View style={[styles.card, styles.cardOrd]}>
          <Text style={[styles.cardTitle, { color: "#b91c1c" }]}>
            REGIME ORDINARIO
          </Text>
          <Text style={{ fontSize: 10, textAlign: "center", color: "#b91c1c" }}>
            Netto in Tasca
          </Text>
          <Text style={[styles.bigNumber, { color: "#b91c1c" }]}>
            {formatCurrency(results.ordinario.netIncome)}
          </Text>

          <View style={{ marginTop: 10 }}>
            <View style={styles.row}>
              <Text style={styles.label}>IRPEF</Text>
              <Text style={styles.value}>
                -{formatCurrency(results.ordinario.taxAmount)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Addizionali Regionali/Comunali</Text>
              <Text style={styles.value}>
                -{formatCurrency(results.ordinario.addizionali || 0)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>INPS Contributi</Text>
              <Text style={styles.value}>
                -{formatCurrency(results.ordinario.inpsContributes)}
              </Text>
            </View>
            {results.ordinario.ivaAmount > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>IVA Persa (B2C)</Text>
                <Text style={styles.value}>
                  -{formatCurrency(results.ordinario.ivaAmount)}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Aliquota Effettiva</Text>
              <Text style={styles.value}>
                {isFinite(results.ordinario.effectiveTaxRate)
                  ? `${results.ordinario.effectiveTaxRate.toFixed(1)}%`
                  : "0.0%"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* VERDICT */}
      <View style={styles.verdict}>
        <Text style={styles.verdictTitle}>IL TUO RISULTATO</Text>
        <Text style={styles.verdictText}>{results.recommendation}</Text>
        <Text style={{ fontSize: 12, marginTop: 8, color: "#94a3b8" }}>
          Differenza Netta: {results.difference > 0 ? "+" : ""}
          {formatCurrency(results.difference)}
        </Text>
        <Text
          style={{
            fontSize: 9,
            marginTop: 8,
            color: "#cbd5e1",
            fontStyle: "italic",
          }}
        >
          {results.difference > 0
            ? "Il Regime Forfettario ti fa risparmiare rispetto all'Ordinario"
            : "Il Regime Ordinario potrebbe essere più conveniente nel tuo caso"}
        </Text>
      </View>

      {/* KEY INSIGHTS */}
      <View
        style={{
          marginTop: 15,
          padding: 10,
          backgroundColor: "#f1f5f9",
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: "#334155",
            marginBottom: 5,
          }}
        >
          ANALISI CHIAVE
        </Text>
        <Text style={{ fontSize: 9, color: "#475569", marginBottom: 3 }}>
          • Base Imponibile Forfettario:{" "}
          {formatCurrency(results.forfettario.taxableBase)} (Coeff.{" "}
          {inputs.atecoCoefficient * 100}%)
        </Text>
        <Text style={{ fontSize: 9, color: "#475569", marginBottom: 3 }}>
          • Base Imponibile IRPEF:{" "}
          {formatCurrency(results.ordinario.taxableBase)}
        </Text>
        {inputs.clientType === "b2c" && (
          <Text style={{ fontSize: 9, color: "#dc2626", fontWeight: "bold" }}>
            • ATTENZIONE B2C: In regime ordinario perdi il 22% in IVA sui
            privati
          </Text>
        )}
      </View>

      {/* DISCLAIMER */}
      <Text style={styles.disclaimer}>
        Questo documento è una simulazione indicativa basata sui dati forniti e
        sulla normativa fiscale italiana vigente al {new Date().getFullYear()}.
        Non costituisce consulenza fiscale o contabile. Per decisioni
        definitive, consulta sempre un Commercialista abilitato o un CAF. Bur0
        non si assume responsabilità per eventuali inesattezze o decisioni prese
        sulla base di questo report. • Powered by alecsdesign.xyz
      </Text>
    </Page>
  </Document>
);
