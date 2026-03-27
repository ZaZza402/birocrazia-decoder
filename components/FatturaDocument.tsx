import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

export interface FatturaItem {
  description: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
}

export interface FatturaData {
  from: string;
  to: string;
  logoBase64: string | null;
  invoiceNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  interest: string;
  items: FatturaItem[];
  notes: string;
  bankDetails: string;
  isForfettario: boolean;
  ritenuta: boolean;
  taxRate: number;
  roundingAmount: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

function fmt(value: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${sym}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

const s = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 10,
    color: "#09090b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: "#09090b",
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  headerRight: {
    flex: 1,
    paddingLeft: 20,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 10,
    color: "#3f3f46",
    lineHeight: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  metaCell: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fafaf9",
    borderLeftWidth: 2,
    borderLeftColor: "#e4e4e7",
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#09090b",
    padding: 8,
    marginBottom: 0,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: "#fafaf9",
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colUnit: { flex: 1, textAlign: "center" },
  colPrice: { flex: 2, textAlign: "right" },
  colDiscount: { flex: 1, textAlign: "right" },
  colAmount: { flex: 2, textAlign: "right" },
  cellText: {
    fontSize: 10,
    color: "#3f3f46",
  },
  cellTextBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
  },
  totalsContainer: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  totalLabel: {
    fontSize: 9,
    color: "#71717a",
  },
  totalValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#09090b",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#09090b",
    marginTop: 4,
  },
  totalLabelFinal: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  totalValueFinal: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  section: {
    marginTop: 24,
  },
  notesBox: {
    padding: 12,
    backgroundColor: "#fafaf9",
    borderLeftWidth: 2,
    borderLeftColor: "#e4e4e7",
    marginTop: 6,
  },
  notesText: {
    fontSize: 9,
    color: "#52525b",
    lineHeight: 1.6,
  },
  forfettarioNote: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#f9f9f8",
  },
  forfettarioNoteText: {
    fontSize: 8,
    color: "#71717a",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: "#a1a1aa",
    letterSpacing: 0.5,
  },
  footerBrand: {
    fontSize: 7,
    color: "#a1a1aa",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
  },
});

interface Props {
  data: FatturaData;
}

