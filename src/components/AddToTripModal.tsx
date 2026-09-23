'use client';

import { useState } from 'react';
import { Calendar, Plus, Check, X, Clock } from 'lucide-react';
import { addAttractionToItineraryAction } from '@/actions/itinerary';

interface ItineraryOption {
  id: string;
  title: string;
  durationDays: number;
}

interface AddToTripModalProps {
  attractionId: string;
  attractionTitle: string;
  userItineraries: ItineraryOption[];
}

export default function AddToTripModal({
  attractionId,
  attractionTitle,
  userItineraries,
}: AddToTripModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(
    userItineraries[0]?.id || ''
  );
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [timeSlot, setTimeSlot] = useState<string>('Morning');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedItinerary = userItineraries.find(
    (it) => it.id === selectedItineraryId
  );
  const maxDays = selectedItinerary?.durationDays || 3;

  async function handleAdd() {
    if (!selectedItineraryId) {
      alert('Please select or create an itinerary first from your Dashboard.');
      return;
    }

    setLoading(true);
    try {
      const res = await addAttractionToItineraryAction(
        selectedItineraryId,
        attractionId,
        dayNumber,
        timeSlot,
        notes
      );

      if (res.error) {
        alert(res.error);
      } else {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          setIsOpen(false);
        }, 1500);
      }
    } catch {
      alert('Failed to add attraction to trip.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all active:scale-95"
      >
        <Calendar className="w-4 h-4" />
        <span>Add to My Trip</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sky-600 font-bold">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg text-slate-900">Add to Trip Itinerary</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Add <span className="font-bold text-slate-800">"{attractionTitle}"</span> to your planned days in Bahir Dar.
              </p>

              {userItineraries.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs space-y-2">
                  <p className="font-semibold">You do not have any trips created yet.</p>
                  <p>Visit your dashboard to start your first custom Bahir Dar itinerary.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Itinerary
                    </label>
                    <select
                      value={selectedItineraryId}
                      onChange={(e) => setSelectedItineraryId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    >
                      {userItineraries.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.title} ({it.durationDays} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Itinerary Day
                      </label>
                      <select
                        value={dayNumber}
                        onChange={(e) => setDayNumber(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      >
                        {Array.from({ length: maxDays }).map((_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            Day {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Time of Day
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      >
                        <option value="Morning">Morning (08:00 - 12:00)</option>
                        <option value="Afternoon">Afternoon (13:00 - 17:00)</option>
                        <option value="Evening / Sunset">Evening / Sunset</option>
                        <option value="Full Day">Full Day</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Personal Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hire morning boat, bring sun protection"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              {userItineraries.length > 0 && (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={loading || successMsg}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {successMsg ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to Day {dayNumber}!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Add to Itinerary'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
