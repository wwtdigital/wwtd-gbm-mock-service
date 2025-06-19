import { NextRequest, NextResponse } from "next/server";
import { getFeedback } from "@/src/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const feedback = getFeedback(id);
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