export default function FatturaDocument({ data }: Props) {
  const itemSubtotals = data.items.map((item) => {
    const gross = item.quantity * item.price;
    const discountAmt = gross * (item.discount / 100);
    return gross - discountAmt;
  });
  const subtotal = itemSubtotals.reduce((a, b) => a + b, 0);
  const taxAmount = data.isForfettario ? 0 : subtotal * (data.taxRate / 100);
  const ritenutaAmount = data.ritenuta ? subtotal * 0.2 : 0;
  const marcaDaBollo = subtotal > 77.47 && data.isForfettario ? 2 : 0;
  const total =
    subtotal + taxAmount - ritenutaAmount + data.roundingAmount + marcaDaBollo;

  const sym = CURRENCY_SYMBOLS[data.currency] ?? data.currency;

  return (
    <Document
      title={`Fattura ${data.invoiceNumber}`}
      author="BurZero"
      creator="BurZero.it"
    >
      <Page size="A4" style={s.page}>
        {/* ─── HEADER ─────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {data.logoBase64 && (
              <Image style={s.logo} src={data.logoBase64} />
            )}
            <Text style={s.invoiceTitle}>Fattura</Text>
            <Text style={[s.sectionLabel, { marginTop: 10 }]}>Da</Text>
            <Text style={s.addressText}>
              {data.from || "Inserisci i tuoi dati"}
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={[s.sectionLabel, { marginTop: 4 }]}>A</Text>
            <Text style={s.addressText}>
              {data.to || "Inserisci i dati del cliente"}
            </Text>
          </View>
        </View>

        {/* ─── META ROW ────────────────────────────────── */}
        <View style={s.metaRow}>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>N. Fattura</Text>
            <Text style={s.metaValue}>{data.invoiceNumber || "—"}</Text>
          </View>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>Data</Text>
            <Text style={s.metaValue}>{data.invoiceDate || "—"}</Text>
          </View>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>Scadenza</Text>
            <Text style={s.metaValue}>{data.dueDate || "—"}</Text>
          </View>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>Valuta</Text>
            <Text style={s.metaValue}>{data.currency}</Text>
          </View>
          {data.interest ? (
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Interessi</Text>
              <Text style={s.metaValue}>{data.interest}%</Text>
            </View>
          ) : null}
        </View>

        {/* ─── LINE ITEMS TABLE ────────────────────────── */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.colDesc]}>Descrizione</Text>
          <Text style={[s.tableHeaderText, s.colQty]}>Qtà</Text>
          <Text style={[s.tableHeaderText, s.colUnit]}>Unità</Text>
          <Text style={[s.tableHeaderText, s.colPrice]}>Prezzo</Text>
          <Text style={[s.tableHeaderText, s.colDiscount]}>Sc.%</Text>
          <Text style={[s.tableHeaderText, s.colAmount]}>Importo</Text>
        </View>

        {data.items.map((item, idx) => (
          <View
            key={idx}
            style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}
          >
            <Text style={[s.cellText, s.colDesc]}>
              {item.description || "—"}
            </Text>
            <Text style={[s.cellText, s.colQty, { textAlign: "right" }]}>
              {item.quantity}
            </Text>
            <Text style={[s.cellText, s.colUnit, { textAlign: "center" }]}>
              {item.unit}
            </Text>
            <Text style={[s.cellText, s.colPrice, { textAlign: "right" }]}>
              {fmt(item.price, data.currency)}
            </Text>
            <Text style={[s.cellText, s.colDiscount, { textAlign: "right" }]}>
              {item.discount > 0 ? `${item.discount}%` : "—"}
            </Text>
            <Text
              style={[s.cellTextBold, s.colAmount, { textAlign: "right" }]}
            >
              {fmt(itemSubtotals[idx], data.currency)}
            </Text>
          </View>
        ))}

        {/* ─── TOTALS ──────────────────────────────────── */}
        <View style={s.totalsContainer}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Imponibile</Text>
            <Text style={s.totalValue}>{fmt(subtotal, data.currency)}</Text>
          </View>

          {!data.isForfettario && data.taxRate > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>IVA {data.taxRate}%</Text>
              <Text style={s.totalValue}>{fmt(taxAmount, data.currency)}</Text>
            </View>
          )}

          {data.ritenuta && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Ritenuta d'acconto (20%)</Text>
              <Text style={s.totalValue}>
                -{fmt(ritenutaAmount, data.currency)}
              </Text>
            </View>
          )}

          {marcaDaBollo > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Marca da bollo</Text>
              <Text style={s.totalValue}>{fmt(marcaDaBollo, data.currency)}</Text>
            </View>
          )}

          {data.roundingAmount !== 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Arrotondamento</Text>
              <Text style={s.totalValue}>
                {fmt(data.roundingAmount, data.currency)}
              </Text>
            </View>
          )}

          <View style={s.totalRowFinal}>
            <Text style={s.totalLabelFinal}>TOTALE</Text>
            <Text style={s.totalValueFinal}>{fmt(total, data.currency)}</Text>
          </View>
        </View>

        {/* ─── BANK / NOTES ────────────────────────────── */}
        {data.bankDetails && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Coordinate bancarie</Text>
            <View style={s.notesBox}>
              <Text style={s.notesText}>{data.bankDetails}</Text>
            </View>
          </View>
        )}

        {data.notes && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Note aggiuntive</Text>
            <View style={s.notesBox}>
              <Text style={s.notesText}>{data.notes}</Text>
            </View>
          </View>
        )}

        {/* ─── FORFETTARIO LEGAL NOTE ──────────────────── */}
        {data.isForfettario && (
          <View style={s.forfettarioNote}>
            <Text style={s.forfettarioNoteText}>
              Operazione non soggetta a IVA ai sensi dell'art. 1, commi 54-89,
              Legge 23 dicembre 2014, n. 190 (Regime Forfettario).
              {marcaDaBollo > 0
                ? " Imposta di bollo assolta sull'originale ai sensi del D.P.R. 642/1972."
                : ""}
            </Text>
          </View>
        )}

        {/* ─── FOOTER ──────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Documento generato il {new Date().toLocaleDateString("it-IT")}
          </Text>
          <Text style={s.footerBrand}>BurZero.it — Strumenti Fiscali Gratuiti</Text>
        </View>
      </Page>
    </Document>
  );
}
