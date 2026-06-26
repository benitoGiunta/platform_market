import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { WORKFLOW_STEPS, STEP_INDEX } from "../../constants/workflow";
import type { StatutShooting } from "../../types";

type StepState = "done" | "current" | "future" | "pause";

const STYLES: Record<StepState, { circle: string; icon: string; label: string }> = {
  done: { circle: "bg-light", icon: "text-primary", label: "text-primary" },
  current: { circle: "bg-accent/20", icon: "text-accent", label: "text-accent font-bold" },
  future: { circle: "bg-light", icon: "text-gray-300", label: "text-gray-300" },
  pause: { circle: "bg-pause/20", icon: "text-pause", label: "text-pause" },
};

// Boule draggable — déplacée horizontalement, se snappe sur l'étape la plus proche au release.
function DragBall() {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "workflow-cursor",
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, 0, 0)` } : undefined;
  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      aria-label="Déplacer le curseur de statut"
      className={`h-4 w-4 touch-none rounded-full bg-accent shadow transition-transform ${
        isDragging ? "scale-110 cursor-grabbing shadow-lg" : "cursor-grab"
      }`}
    />
  );
}

function StepCell({
  step,
  state,
  isCurrent,
  onClick,
}: {
  step: (typeof WORKFLOW_STEPS)[number];
  state: StepState;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: step.statut });
  const Icon = step.icon;
  const s = STYLES[state];
  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[80px] flex-1 flex-col items-center gap-2 transition-transform ${
        isOver ? "scale-105" : ""
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={step.label}
        className={`flex h-12 w-12 items-center justify-center rounded-full ${s.circle}`}
      >
        <Icon size={20} className={s.icon} />
      </button>
      <span className={`text-xs ${s.label}`}>{step.label}</span>
      <div className="flex h-4 items-center justify-center">{isCurrent ? <DragBall /> : null}</div>
    </div>
  );
}

// Rendu pur — reçoit statut/isPaused + handlers. Aucune logique métier ici.
export function WorkflowBar({
  statut,
  isPaused,
  onStatutChange,
  onTogglePause,
}: {
  statut: StatutShooting;
  isPaused: boolean;
  onStatutChange: (statut: StatutShooting) => void;
  onTogglePause: (currentlyPaused: boolean) => void;
}) {
  const currentIndex = STEP_INDEX[statut];

  const handleDragEnd = (e: DragEndEvent) => {
    if (e.over) onStatutChange(e.over.id as StatutShooting);
  };

  const stateFor = (i: number): StepState => {
    if (isPaused && i <= currentIndex) return "pause";
    if (i < currentIndex) return "done";
    if (i === currentIndex) return "current";
    return "future";
  };

  return (
    <div>
      <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd}>
        <div className="flex items-start justify-between gap-2 overflow-x-auto pb-1">
          {WORKFLOW_STEPS.map((step, i) => (
            <StepCell
              key={step.statut}
              step={step}
              state={stateFor(i)}
              isCurrent={i === currentIndex}
              onClick={() => onStatutChange(step.statut)}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-1 flex justify-center">
        <button
          type="button"
          onClick={() => onTogglePause(isPaused)}
          aria-label={isPaused ? "Reprendre le shooting" : "Mettre le shooting en pause"}
          className="font-syne text-xs font-light text-gray-400 transition hover:text-pause"
        >
          {isPaused ? "▶ reprendre" : "⏸ pause"}
        </button>
      </div>
    </div>
  );
}
