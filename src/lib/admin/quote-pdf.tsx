import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Quote, QuoteItem } from "@/lib/db";
import { SITE } from "@/lib/utils";

const EMBER = "#E85D2C";
const NIGHT = "#1A1A2E";
const eur = (v: string | number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    Number(v),
  );
const dateFr = (d?: Date | string | null) =>
  d
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(d))
    : "—";

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingHorizontal: 42,
    paddingBottom: 60,
    fontSize: 9,
    color: "#2D2D2D",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NIGHT },
  brandEmber: { color: EMBER },
  brandSub: { fontSize: 8, color: "#6E6E80", marginTop: 2 },
  docTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: NIGHT, textAlign: "right" },
  docNumber: { fontSize: 10, color: EMBER, textAlign: "right", marginTop: 2 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  block: { width: "47%" },
  blockTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: EMBER,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  line: { marginBottom: 2, color: "#3D3D3D" },
  table: { marginTop: 6 },
  tHead: {
    flexDirection: "row",
    backgroundColor: NIGHT,
    color: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E0",
  },
  cDesc: { width: "50%" },
  cQty: { width: "15%", textAlign: "right" },
  cPu: { width: "17%", textAlign: "right" },
  cTotal: { width: "18%", textAlign: "right" },
  itemLabel: { fontFamily: "Helvetica-Bold", color: NIGHT },
  itemDesc: { fontSize: 7.5, color: "#6E6E80", marginTop: 1 },
  totals: { marginTop: 14, marginLeft: "auto", width: "42%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalLabel: { color: "#6E6E80" },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: NIGHT,
  },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: NIGHT },
  grandValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: EMBER },
  notes: { marginTop: 22, padding: 10, backgroundColor: "#F5F5F0", borderRadius: 4 },
  notesTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NIGHT, marginBottom: 3 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 42,
    right: 42,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5E0",
    paddingTop: 8,
    fontSize: 7,
    color: "#9090A0",
    textAlign: "center",
  },
});

export function QuoteDocument({
  quote,
  items,
}: {
  quote: Quote;
  items: QuoteItem[];
}) {
  return (
    <Document
      title={`Devis ${quote.number}`}
      author={SITE.name}
      subject={`Devis pour ${quote.clientName}`}
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brand}>
              AZ <Text style={s.brandEmber}>ÉPOXY</Text>
            </Text>
            <Text style={s.brandSub}>Thermolaquage poudre époxy · Île-de-France</Text>
          </View>
          <View>
            <Text style={s.docTitle}>DEVIS</Text>
            <Text style={s.docNumber}>{quote.number}</Text>
          </View>
        </View>

        {/* Emitter + client */}
        <View style={s.metaRow}>
          <View style={s.block}>
            <Text style={s.blockTitle}>Émetteur</Text>
            <Text style={s.line}>{SITE.name}</Text>
            <Text style={s.line}>{SITE.address.street}</Text>
            <Text style={s.line}>
              {SITE.address.zip} {SITE.address.city}
            </Text>
            <Text style={s.line}>{SITE.phone}</Text>
            <Text style={s.line}>{SITE.email}</Text>
          </View>
          <View style={s.block}>
            <Text style={s.blockTitle}>Client</Text>
            <Text style={s.line}>{quote.clientName}</Text>
            {quote.clientCompany ? <Text style={s.line}>{quote.clientCompany}</Text> : null}
            {quote.clientAddress ? <Text style={s.line}>{quote.clientAddress}</Text> : null}
            {quote.clientPhone ? <Text style={s.line}>{quote.clientPhone}</Text> : null}
            {quote.clientEmail ? <Text style={s.line}>{quote.clientEmail}</Text> : null}
            <Text style={[s.line, { marginTop: 6 }]}>
              Date : {dateFr(quote.createdAt)}
            </Text>
            {quote.validUntil ? (
              <Text style={s.line}>Valable jusqu&apos;au : {dateFr(quote.validUntil)}</Text>
            ) : null}
          </View>
        </View>

        {/* Items */}
        <View style={s.table}>
          <View style={s.tHead}>
            <Text style={s.cDesc}>Désignation</Text>
            <Text style={s.cQty}>Qté</Text>
            <Text style={s.cPu}>PU HT</Text>
            <Text style={s.cTotal}>Total HT</Text>
          </View>
          {items.map((it) => (
            <View key={it.id} style={s.tRow} wrap={false}>
              <View style={s.cDesc}>
                <Text style={s.itemLabel}>{it.label}</Text>
                {it.description ? <Text style={s.itemDesc}>{it.description}</Text> : null}
              </View>
              <Text style={s.cQty}>
                {Number(it.quantity)} {it.unit}
              </Text>
              <Text style={s.cPu}>{eur(it.unitPrice)}</Text>
              <Text style={s.cTotal}>{eur(it.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Sous-total HT</Text>
            <Text>{eur(quote.subtotal)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>TVA {Number(quote.taxRate)}%</Text>
            <Text>{eur(quote.taxAmount)}</Text>
          </View>
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>Total TTC</Text>
            <Text style={s.grandValue}>{eur(quote.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes ? (
          <View style={s.notes}>
            <Text style={s.notesTitle}>Notes</Text>
            <Text>{quote.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <Text style={s.footer} fixed>
          {SITE.name} — {SITE.address.street}, {SITE.address.zip}{" "}
          {SITE.address.city} · {SITE.phone} · {SITE.email}
          {"\n"}Devis valable 30 jours sauf mention contraire. Thermolaquage poudre
          époxy, sablage, finitions spéciales.
        </Text>
      </Page>
    </Document>
  );
}
