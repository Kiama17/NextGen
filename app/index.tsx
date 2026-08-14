import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bell,
  Calculator,
  ChevronRight,
  CircleUserRound,
  FileText,
  Gauge,
  Library,
  Plus,
  Settings,
  Wrench,
} from "lucide-react-native";

const colors = {
  background: "#F5F7FA",
  card: "#FFFFFF",
  primary: "#0B1F33",
  accent: "#F59E0B",
  text: "#17212B",
  muted: "#040505",
  border: "#E5EAF0",
  success: "#16A34A",
};

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>NEXTGEN</Text>
            <Text style={styles.tagline}>Giving motors a second life.</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Bell size={21} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>Good morning 👋</Text>
          <Text style={styles.subtitle}>
            Your motor rewinding workspace
          </Text>
        </View>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />

        <View style={styles.quickGrid}>
          <QuickAction
            title="Winding Calculator"
            icon={<Calculator size={25} color={colors.primary} />}
          />

          <QuickAction
            title="New Motor Job"
            icon={<Plus size={27} color={colors.primary} />}
          />

          <QuickAction
            title="Motor Library"
            icon={<Library size={25} color={colors.primary} />}
          />

          <QuickAction
            title="Saved Jobs"
            icon={<FileText size={25} color={colors.primary} />}
          />
        </View>

        {/* Recent Jobs */}
        <SectionHeader
          title="Recent Jobs"
          action="View All"
        />

        <View style={styles.card}>
          <JobItem
            name="3-Phase Motor"
            details="7.5 HP • 1440 RPM"
            status="Completed"
          />

          <JobItem
            name="Single-Phase Motor"
            details="2 HP • 2800 RPM"
            status="In Progress"
          />

          <JobItem
            name="3-Phase Motor"
            details="15 HP • 1470 RPM"
            status="Pending"
          />
        </View>

        {/* Tools */}
        <SectionHeader title="Popular Tools" />

        <View style={styles.toolCard}>
          <ToolItem
            title="Wire Size Calculator"
            subtitle="Calculate wire diameter and size"
            icon={<Gauge size={23} color={colors.accent} />}
          />

          <ToolItem
            title="Turns Calculator"
            subtitle="Calculate coil turns"
            icon={<Wrench size={23} color={colors.accent} />}
          />

          <ToolItem
            title="Cost Estimator"
            subtitle="Estimate rewinding costs"
            icon={<Calculator size={23} color={colors.accent} />}
          />
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <NavItem
            icon={<Gauge size={21} />}
            label="Dashboard"
            active
          />

          <NavItem
            icon={<Calculator size={21} />}
            label="Tools"
          />

          <NavItem
            icon={<FileText size={21} />}
            label="Jobs"
          />

          <NavItem
            icon={<Library size={21} />}
            label="Library"
          />

          <NavItem
            icon={<CircleUserRound size={21} />}
            label="Profile"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action && (
        <TouchableOpacity style={styles.viewAll}>
          <Text style={styles.viewAllText}>{action}</Text>
          <ChevronRight size={16} color={colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function QuickAction({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={styles.quickCard}>
      <View style={styles.quickIcon}>{icon}</View>
      <Text style={styles.quickTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function JobItem({
  name,
  details,
  status,
}: {
  name: string;
  details: string;
  status: string;
}) {
  return (
    <TouchableOpacity style={styles.jobItem}>
      <View style={styles.jobIcon}>
        <Wrench size={20} color={colors.primary} />
      </View>

      <View style={styles.jobInfo}>
        <Text style={styles.jobName}>{name}</Text>
        <Text style={styles.jobDetails}>{details}</Text>
      </View>

      <View style={styles.jobRight}>
        <Text
          style={[
            styles.status,
            status === "Completed" && styles.completed,
            status === "In Progress" && styles.progress,
            status === "Pending" && styles.pending,
          ]}
        >
          {status}
        </Text>

        <ChevronRight size={18} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

function ToolItem({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={styles.toolItem}>
      <View style={styles.toolIcon}>{icon}</View>

      <View style={styles.toolInfo}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolSubtitle}>{subtitle}</Text>
      </View>

      <ChevronRight size={19} color={colors.muted} />
    </TouchableOpacity>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <View style={active ? styles.activeNavIcon : styles.navIcon}>
        {React.cloneElement(icon as React.ReactElement, {
          color: active ? colors.accent : colors.muted,
        })}
      </View>

      <Text style={active ? styles.activeNavText : styles.navText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: colors.primary,
  },

  tagline: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  welcomeSection: {
    marginTop: 28,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFF4D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 19,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  jobIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2F6",
    justifyContent: "center",
    alignItems: "center",
  },

  jobInfo: {
    flex: 1,
    marginLeft: 12,
  },

  jobName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  jobDetails: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },

  jobRight: {
    alignItems: "flex-end",
    gap: 5,
  },

  status: {
    fontSize: 10,
    fontWeight: "800",
  },

  completed: {
    color: colors.success,
  },

  progress: {
    color: "#2563EB",
  },

  pending: {
    color: colors.accent,
  },

  toolCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  toolItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF4D6",
    justifyContent: "center",
    alignItems: "center",
  },

  toolInfo: {
    flex: 1,
    marginLeft: 12,
  },

  toolTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  toolSubtitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.card,
    borderRadius: 18,
    marginTop: 25,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 55,
  },

  navIcon: {
    marginBottom: 4,
  },

  activeNavIcon: {
    marginBottom: 4,
  },

  navText: {
    fontSize: 10,
    color: colors.muted,
  },

  activeNavText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: "800",
  },
});