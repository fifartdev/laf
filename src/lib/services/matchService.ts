import { matchRepo } from "@/lib/repositories/mock/mockMatchRepo";
import { lostItemRepo } from "@/lib/repositories/mock/mockLostItemRepo";
import { foundItemRepo } from "@/lib/repositories/mock/mockFoundItemRepo";
import { notificationService } from "./notificationService";
import type { Match, LostItemReport, FoundItem, MatchWithDetails } from "@/types/models";
import { userRepo } from "@/lib/repositories/mock/mockUserRepo";

function computeMatchScore(lost: LostItemReport, found: FoundItem): number {
  let score = 0;

  // Category match is most important
  if (lost.category === found.category) score += 50;

  // Date proximity (within 3 days)
  const lostDate = new Date(lost.dateLastSeen).getTime();
  const foundDate = new Date(found.dateFound).getTime();
  const daysDiff = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24);
  if (daysDiff === 0) score += 30;
  else if (daysDiff <= 1) score += 20;
  else if (daysDiff <= 3) score += 10;

  // Same hotel
  if (lost.hotelId === found.hotelId) score += 20;

  return Math.min(score, 100);
}

export const matchService = {
  async getAll(hotelId: string): Promise<Match[]> {
    return matchRepo.findAll({ hotelId });
  },

  async getById(id: string): Promise<MatchWithDetails | null> {
    const match = await matchRepo.findById(id);
    if (!match) return null;

    const [lostItem, foundItem] = await Promise.all([
      lostItemRepo.findById(match.lostItemId),
      foundItemRepo.findById(match.foundItemId),
    ]);
    if (!lostItem || !foundItem) return null;

    const guest = await userRepo.findById(lostItem.guestId);
    if (!guest) return null;

    const staffMember = match.matchedByStaffId
      ? await userRepo.findById(match.matchedByStaffId)
      : undefined;

    return {
      ...match,
      lostItem,
      foundItem,
      guest: { id: guest.id, name: guest.name, email: guest.email, phone: guest.phone },
      staffMember: staffMember
        ? { id: staffMember.id, name: staffMember.name }
        : undefined,
    };
  },

  async createMatch(
    lostItemId: string,
    foundItemId: string,
    hotelId: string,
    staffId: string,
    notes?: string
  ): Promise<Match> {
    const [lostItem, foundItem] = await Promise.all([
      lostItemRepo.findById(lostItemId),
      foundItemRepo.findById(foundItemId),
    ]);
    if (!lostItem || !foundItem) throw new Error("Items not found");

    const score = computeMatchScore(lostItem, foundItem);

    const match = await matchRepo.create({
      lostItemId,
      foundItemId,
      hotelId,
      status: "pending",
      matchScore: score,
      matchedByStaffId: staffId,
      staffNotes: notes,
    });

    // Update item statuses
    await Promise.all([
      lostItemRepo.update(lostItemId, { status: "matched", matchId: match.id }),
      foundItemRepo.update(foundItemId, { status: "matched", matchId: match.id }),
    ]);

    // Notify the guest
    await notificationService.create({
      recipientId: lostItem.guestId,
      type: "match_found",
      title: "Potential match found!",
      message: `We found an item that may match your lost ${lostItem.title}. Please review.`,
      relatedMatchId: match.id,
      relatedLostItemId: lostItemId,
      relatedFoundItemId: foundItemId,
    });

    return match;
  },

  async updateStatus(
    id: string,
    status: Match["status"],
    staffId?: string,
    notes?: string
  ): Promise<Match | null> {
    const match = await matchRepo.findById(id);
    if (!match) return null;

    const updates: Partial<Match> = { status };
    if (notes) updates.staffNotes = notes;
    if (status === "resolved") updates.resolvedAt = new Date().toISOString();

    const updated = await matchRepo.update(id, updates);

    // Notify the guest on key status changes
    const lostItem = await lostItemRepo.findById(match.lostItemId);
    if (lostItem) {
      if (status === "confirmed") {
        await Promise.all([
          lostItemRepo.update(match.lostItemId, { status: "matched" }),
          notificationService.create({
            recipientId: lostItem.guestId,
            type: "match_confirmed",
            title: "Match confirmed — your item is ready for pickup!",
            message: `Your lost ${lostItem.title} has been confirmed. Visit the front desk to collect it.`,
            relatedMatchId: id,
          }),
        ]);
      } else if (status === "rejected") {
        await Promise.all([
          lostItemRepo.update(match.lostItemId, { status: "open", matchId: undefined }),
          foundItemRepo.update(match.foundItemId, { status: "unclaimed", matchId: undefined }),
          notificationService.create({
            recipientId: lostItem.guestId,
            type: "match_rejected",
            title: "Match update",
            message: `The potential match for your ${lostItem.title} was not a fit. We'll keep looking.`,
            relatedMatchId: id,
          }),
        ]);
      } else if (status === "resolved") {
        await Promise.all([
          lostItemRepo.update(match.lostItemId, { status: "resolved" }),
          foundItemRepo.update(match.foundItemId, { status: "claimed" }),
          notificationService.create({
            recipientId: lostItem.guestId,
            type: "item_returned",
            title: "Item returned!",
            message: `Your ${lostItem.title} has been marked as returned. Thank you!`,
            relatedMatchId: id,
          }),
        ]);
      }
    }

    return updated;
  },

  async runAutoMatch(newLostItem: LostItemReport): Promise<void> {
    const foundItems = await foundItemRepo.findAll({
      hotelId: newLostItem.hotelId,
      status: "unclaimed",
    });

    const candidates = foundItems
      .map((fi) => ({ item: fi, score: computeMatchScore(newLostItem, fi) }))
      .filter(({ score }) => score >= 70)
      .sort((a, b) => b.score - a.score);

    if (candidates.length === 0) return;

    const best = candidates[0];
    const match = await matchRepo.create({
      lostItemId: newLostItem.id,
      foundItemId: best.item.id,
      hotelId: newLostItem.hotelId,
      status: "pending",
      matchScore: best.score,
    });

    await Promise.all([
      lostItemRepo.update(newLostItem.id, { status: "matched", matchId: match.id }),
      foundItemRepo.update(best.item.id, { status: "matched", matchId: match.id }),
      notificationService.create({
        recipientId: newLostItem.guestId,
        type: "match_found",
        title: "Potential match found!",
        message: `We found an item that may match your lost ${newLostItem.title}.`,
        relatedMatchId: match.id,
        relatedLostItemId: newLostItem.id,
        relatedFoundItemId: best.item.id,
      }),
    ]);
  },
};
