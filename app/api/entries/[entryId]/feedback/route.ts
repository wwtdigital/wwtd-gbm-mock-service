import { NextRequest, NextResponse } from "next/server";
import { getFeedbackByEntry } from "../../../../../src/store.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { entryId: string } },
) {
  const feedbackList = getFeedbackByEntry(params.entryId);

  const formatted = feedbackList.map((feedback) => ({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  }));

  return NextResponse.json(formatted);
}