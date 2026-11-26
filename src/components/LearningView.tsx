import { useState } from 'react';
import { Course } from '../types';
import { GraduationCap, CheckCircle2, Play, Award, Clock, ArrowRight, BookOpen, X } from 'lucide-react';

export function LearningView({
  courses,
  onCompleteLesson,
  notify
}: {
  courses: Course[];
  onCompleteLesson: (courseId: number, lessonId: number) => void;
  notify: (msg: string) => void;
}) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mint mb-1">
            <GraduationCap size={15} />
            <span>Practical Learning & Proof of Work</span>
          </div>
          <h1 className="text-lg font-bold text-white">Skills Tailored for the East African Economy</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Build high-demand capabilities, from modern software engineering to export-grade artisan commerce.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-mint">
            ✦ 2 Badges Earned
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const percent = Math.round((course.completedLessons / course.lessonsCount) * 100);

          return (
            <article
              key={course.id}
              className="rounded-2xl border border-white/[0.08] bg-panel/75 p-5 flex flex-col justify-between hover:border-white/15 transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-mint uppercase font-semibold tracking-wider">
                    {course.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{course.level}</span>
                </div>

                <h3 className="mt-2 font-bold text-white text-sm line-clamp-2">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">By {course.provider}</p>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {course.summary}
                </p>

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">{percent}% Completed</span>
                    <span className="text-slate-500">
                      {course.completedLessons}/{course.lessonsCount} lessons
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full bg-mint rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Badge Note */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium">
                  <Award size={13} />
                  <span>Unlocks: {course.badge}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock size={12} /> {course.duration}
                </span>

                <button
                  onClick={() => setSelectedCourse(course)}
                  className="flex items-center gap-1.5 rounded-xl bg-mint px-3.5 py-2 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
                >
                  <Play size={12} /> {percent === 100 ? 'Review' : 'Continue'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lesson Curriculum Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-[#0d1627] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] text-mint uppercase font-semibold">{selectedCourse.category}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-400">{selectedCourse.provider}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Curriculum Lessons:</span>
              {selectedCourse.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-panel/70 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        onCompleteLesson(selectedCourse.id, lesson.id);
                        notify(`Lesson marked as ${lesson.completed ? 'incomplete' : 'completed'}`);
                      }}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        lesson.completed
                          ? 'border-mint bg-mint text-[#07211e]'
                          : 'border-white/20 text-transparent hover:border-mint/50'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                    </button>
                    <div>
                      <span className={`font-medium ${lesson.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {lesson.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">{lesson.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onCompleteLesson(selectedCourse.id, lesson.id);
                      notify(`Started lesson: "${lesson.title}"`);
                    }}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 hover:text-mint transition"
                  >
                    {lesson.completed ? 'Replay' : 'Start'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/[0.08] pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-amber-300">
                <Award size={15} />
                <span>Completion verifies profile strength</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  notify('Progress recorded to your Umuhuza profile');
                }}
                className="rounded-xl bg-mint px-4 py-2 text-xs font-bold text-[#07211e] hover:bg-emerald-300"
              >
                Close & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
