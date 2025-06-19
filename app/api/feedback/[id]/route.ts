import { NextRequest, NextResponse } from "next/server";
import { getFeedback } from "../../../../src/store.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const feedback = getFeedback(params.id);
  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: feedback.id,
    feedback_id: feedback.feedbackId,
    entry_id: feedback.entryId,
    thread_id: feedback.threadId,
    user_id: feedback.userId,
    rating: feedback.rating,
    comment: feedback.comment,
    created_at: feedback.createdAt,
  });
}