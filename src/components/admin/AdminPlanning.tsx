import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ListTodo,
  Loader2,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export interface PlanningItem {
  id: string;
  titel: string;
  notitie: string;
  voltooid: boolean;
  positie: number;
  created_at: string;
}

export function AdminPlanning() {
  const [items, setItems] = useState<PlanningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitel, setNewTitel] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('admin_planning_items')
      .select('*')
      .order('positie', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching planning items:', error);
      setErrorMsg('Kon de planning niet ophalen.');
    } else {
      setItems((data as PlanningItem[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const persistPositions = async (ordered: PlanningItem[]) => {
    await Promise.all(
      ordered.map((item, idx) =>
        supabase
          .from('admin_planning_items')
          .update({ positie: idx })
          .eq('id', item.id)
      )
    );
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitel.trim();
    if (!trimmed) return;

    setIsAdding(true);
    setErrorMsg(null);

    const nextPos = items.length > 0 ? Math.max(...items.map((i) => i.positie)) + 1 : 0;

    const { data, error } = await supabase
      .from('admin_planning_items')
      .insert({
        titel: trimmed,
        notitie: '',
        voltooid: false,
        positie: nextPos,
      })
      .select('*')
      .single();

    setIsAdding(false);

    if (error || !data) {
      console.error('Error adding planning item:', error);
      setErrorMsg('Kon het punt niet toevoegen.');
      return;
    }

    setItems((prev) => [...prev, data as PlanningItem]);
    setNewTitel('');
  };

  const handleToggleCompleted = async (item: PlanningItem) => {
    const updatedVoltooid = !item.voltooid;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, voltooid: updatedVoltooid } : i))
    );

    const { error } = await supabase
      .from('admin_planning_items')
      .update({ voltooid: updatedVoltooid })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating planning item:', error);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, voltooid: item.voltooid } : i))
      );
      setErrorMsg('Kon status niet opslaan.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    const { error } = await supabase
      .from('admin_planning_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting planning item:', error);
      setItems(previous);
      setErrorMsg('Kon het punt niet verwijderen.');
    }
  };

  const handleMoveIndex = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const withNewPositions = reordered.map((item, idx) => ({ ...item, positie: idx }));
    setItems(withNewPositions);
    await persistPositions(withNewPositions);
  };

  const handleDropOnItem = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const fromIndex = items.findIndex((i) => i.id === draggedId);
    const toIndex = items.findIndex((i) => i.id === targetId);
    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const withNewPositions = reordered.map((item, idx) => ({ ...item, positie: idx }));
    setItems(withNewPositions);
    setDraggedId(null);
    setDragOverId(null);

    await persistPositions(withNewPositions);
  };

  const handleSaveEdit = async (id: string) => {
    const trimmed = editingText.trim();
    setEditingId(null);
    if (!trimmed) return;

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, titel: trimmed } : i))
    );

    const { error } = await supabase
      .from('admin_planning_items')
      .update({ titel: trimmed })
      .eq('id', id);

    if (error) {
      console.error('Error updating planning title:', error);
      setErrorMsg('Kon wijziging niet opslaan.');
    }
  };

  const completedCount = items.filter((i) => i.voltooid).length;
  const openCount = items.length - completedCount;

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Toevoegen */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-soft border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal flex items-center gap-2.5">
                <ListTodo className="w-7 h-7 text-purple-accent" />
                Planning & Prioriteiten
              </h1>
              <p className="text-sm text-gray-soft mt-1">
                Voeg taken of punten toe, versleep ze (of gebruik de pijltjes) om de volgorde aan te passen, en vink ze af zodra ze klaar zijn.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-lavender/40 border border-purple-accent/15 text-center">
                <p className="text-[11px] uppercase tracking-wider text-gray-soft font-medium">
                  Openstaand
                </p>
                <p className="text-lg font-display font-bold text-charcoal">{openCount}</p>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-green-50 border border-green-200 text-center">
                <p className="text-[11px] uppercase tracking-wider text-green-700 font-medium">
                  Afgevinkt
                </p>
                <p className="text-lg font-display font-bold text-green-800">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Invoerbalk */}
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2.5">
            <Input
              value={newTitel}
              onChange={(e) => setNewTitel(e.target.value)}
              placeholder="Typ een nieuw punt voor je planning..."
              className="flex-1 h-12 bg-gray-50 border-gray-200 rounded-2xl px-4 text-sm sm:text-base"
            />
            <Button
              type="submit"
              disabled={isAdding || !newTitel.trim()}
              className="h-12 px-6 rounded-2xl bg-[#1F4E37] hover:bg-[#1F4E37]/90 text-white font-display font-bold text-sm sm:text-base shrink-0"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Toevoegen...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-1.5" />
                  Toevoegen
                </>
              )}
            </Button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Lijst van planningsbalken */}
        <div className="space-y-2.5">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Loader2 className="w-6 h-6 animate-spin text-purple-accent mx-auto mb-2" />
              <p className="text-sm text-gray-soft">Planning laden...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-purple-accent/50 mx-auto mb-3" />
              <p className="text-base font-display font-bold text-charcoal">
                Nog geen punten in je planning
              </p>
              <p className="text-sm text-gray-soft mt-1">
                Typ hierboven je eerste taak of prioriteit en klik op &ldquo;Toevoegen&rdquo;.
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              const isBeingDragged = draggedId === item.id;
              const isDragTarget = dragOverId === item.id && draggedId !== item.id;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverId !== item.id) {
                      setDragOverId(item.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverId === item.id) {
                      setDragOverId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnItem(item.id);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  className={`group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isBeingDragged
                      ? 'opacity-50 scale-[0.99] bg-lavender/30 border-purple-accent'
                      : isDragTarget
                        ? 'border-2 border-purple-accent bg-lavender/20 shadow-md'
                        : item.voltooid
                          ? 'bg-green-50/50 border-green-200/80'
                          : 'bg-white border-gray-200/90 hover:border-purple-accent/40 shadow-2xs'
                  }`}
                >
                  {/* Sleep-handvat + volgnummer */}
                  <div
                    className="flex items-center gap-1.5 text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
                    title="Versleep om van volgorde te veranderen"
                  >
                    <GripVertical className="w-4 h-4" />
                    <span className="w-6 h-6 rounded-lg bg-gray-100 text-charcoal/70 text-xs font-display font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Aankruisvakje (Checkbox) */}
                  <button
                    type="button"
                    onClick={() => handleToggleCompleted(item)}
                    aria-label={item.voltooid ? 'Markeer als onvoltooid' : 'Aankruisen als klaar'}
                    title={item.voltooid ? 'Afgevinkt (klik om ongedaan te maken)' : 'Klik om af te vinken'}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      item.voltooid
                        ? 'bg-green-600 border-green-600 text-white shadow-2xs'
                        : 'bg-white border-gray-300 hover:border-green-600'
                    }`}
                  >
                    {item.voltooid && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Tekst / Inline bewerken */}
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit(item.id);
                          } else if (e.key === 'Escape') {
                            setEditingId(null);
                          }
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border border-purple-accent bg-white text-sm sm:text-base font-medium text-charcoal outline-none"
                      />
                    ) : (
                      <p
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingText(item.titel);
                        }}
                        title="Klik om de tekst aan te passen"
                        className={`text-sm sm:text-base font-medium break-words cursor-pointer ${
                          item.voltooid
                            ? 'line-through text-gray-400'
                            : 'text-charcoal hover:text-purple-accent'
                        }`}
                      >
                        {item.titel}
                      </p>
                    )}
                  </div>

                  {/* Pijltjes omhoog/omlaag + Verwijderknop */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveIndex(index, 'up')}
                      title="Verplaats omhoog"
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-charcoal disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveIndex(index, 'down')}
                      title="Verplaats omlaag"
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-charcoal disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Verwijderen"
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/70 flex items-center justify-center text-red-600 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
