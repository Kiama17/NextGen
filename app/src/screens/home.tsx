import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface QuickAction {
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
}

interface RecentJob {
  id: string;
  motor: string;
  details: string;
  status: "Completed" | "In Progress";
  date: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Winding Calculator",
    subtitle: "Calculate motor winding data",
    icon: "calculator-outline",
    color: "#2563EB",
  },
  {
    title: "Motor Data",
    subtitle: "View saved motor specs",
    icon: "settings-outline",
    color: "#7C3AED",
  },
  {
    title: "Winding Diagrams",
    subtitle: "Browse winding diagrams",
    icon: "git-network-outline",
    color: "#059669",
  },
  {
    title: "Saved Jobs",
    subtitle: "Manage your rewinding jobs",
    icon: "briefcase-outline",
    color: "#EA580C",
  },
];

const recentJobs: RecentJob[] = [
  {
    id: "NG-001",
    motor: "3 Phase Induction Motor",
    details: "7.5 HP • 1440 RPM",
    status: "Completed",
    date: "Today",
  },
  {
    id: "NG-002",
    motor: "Single Phase Motor",
    details: "2 HP • 2800 RPM",
    status: "In Progress",
    date: "Yesterday",
  },
  {
    id: "NG-003",
    motor: "3 Phase Motor",
    details: "15 HP • 1450 RPM",
    status: "Completed",
    date: "12 Aug",
  },
];

export default function HomeScreen() {
  const handleAction = (action: string) => {
    console.log(`Selected: ${action}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NextGen</Text>
            <Text style={styles.tagline}>Power Pro Tools</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={23} color="#111827" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* WELCOME CARD */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeSmall}>WELCOME BACK</Text>
            <Text style={styles.welcomeTitle}>
              Motor rewinding made easier.
            </Text>
            <Text style={styles.welcomeDescription}>
              Calculate, record and manage your motor rewinding work in one
              place.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleAction("Start New Job")}
            >
              <Text style={styles.primaryButtonText}>Start New Job</Text>
              <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.motorIcon}>
            <MaterialCommunityIcons
              name="engine-outline"
              size={64}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <SectionHeader title="Quick Actions" />

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => handleAction(action.title)}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${action.color}15` },
                ]}
              >
                <Ionicons name={action.icon} size={25} color={action.color} />
              </View>

              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>

              <View style={styles.cardArrow}>
                <Ionicons name="arrow-forward" size={15} color={action.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* RECENT JOBS */}
        <SectionHeader
          title="Recent Jobs"
          action="View All"
          onAction={() => handleAction("View All Jobs")}
        />

        <View style={styles.jobsContainer}>
          {recentJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              activeOpacity={0.8}
              onPress={() => handleAction(job.id)}
            >
              <View style={styles.jobIcon}>
                <MaterialCommunityIcons
                  name="engine-outline"
                  size={23}
                  color="#2563EB"
                />
              </View>

              <View style={styles.jobInfo}>
                <Text style={styles.jobMotor}>{job.motor}</Text>
                <Text style={styles.jobDetails}>{job.details}</Text>
                <Text style={styles.jobId}>{job.id}</Text>
              </View>

              <View style={styles.jobRight}>
                <View
                  style={[
                    styles.statusBadge,
                    job.status === "Completed"
                      ? styles.completedBadge
                      : styles.progressBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      job.status === "Completed"
                        ? styles.completedText
                        : styles.progressText,
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>

                <Text style={styles.jobDate}>{job.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* TOOLS */}
        <SectionHeader title="Tools & Calculators" />

        <View style={styles.toolsContainer}>
          <ToolCard
            icon="calculator-outline"
            title="Winding Calculator"
            description="Slots, coils, turns & wire size"
            onPress={() => handleAction("Winding Calculator")}
          />

          <ToolCard
            icon="flash-outline"
            title="Electrical Calculator"
            description="Voltage, current, power & resistance"
            onPress={() => handleAction("Electrical Calculator")}
          />

          <ToolCard
            icon="speedometer-outline"
            title="Motor Speed"
            description="Calculate synchronous speed & slip"
            onPress={() => handleAction("Motor Speed")}
          />

          <ToolCard
            icon="swap-horizontal-outline"
            title="Wire Conversion"
            description="AWG, SWG & wire diameter"
            onPress={() => handleAction("Wire Conversion")}
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="engine-outline"
            size={24}
            color="#2563EB"
          />
          <Text style={styles.footerText}>Giving motors a second life.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* SECTION HEADER */

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* TOOL CARD */

function ToolCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: IconName;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.toolCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.toolIcon}>
        <Ionicons name={icon} size={22} color="#2563EB" />
      </View>

      <View style={styles.toolInfo}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDescription}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 35,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 18,
  },

  brand: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.7,
  },

  tagline: {
    fontSize: 12,
    color: "#64748B",
    marginTop: -2,
    fontWeight: "600",
  },

  notificationButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },

  /* WELCOME */

  welcomeCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 22,
    minHeight: 210,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 25,
  },

  welcomeText: {
    flex: 1,
    paddingRight: 8,
  },

  welcomeSmall: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 29,
    maxWidth: 260,
  },

  welcomeDescription: {
    color: "#CBD5E1",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
    maxWidth: 275,
  },

  primaryButton: {
    marginTop: 17,
    backgroundColor: "#2563EB",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  motorIcon: {
    position: "absolute",
    right: -8,
    bottom: 8,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  sectionAction: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "700",
  },

  /* QUICK ACTIONS */

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "48.3%",
    minHeight: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    position: "relative",
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  actionTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
  },

  actionSubtitle: {
    color: "#64748B",
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 4,
    paddingRight: 8,
  },

  cardArrow: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },

  /* JOBS */

  jobsContainer: {
    marginBottom: 25,
  },

  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  jobIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  jobInfo: {
    flex: 1,
  },

  jobMotor: {
    color: "#111827",
    fontSize: 12.5,
    fontWeight: "700",
  },

  jobDetails: {
    color: "#64748B",
    fontSize: 10.5,
    marginTop: 3,
  },

  jobId: {
    color: "#94A3B8",
    fontSize: 9.5,
    marginTop: 3,
  },

  jobRight: {
    alignItems: "flex-end",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
  },

  progressBadge: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontSize: 8.5,
    fontWeight: "800",
  },

  completedText: {
    color: "#15803D",
  },

  progressText: {
    color: "#B45309",
  },

  jobDate: {
    color: "#94A3B8",
    fontSize: 9,
    marginTop: 6,
  },

  /* TOOLS */

  toolsContainer: {
    marginBottom: 25,
  },

  toolCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  toolIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  toolInfo: {
    flex: 1,
  },

  toolTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },

  toolDescription: {
    color: "#64748B",
    fontSize: 10.5,
    marginTop: 3,
  },

  /* FOOTER */

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    gap: 7,
  },

  footerText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
});
