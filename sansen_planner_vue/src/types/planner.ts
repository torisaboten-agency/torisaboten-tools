export interface TimeSlot {
  start: string;
  end: string;
  location?: string;
}

export interface Team {
  id: string;
  name: string;
  activityId?: string;
  liveSlots: TimeSlot[];
  tokutenSlots: TimeSlot[];
}

export interface Activity {
  id: string;
  name: string;
  location: string;
}

export interface Planner {
  id: string;
  name: string;
  date: string;
  timezone: string;
  type: 'single' | 'multiple';
  // 单一活动模式字段
  activityName?: string;
  location?: string;
  // 多活动模式字段
  activities: Activity[];
  groups: Team[];
  createdAt: string;
  updatedAt: string;
}

export interface GanttTimeBar {
  startMinutes: number;
  duration: number;
  label: string;
  location?: string;
}

export interface GanttTeamData {
  team: Team;
  activity?: Activity;
  liveBars: GanttTimeBar[];
  tokutenBars: GanttTimeBar[];
}

export interface GanttTimeRange {
  start: number;
  end: number;
} 