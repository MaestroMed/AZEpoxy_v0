import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { RAL_COLORS, type RALFamily } from "@/lib/ral-colors";
import { SITE } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1A1A2E",
    backgroundColor: "#F5F5F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E85D2C",
  },
  brand: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  brandSub: {
    marginTop: 4,
    fontSize: 10,
    color: "#E85D2C",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#3D3D3D",
    textAlign: "right",
  },
  h1: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.1,
    marginBottom: 16,
  },
  intro: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#3D3D3D",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    color: "#1A1A2E",
  },
  familyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  swatch: {
    width: 120,
    padding: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E5E0",
  },
  swatchColor: {
    height: 28,
    borderRadius: 2,
    marginBottom: 4,
  },
  swatchCode: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#1A1A2E",
  },
  swatchName: {
    fontSize: 8,
    color: "#6C6F70",
    marginTop: 1,
  },
  callout: {
    padding: 14,
    backgroundColor: "#1A1A2E",
    color: "#F5F5F0",
    borderRadius: 4,
    marginBottom: 20,
  },
  calloutTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#E85D2C",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 10,
    color: "#F5F5F0",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E0",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#6C6F70",
  },
});

const FAMILY_LABELS: Record<RALFamily, string> = {
  jaune: "Jaunes",
  orange: "Oranges",
  rouge: "Rouges",
  violet: "Violets",
  bleu: "Bleus",
  vert: "Verts",
  gris: "Gris",
  brun: "Bruns",
  noir: "Noirs",
  blanc: "Blancs",
};

const FEATURED_FAMILIES: RALFamily[] = [
  "noir",
  "gris",
  "blanc",
  "bleu",
  "vert",
  "rouge",
];

function PickFamily({ family }: { family: RALFamily }) {
  const colors = RAL_COLORS.filter((c) => c.family === family).slice(0, 6);
  if (!colors.length) return null;
  return (
    <View style={{ marginBottom: 16 }} wrap={false}>
      <Text style={styles.sectionTitle}>{FAMILY_LABELS[family]}</Text>
      <View style={styles.familyGrid}>
        {colors.map((c) => (
          <View key={c.code} style={styles.swatch}>
            <View style={[styles.swatchColor, { backgroundColor: c.hex }]} />
            <Text style={styles.swatchCode}>{c.code}</Text>
            <Text style={styles.swatchName}>{c.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

interface GuideOptions {
  customerName?: string;
}

function Guide({ customerName }: GuideOptions) {
  const greeting = customerName ? ` · Pour ${customerName}` : "";
  return (
    <Document title="Guide couleurs RAL — AZ Époxy" author={SITE.name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AZ ÉPOXY</Text>
            <Text style={styles.brandSub}>THERMOLAQUAGE PROFESSIONNEL</Text>
          </View>
          <Text style={styles.subtitle}>
            Guide des couleurs RAL
            {greeting}
          </Text>
        </View>

        <Text style={styles.h1}>
          Choisissez la teinte parfaite pour votre projet
        </Text>
        <Text style={styles.intro}>
          Ce guide rassemble les 36 couleurs RAL les plus demandées par nos
          clients — jantes, portails, mobilier, pièces industrielles — pour
          vous aider à trouver la bonne finition avant devis. Chaque teinte est
          disponible en mat, satiné ou brillant, et peut être combinée en
          bicolore ou avec nos finitions premium Adaptacolor.
        </Text>

        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Bon à savoir</Text>
          <Text style={styles.calloutText}>
            Les couleurs imprimées peuvent différer légèrement des teintes
            réelles appliquées au thermolaquage. Nous réalisons gratuitement
            un échantillon test sur demande avant toute commande de série.
          </Text>
        </View>

        {FEATURED_FAMILIES.slice(0, 3).map((f) => (
          <PickFamily key={f} family={f} />
        ))}

        <View style={styles.footer} fixed>
          <Text>
            {SITE.name} · {SITE.address.street}, {SITE.address.zip}{" "}
            {SITE.address.city}
          </Text>
          <Text>
            {SITE.phone} · {SITE.url.replace(/^https?:\/\//, "")}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AZ ÉPOXY</Text>
            <Text style={styles.brandSub}>THERMOLAQUAGE PROFESSIONNEL</Text>
          </View>
          <Text style={styles.subtitle}>Page 2 / 2</Text>
        </View>

        {FEATURED_FAMILIES.slice(3).map((f) => (
          <PickFamily key={f} family={f} />
        ))}

        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Prochaine étape</Text>
          <Text style={styles.calloutText}>
            Envoyez-nous une photo de vos pièces et les codes RAL qui vous
            plaisent — nous revenons sous 24h avec un chiffrage personnalisé
            et, si vous le souhaitez, un échantillon test gratuit.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {SITE.name} · {SITE.address.street}, {SITE.address.zip}{" "}
            {SITE.address.city}
          </Text>
          <Text>
            {SITE.phone} · {SITE.url.replace(/^https?:\/\//, "")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderRalGuide(options: GuideOptions = {}): Promise<Buffer> {
  return renderToBuffer(<Guide {...options} />);
}
