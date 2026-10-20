import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CircleCheck,
  CircleDashed,
  CirclePause,
  CircleSlash,
  CircleX,
  Clock,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { Tone } from '../../ui/Badge.vue'

type Look = { tone: Tone; icon: Component }

export const enrollmentLook: Record<'active' | 'paused' | 'ended', Look> = {
  active: { tone: 'ok', icon: CircleCheck },
  paused: { tone: 'warn', icon: CirclePause },
  ended: { tone: 'neutral', icon: CircleSlash },
}

export const sessionLook: Record<'scheduled' | 'cancelled' | 'rescheduled', Look> = {
  scheduled: { tone: 'accent', icon: CalendarCheck },
  cancelled: { tone: 'bad', icon: CalendarX },
  rescheduled: { tone: 'warn', icon: CalendarClock },
}

export const attendanceLook: Record<'present' | 'absent' | 'late' | 'none', Look> = {
  present: { tone: 'ok', icon: CircleCheck },
  absent: { tone: 'bad', icon: CircleX },
  late: { tone: 'warn', icon: Clock },
  none: { tone: 'neutral', icon: CircleDashed },
}
