import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(request: Request) {
  try {
    const profile = currentProfile();
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    if (!channelId) {
      return NextResponse.json(
        { error: "Channel ID Missing" },
        { status: 400 }
      );
    }
    let messages: Message[] = [];
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          channelId
        },
        include: {
          member: {
            include: { profile: true }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId
        },
        include: {
          member: {
            include: { profile: true }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
