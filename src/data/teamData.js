export const TEAM_ROLES = [
  { key: 'carpenter', titleKey: 'booking.roles.carpenter.title', textKey: 'booking.roles.carpenter.text', rate: 15 },
  { key: 'helper', titleKey: 'booking.roles.helper.title', textKey: 'booking.roles.helper.text', rate: 8 },
  { key: 'installer', titleKey: 'booking.roles.installer.title', textKey: 'booking.roles.installer.text', rate: 18 },
  { key: 'polisher', titleKey: 'booking.roles.polisher.title', textKey: 'booking.roles.polisher.text', rate: 14 },
  { key: 'designer', titleKey: 'booking.roles.designer.title', textKey: 'booking.roles.designer.text', rate: 30 },
];

export const TEAM_PRESETS = [
  { nameKey: 'booking.presets.assembly.name', textKey: 'booking.presets.assembly.text', counts: { carpenter: 2, helper: 1 }, hours: 3 },
  { nameKey: 'booking.presets.wall_fitting.name', textKey: 'booking.presets.wall_fitting.text', counts: { installer: 1, helper: 1 }, hours: 2 },
  { nameKey: 'booking.presets.full_setup.name', textKey: 'booking.presets.full_setup.text', counts: { carpenter: 2, helper: 2, designer: 1 }, hours: 5 },
];

export const BOOKING_LIMITS = {
  minHours: 2,
  maxHours: 12,
  maxMembers: 10,
};

export const TIME_SLOTS = [
  { id: 'morning', labelKey: 'booking.time_slots.morning' },
  { id: 'afternoon', labelKey: 'booking.time_slots.afternoon' },
  { id: 'evening', labelKey: 'booking.time_slots.evening' }
];
